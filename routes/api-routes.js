// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");
const e = require("express");
const { sequelize } = require("../models");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea

    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", async (req, res) => {
    try {
      await signup(req);
      res.redirect(307, "/api/login");
    } catch (err) {
      res.status(401).send('unauthorized');
    }
  });

  app.post("/api/signup/:token", async (req, res) => {
    var user = await signup(req);
    if (user) {
      try {
        var wallet = await db.Wallet.findOne({
          include: [{
            model: db.Invite,
            attributes: ['token', 'email'],
            where: {
              token: req.params.token,
              email: user.email
            }
          }]
        });
        await wallet.addUser(user, { through: { selfGranted: false } });
        await db.Invite.destroy({ where: { token: req.params.token, email: user.email, walletId: wallet.id } });
        res.redirect(307, "/api/login");
      } catch (err) {
        res.status(401).send('unauthorized');
      }
    } else {
      res.status(401).send('unauthorized');
    }
  });

  async function signup(req) {
    try {
      var user = await db.User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
    } catch (err) {
      return err;
    }
    return user;
  }

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", isAuthenticated, (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //Get route for getting all wallets
  app.get("/api/wallets/", isAuthenticated, async function (req, res) {

    var private = await db.Wallet.findAll({
      where: {
        owner: req.user.id,
        public: false
      }
    });

    var public = await db.Wallet.findAll({
      where: {
        owner: req.user.id,
        public: true
      }
    })

    var shared = await sequelize.query(
      `SELECT Wallets.id, Wallets.title, Wallets.category, Wallets.public ,Wallets.createdAt, Wallets.updatedAt, Users.name as owner FROM Wallets JOIN Users ON Wallets.owner = Users.id JOIN wallet_user ON Wallets.id = wallet_user.walletId WHERE wallet_user.userId = ${req.user.id} AND NOT Wallets.owner = ${req.user.id}`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json({ private: private, public: public, shared: shared });

  });

  app.get("/api/users/:id", isAuthenticated, async function (req, res) {
    var added = await sequelize.query(`SELECT Users.email FROM wallet_user JOIN Users ON wallet_user.userId = Users.id WHERE wallet_user.walletId = ${req.params.id}`, { type: sequelize.QueryTypes.SELECT });
    var invited = await db.Invite.findAll({where:{walletId: req.params.id}})

    if (added.find(e => e.email == req.user.email)) {
      res.json({added: added, invited: invited});
    } else {
      res.status(401).send('unauthorized');
    }

  });

  // Get route for retrieving a single wallet
  app.get("/api/wallets/:id", isAuthenticated, async function (req, res) {
    
    var validate = await sequelize.query(
      `SELECT WalletId FROM wallet_user WHERE UserId=${req.user.id} AND WalletId=${req.params.id}`
    );

    if (validate) {

      var walletInfo = await db.Wallet.findOne({
        include: [{
          model: db.User,
          attributes: ['id', 'name', 'email'],
        }],
        where: {
          id: req.params.id
        }
      });
      var expenses = await db.Expense.findAll({
        where: {
          WalletId: req.params.id
        }
      });
      var shares = await db.Expense.findAll({
        attributes: ['id', 'amount'],
        include: [{ model: db.Split, attributes: ['share', 'userId'], required: true }],
        where: {
          WalletId: req.params.id
        }
      });
      var invited = await db.Invite.findAll({
        where: {
          walletId: req.params.id
        }
      })

      var response = { wallet: walletInfo, expenses: expenses, shares: shares, invited: invited, me: req.user.id };
      res.status(200);
      res.json(response);
    } else {
      res.status(401);
      res.send('Unauthorized')
    }

  });

  // POST route for saving a new wallet
  app.post("/api/wallets", isAuthenticated, async function (req, res) {
    try {
      var wallet = await db.Wallet.create({
        title: req.body.title,
        category: req.body.category,
        public: req.body.public,
        owner: req.user.id,
      });
    } catch (err) {
      res.status(400).send('could not add item');
      return;
    }
    await wallet.addUser(req.user.id, { through: { selfGranted: false } });

    if (wallet.public && req.body.emails) {
      for (var i = 0; i < req.body.emails.length; i++) {
        var email = req.body.emails[i]
        var user = await db.User.findOne({
          where: {
            email: email
          }
        });

        if (user) {
          await wallet.addUser(user, { through: { selfGranted: false } });
        } else {
          createInvite(email, wallet.id, req.user.name, req.headers.host);
        }
      }
    }
    res.send(wallet);

  });

  // PUT route for updating wallet
  app.put("/api/wallets/:id", isAuthenticated, async function (req, res) {

    var wallet = await db.Wallet.findOne({
      where: {
        id: req.params.id,
        owner: req.user.id
      }
    });
      await db.Wallet.update({
        title: req.body.title,
      },
        {
          where: {
            id: req.params.id,
            owner: req.user.id
          }
        });

    if (req.body.category) {
      await db.Wallet.update({
        category: sequelize.fn('CONCAT', sequelize.col("category"), req.body.category),
      },
        {
          where: {
            id: req.params.id,
            owner: req.user.id
          }
        });
    }

    if (wallet.public && req.body.emails) {
      for (var i = 0; i < req.body.emails.length; i++) {
        var email = req.body.emails[i]
        var user = await db.User.findOne({
          where: {
            email: email
          }
        });

        if (user) {
          await wallet.addUser(user, { through: { selfGranted: false } });
        } else {
          createInvite(email, wallet.id, req.user.name, req.headers.host);
        }
      }
    }

    res.send(wallet);

  });


  // POST route for saving a new expense
  app.post("/api/expenses", isAuthenticated, async function (req, res) {


    var validate = await db.Wallet.findOne({
      include: [{
        model: db.User,
        attributes: ['id'],
        where: {
          id: req.user.id,
        }
      }], where: { id: req.body.walletId }
    }
    );

    if (validate) {

      const t = await db.sequelize.transaction();
      try {
        // Then, we do some calls passing this transaction as an option:
        const expense = await db.Expense.create({
          title: req.body.title,
          amount: parseFloat(req.body.amount),
          description: req.body.description,
          category: req.body.category,
          date: req.body.date,
          paidBy: req.body.paidBy,
          walletId: req.body.walletId
        }, { transaction: t });

        var map = req.body.map;
        for (var i = 0; i < map.length; i++) {
          await db.Split.create({
            share: map[i].share,
            userId: map[i].userId,
            expenseId: expense.id
          }, { transaction: t });
        }

        // If the execution reaches this line, no errors were thrown.
        // We commit the transaction.
        await t.commit();
        res.status(200);
        res.send("added");
      } catch (error) {
        console.log(error)
        // If the execution reaches this line, an error was thrown.
        // We rollback the transaction.
        await t.rollback();
        res.status(400)
        res.send(error)
      }
    } else {
      res.status(401);
      res.send('unauthorized');
    }
  });

  // PUT route for updating an expense
  app.put("/api/expenses/:id", isAuthenticated, async function (req, res) {

    var validate = await db.Wallet.findOne({
      include: [{
        model: db.User,
        attributes: ['id'],
        where: {
          id: req.user.id,
        }
      }], where: { id: req.body.walletId }
    }
    );

    if (validate) {
      try {
        await db.Expense.update({
          title: req.body.title,
          amount: parseFloat(req.body.amount),
          description: req.body.description,
          category: req.body.category,
          date: req.body.date,
          paidBy: req.body.paidBy,
          walletId: req.body.walletId
        },
          {
            where: {
              id: req.params.id,
            }
          });
        var map = req.body.map;
        for (var i = 0; i < map.length; i++) {
          var splitUpdate = await db.Split.update({
            share: map[i].share
          },
            {
              where: {
                expenseId: req.params.id,
                userId: map[i].userId
              }
            });
            if(splitUpdate[0]==0){
              await db.Split.create({
                share: map[i].share,
                userId: map[i].userId,
                expenseId: req.params.id
              });
            }
        }
        
        res.status(200);
        res.send('updated')
      } catch (e) {
        res.status(400);
        res.send(e);
      }
    } else {
      res.status(401);
      res.send('unauthorized')
    }
  });


  async function createInvite(email, wallet, name, host) {


    await db.Invite.destroy({
      where: {
        email: email,
        walletId: wallet
      }
    });

    var invite = await db.Invite.create({
      email: email,
      token: "" + Math.random() * 9999999999999,
      walletId: wallet
    });

    var link;
    if (host == 'localhost:8080') {
      link = `http://localhost:8080/signup.html?id=${invite.token}`
    } else {
      link = `https://${host}/signup.html?id=${invite.token}`
    }

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'splitish.invite@gmail.com',
        pass: process.env.email_password
      }
    });

    var mailOptions = {
      from: 'splitish.invite@gmail.com',
      to: email,
      subject: `${name} invited you to share a wallet!`,
      html: `<h1>Get started with SplitIsh</h1><p>${name} has invited you to share a wallet, click <a href="${link}">here</a> to signup and get started!</p>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });



  }

}