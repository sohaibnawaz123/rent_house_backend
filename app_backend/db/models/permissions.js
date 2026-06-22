module.exports = (sequelize, DataTypes) => {
    const permissions = sequelize.define(
        "permissions",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            key: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            }
        },
        {
            tableName: "permissions",
            timestamps: true
        }
    );

    permissions.associate = (models) => {
        permissions.belongsToMany(models.roles, {
            through: models.rolePermissions,
            foreignKey: "permission_id"
        });
    };

    return permissions;
};
