"use strict";

const tableExists = async (queryInterface, tableName) => {
    const tables = await queryInterface.showAllTables();
    return tables.some((table) => {
        const name = typeof table === "string"
            ? table
            : table.tableName || table.table_name;
        return name === tableName;
    });
};

const hasIndex = async (queryInterface, tableName, indexName) => {
    const indexes = await queryInterface.showIndex(tableName);
    return indexes.some((index) => index.name === indexName);
};

module.exports = {
    async up(queryInterface, Sequelize) {
        if (!(await tableExists(queryInterface, "favorites"))) {
            await queryInterface.createTable("favorites", {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                property_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "properties",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            });
        }

        if (
            !(await hasIndex(
                queryInterface,
                "favorites",
                "favorites_user_property_unique"
            ))
        ) {
            await queryInterface.addIndex(
                "favorites",
                ["user_id", "property_id"],
                {
                    unique: true,
                    name: "favorites_user_property_unique",
                }
            );
        }

        if (
            !(await hasIndex(
                queryInterface,
                "favorites",
                "favorites_property_id_idx"
            ))
        ) {
            await queryInterface.addIndex("favorites", ["property_id"], {
                name: "favorites_property_id_idx",
            });
        }
    },

    async down(queryInterface) {
        if (await tableExists(queryInterface, "favorites")) {
            await queryInterface.dropTable("favorites");
        }
    },
};
