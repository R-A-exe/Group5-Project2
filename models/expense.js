//expenses: id, amount, title, description, category, date, paid_by, wallet_id

module.exports = function(sequelize, DataTypes){

    var Expense = sequelize.define('Expense',
    {
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1-255],
                msg:"error_expense_name_size"
              }
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1-255],
                msg:"error_expense_description_size"
              }
        },
        category:{
            type:DataTypes.STRING,
            allowNull: true,
        },
        date:{
            type:DataTypes.DATEONLY,
            allowNull: true,
        }
    });

    Expense.associate = function(models) {
        Expense.belongsTo(models.User, {
            as: 'paidBy',
            foreignKey: {
                allowNull: false
              }
        });
        Expense.belongsTo(models.Wallet,{
            foreignKey: {
                allowNull: false
              }
        });
        Expense.hasMany(models.Split);
      };

return Expense;

};