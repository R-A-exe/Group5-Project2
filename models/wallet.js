//wallets: id, title, categories(array), user_id as owner, public (boolean)

module.exports = function (sequelize, DataTypes) {
    const Wallet = sequelize.define("Wallet", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1 - 255],
            
        },
        category: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });

    Wallet.associate = function (models) {

        Wallet.hasMany(models.Expense, {
            foreignKey: 'walletId'
        });
        
        Wallet.belongsToMany(models.User, { through: 'wallet_user' });
    }
    return Wallet;
};