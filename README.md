<h1 align="center"> SplitIsh</h1>
<p align="center">
 <a href=""><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" /></a>
 <a href=""><img alt="Nodejs" src="https://aleen42.github.io/badges/src/node.svg" target="_blank" /></a>
 <a href=""><img alt="NPM version" src="https://img.shields.io/badge/npm-v6.14.10-blue" target="_blank" /></a>
 <a href=""><img alt="Dependencies" src="https://img.shields.io/badge/dependencies%20-up%20to%20date-orange" target="_blank" /></a>
</p>

## Table of Contents
* [Description](#description)
    * [User Story](#user-story)
* [Technologies](#technologies)
* [Usage](#usage)
    * [Deployment and Demo](#deployment-and-demo)
    * [Screenshots](#screenshots)
    * [Tips](#tips)
* [Contributors](#contributors)
* [Contributing](#contributing)
* [License](#license)

## Description
SplitIsh is a cost sharing app that helps its users to monitor their finances by allowing them to split bills with friends, family, roommates etc. A new wallet can be created, an expense added and the group can decide how to split the bill.  The app also allows its users to track their expenses, spending and budgeting. 

### User Story:
```
User Story
As a young adult 
I want to be able to easily share costs and track my expenses and spending
So that I can stay on top of my finances
```
```
Given a wallet app
When I create a new account and/or log in
Then I am able to view my user profile and a list of the wallets I created (public/shared and private)
When I create a new wallet
Then I am able give the wallet a name, add a category and invite participants
When I view an available/existing wallet
Then I am able to view a list of expenses by name, amount, date and paid by 
When I add a new expense in a wallet
Then I am able to to give the expense a name, add the amount, category of the expense, descritption, date, paid by and allocate the share distribution of the expense 
When I edit an expense
Then I am able to edit the name , amount, description, category, date, paid by and the share distribution % owed
When I edit a wallet
Then I am able to edit the name of the wallet, add categories and invite/remove participants.

```
## Technologies

* [Bootstrap](https://getbootstrap.com/)/[CSS3](https://www.w3schools.com/css/default.asp)/[HTML5](https://www.w3schools.com/html/)
* [JQuery](https://jquery.com/)
* [Git](https://git-scm.com/)/[GitHub](https://github.com/features)
* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Express-session](https://www.npmjs.com/package/express-session)
* [Bcrypt.js](https://www.npmjs.com/package/bcryptjs)
* [Handlebars](https://handlebarsjs.com/)
* [Heroku](https://www.heroku.com/)
* [MySQL](https://dev.mysql.com/doc/)
* [Sequelize ORM](https://sequelize.org/)
* [Nodemailer](https://thisdavej.com/node-js-sending-email-notifications-using-nodemailer-and-gmail/) (email invites/notification)

## Usage
A first time user needs to sign up to access the app. Once the sign up or log in process is complete, the user is re-directed to the user profile page. This page displays the user's name, email and wallets (if a wallet was already created). The user is able to add a wallet by providing a wallet name, category, select the wallet status(publis or private) and add users to the wallet. Email notificateions will be sent to the users added. Once a wallet is created the user is able to view the wallet or update the wallet information. Once the user views the wallet, they are able to see a list of expenses that were added previously. Expenses can also be added or edited. 

### Deployment and Demo
Heroku was used for app deployment.

### Screenshots
### The user interface is responsive and adapts to all screen sizes. Click on the arrows to drop down more images at various screen sizes.

<details>
  <summary>Image of app</summary>
</details>
<details>
  <summary>Image of app</summary>
</details>
<details>
  <summary>image of app</summary>
</details>

### Tips
1. You are able to clone this repo or download a zip file to your local machine.
2. If you have cloned a repo and a package.json exists, you are able to see the dependencies and dev dependecies used in the application. If this is the case run the below comand to get all the depencies need for that application.
```
$ npm i
```
3. When using Heroku to deploy your app ensure that your `package.json` file is set up correctly. It must have a `start` script and all the project's dependencies defined. E.g.:
```
  },
     "scripts": {
       "start": "node server.js"
     }
   }
```
## Contributors
* Roy Atallah- [https://github.com/R-A-exe](https://github.com/R-A-exe)
* Nashica Walters- [https://github.com/nashwalters](https://github.com/nashwalters)
* Farouk Kisuule- [https://github.com/Farouk994](https://github.com/Farouk994)

## Contributing
Please first discuss the change you wish to make via issue or email, before making a change. See [Contributors](#contributors) section for links to our github profiles with email information.

Steps to contribute:
1. Fork the repo on GitHub.
2. Clone the project to your own machine.
3. Commit changes to your own branch.
4. Push your work back up to your fork/branch.
5. Submit a Pull Request so that we can review your changes.


## License 

