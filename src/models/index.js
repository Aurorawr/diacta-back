const {
  DB,
  USER,
  PASSWORD,
  HOST,
  dialect,
  pool: {
    min,
    max,
    acquire,
    idle
  }
} = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  DB,
  USER,
  PASSWORD,
  {
    host: HOST,
    dialect: dialect,
    operatorsAliases: false,

    pool: {
      max: max,
      min: min,
      acquire: acquire,
      idle: idle
    }
  }
);

const User = require("./user.model.js")(sequelize, Sequelize);
const UserType = require("./userType.model.js")(sequelize, Sequelize);

UserType.hasMany(User, {
  foreignKey: 'userTypeId'
});
User.belongsTo(UserType, {
  foreignKey: 'userTypeId'
});

module.exports = {
    sequelize,
    User,
    UserType
};
