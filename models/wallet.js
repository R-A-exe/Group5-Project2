//wallets: id, title, categories(array), user_id as owner, public (boolean)

module.exports = function (sequelize, DataTypes) {
    const Wallet = sequelize.define("Wallet", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1 - 255],
                msg: "error_wallet_name_size"
            }
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