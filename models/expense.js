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
            len: {
                len: [1-255],
              }
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1-255],
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
      
        Expense.hasMany(models.Split,{
            foreignKey: 'expenseId'
        });
      };

return Expense;

};