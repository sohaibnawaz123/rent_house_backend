"use strict";

const hasIndex = async (queryInterface, tableName, indexName) => {
    const indexes = await queryInterface.showIndex(tableName);
    return indexes.some((index) => index.name === indexName);
};

module.exports = {
    async up(queryInterface, Sequelize) {
        const propertyColumns = await queryInterface.describeTable(
            "properties"
        );

        if (!propertyColumns.property_type) {
            await queryInterface.addColumn("properties", "property_type", {
                type: Sequelize.STRING(30),
                allowNull: false,
                defaultValue: "house",
            });
        }

        if (!propertyColumns.currency) {
            await queryInterface.addColumn("properties", "currency", {
                type: Sequelize.STRING(3),
                allowNull: false,
                defaultValue: "USD",
            });
        }

        if (!propertyColumns.price_period) {
            await queryInterface.addColumn("properties", "price_period", {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: "month",
            });
        }

        if (!propertyColumns.is_recommended) {
            await queryInterface.addColumn(
                "properties",
                "is_recommended",
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                }
            );
        }

        if (!propertyColumns.recommendation_score) {
            await queryInterface.addColumn(
                "properties",
                "recommendation_score",
                {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                }
            );
        }

        if (
            !(await hasIndex(
                queryInterface,
                "properties",
                "properties_home_recommended_idx"
            ))
        ) {
            await queryInterface.addIndex(
                "properties",
                ["is_active", "is_recommended"],
                { name: "properties_home_recommended_idx" }
            );
        }

        if (
            !(await hasIndex(
                queryInterface,
                "properties",
                "properties_home_popular_idx"
            ))
        ) {
            await queryInterface.addIndex(
                "properties",
                ["is_active", "views_count"],
                { name: "properties_home_popular_idx" }
            );
        }

        if (
            !(await hasIndex(
                queryInterface,
                "addresses",
                "addresses_coordinates_idx"
            ))
        ) {
            await queryInterface.addIndex("addresses", ["lat", "lon"], {
                name: "addresses_coordinates_idx",
            });
        }
    },

    async down(queryInterface) {
        if (
            await hasIndex(
                queryInterface,
                "addresses",
                "addresses_coordinates_idx"
            )
        ) {
            await queryInterface.removeIndex(
                "addresses",
                "addresses_coordinates_idx"
            );
        }

        for (const indexName of [
            "properties_home_popular_idx",
            "properties_home_recommended_idx",
        ]) {
            if (
                await hasIndex(
                    queryInterface,
                    "properties",
                    indexName
                )
            ) {
                await queryInterface.removeIndex("properties", indexName);
            }
        }

        const propertyColumns = await queryInterface.describeTable(
            "properties"
        );
        for (const columnName of [
            "recommendation_score",
            "is_recommended",
            "price_period",
            "currency",
            "property_type",
        ]) {
            if (propertyColumns[columnName]) {
                await queryInterface.removeColumn(
                    "properties",
                    columnName
                );
            }
        }
    },
};
