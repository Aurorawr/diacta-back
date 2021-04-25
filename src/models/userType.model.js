module.exports = (sequelize, Sequelize) => {
    const UserType = sequelize.define("UserType", {
      name: {
        type: Sequelize.STRING(32),
        allowNull: false
      }
    });
  
    return UserType;
  };