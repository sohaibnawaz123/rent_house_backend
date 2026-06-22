module.exports = (sequelize, DataTypes) => {
  const transfers = sequelize.define(
    "transfers",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      from_location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to_location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transfer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "transfers",
      timestamps: true,
    }
  );

  transfers.associate = (models) => {
    transfers.belongsTo(models.locations, {
      foreignKey: "from_location_id",
      as: "fromLocation",
    });

    transfers.belongsTo(models.locations, {
      foreignKey: "to_location_id",
      as: "toLocation",
    });
  };

  return transfers;
};
