module.exports = (sequelize, DataTypes) => {
    const roles = sequelize.define(
        "roles",
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
            description: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },
        {
            tableName: "roles",
            timestamps: true
        }
    );

    roles.associate = (models) => {
        // Many-to-many with permissions
        roles.belongsToMany(models.permissions, {
            through: models.rolePermissions,
            foreignKey: "role_id"
        });
    };

    return roles;
};
