"use strict";
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    "transaction",
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM(["I", "O"]),
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      ammout: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  transaction.associate = function(models) {
    return transaction.belongsTo(models.account, {
      foreignKey: "account_id",
      onDelete: "CASCADE"
    });
  };
  return transaction;
};
