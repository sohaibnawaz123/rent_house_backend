module.exports = (sequelize, DataTypes) => {
    const rolePermissions = sequelize.define(
        "role_permissions",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "role_permissions",
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["role_id", "permission_id"]
                }
            ]
        }
    );

    return rolePermissions;
};
