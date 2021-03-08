// split: id, expense_id, user_id, share(%)
module.exports = function(sequelize, DataTypes){
    var Split = sequelize.define('Split',{

        share:{
            type: DataTypes.FLOAT,
            validate:{
                min:0,
                max:1
            }
        }
    });
    
    return Split;
}