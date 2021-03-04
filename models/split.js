// split: id, expense_id, user_id, share(%)
module.exports = function(sequelize, DataTypes){
    var Split = sequelize.define('Split',{

        share:{
            type: DataTypes.DECIMAL,
            validate:{
                min:0,
                max:1
            }
        }
    });

    Split.associate = function(models){
        Split.belongsTo(models.Expense,{
            foreignKey: {
                allowNull: false
              }
        });
        Split.belongsTo(models.User,{
            foreignKey: {
                allowNull: false
              }
        });
    }
    
    return Split;
}