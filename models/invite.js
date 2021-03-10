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

    return Invite;
}