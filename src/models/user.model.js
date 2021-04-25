module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
          notNull: {
            msg: "El nombre del usuario no puede ser nulo"
          },
          notEmpty: {
            msg: "El nombre del usuario no puede estar vacío"
          }
        }
      },
      lastname: {
        type: Sequelize.STRING(64)
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Ya existe una cuenta con el mismo email"
          },
          notNull: {
            msg: "El correo del usuario no puede ser nulo"
          },
          notEmpty: {
            msg: "El correo del usuario no puede estar vacío"
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      scopes: {
        withoutPassword: {
          attributes: { exclude: ['password'] }
        }
      }
    });
  
    return User;
  };