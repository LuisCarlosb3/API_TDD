"use strict";
module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define(
    "account",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    {}
  );
  account.associate = function(models) {
    account.belongsTo(models.user, {
      onDelete: "CASCADE",
      foreignKey: "user_id"
    });
  };
  return account;
};
