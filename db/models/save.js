const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Save extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Save.init({
    user_id: DataTypes.INTEGER,
    harvested: DataTypes.INTEGER,
    required_harvest: DataTypes.INTEGER,
    energy: DataTypes.INTEGER,
    tilemap: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Save',
  });
  return Save;
};
