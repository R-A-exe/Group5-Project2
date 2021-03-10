const bcrypt = require('bcryptjs');


module.exports = function (sequelize, DataTypes) {
    var Invite = sequelize.define('Invite',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            token: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            walletId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        });

    Invite.prototype.getToken = function (token) {
        if (bcrypt.compareSync(token, this.token)) {
            return this.walletId;
        }
    };

    Invite.addHook('beforeCreate', invite => {
        invite.token = bcrypt.hashSync(
            invite.token,
            bcrypt.genSaltSync(10),
            null
        );
    });

    return Invite;
}