'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "countries", deps: []
 * createTable "email_otp_tokens", deps: []
 * createTable "permissions", deps: []
 * createTable "roles", deps: []
 * createTable "cities", deps: [countries]
 * createTable "locations", deps: [cities, countries]
 * createTable "users", deps: [roles]
 * createTable "role_permissions", deps: [roles, permissions]
 * createTable "transfers", deps: [locations, locations]
 * createTable "password_reset_tokens", deps: [users]
 * addIndex "role_permissions_role_id_permission_id" to table "role_permissions"
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2026-06-19T11:27:56.617Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "countries",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name"
                },
                "iso3": {
                    "type": Sequelize.STRING,
                    "field": "iso3"
                },
                "numeric_code": {
                    "type": Sequelize.STRING,
                    "field": "numeric_code"
                },
                "iso2": {
                    "type": Sequelize.STRING,
                    "field": "iso2"
                },
                "phonecode": {
                    "type": Sequelize.STRING,
                    "field": "phonecode"
                },
                "capital": {
                    "type": Sequelize.STRING,
                    "field": "capital"
                },
                "currency": {
                    "type": Sequelize.STRING,
                    "field": "currency"
                },
                "currency_name": {
                    "type": Sequelize.STRING,
                    "field": "currency_name"
                },
                "currency_symbol": {
                    "type": Sequelize.STRING,
                    "field": "currency_symbol"
                },
                "tld": {
                    "type": Sequelize.STRING,
                    "field": "tld"
                },
                "native": {
                    "type": Sequelize.STRING,
                    "field": "native"
                },
                "population": {
                    "type": Sequelize.BIGINT,
                    "field": "population"
                },
                "gdp": {
                    "type": Sequelize.BIGINT,
                    "field": "gdp"
                },
                "region": {
                    "type": Sequelize.STRING,
                    "field": "region"
                },
                "region_id": {
                    "type": Sequelize.INTEGER,
                    "field": "region_id"
                },
                "subregion": {
                    "type": Sequelize.STRING,
                    "field": "subregion"
                },
                "subregion_id": {
                    "type": Sequelize.INTEGER,
                    "field": "subregion_id"
                },
                "nationality": {
                    "type": Sequelize.STRING,
                    "field": "nationality"
                },
                "latitude": {
                    "type": Sequelize.DECIMAL,
                    "field": "latitude"
                },
                "longitude": {
                    "type": Sequelize.DECIMAL,
                    "field": "longitude"
                },
                "emoji": {
                    "type": Sequelize.STRING,
                    "field": "emoji"
                },
                "emojiU": {
                    "type": Sequelize.STRING,
                    "field": "emojiU"
                },
                "flag": {
                    "type": Sequelize.BOOLEAN,
                    "field": "flag"
                },
                "wikiDataId": {
                    "type": Sequelize.STRING,
                    "field": "wikiDataId"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "email_otp_tokens",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "allowNull": false
                },
                "otp_hash": {
                    "type": Sequelize.STRING(64),
                    "field": "otp_hash",
                    "allowNull": true
                },
                "expires_at": {
                    "type": Sequelize.DATE,
                    "field": "expires_at",
                    "allowNull": true
                },
                "used": {
                    "type": Sequelize.BOOLEAN,
                    "field": "used",
                    "defaultValue": false,
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "permissions",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(100),
                    "field": "name",
                    "unique": true,
                    "allowNull": false
                },
                "key": {
                    "type": Sequelize.STRING(100),
                    "field": "key",
                    "unique": true,
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "roles",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(100),
                    "field": "name",
                    "unique": true,
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.STRING(255),
                    "field": "description",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "cities",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(255),
                    "field": "name",
                    "allowNull": false
                },
                "state_id": {
                    "type": Sequelize.INTEGER,
                    "field": "state_id",
                    "allowNull": false
                },
                "state_code": {
                    "type": Sequelize.STRING(255),
                    "field": "state_code",
                    "allowNull": false
                },
                "country_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "countries",
                        "key": "id"
                    },
                    "field": "country_id",
                    "allowNull": false
                },
                "country_code": {
                    "type": Sequelize.CHAR(2),
                    "field": "country_code",
                    "allowNull": false
                },
                "type": {
                    "type": Sequelize.STRING(191),
                    "field": "type",
                    "allowNull": true
                },
                "level": {
                    "type": Sequelize.INTEGER,
                    "field": "level",
                    "allowNull": true
                },
                "parent_id": {
                    "type": Sequelize.INTEGER,
                    "field": "parent_id",
                    "allowNull": true
                },
                "latitude": {
                    "type": Sequelize.DECIMAL(10, 8),
                    "field": "latitude",
                    "allowNull": false
                },
                "longitude": {
                    "type": Sequelize.DECIMAL(11, 8),
                    "field": "longitude",
                    "allowNull": false
                },
                "native": {
                    "type": Sequelize.STRING(255),
                    "field": "native",
                    "allowNull": true
                },
                "population": {
                    "type": Sequelize.INTEGER,
                    "field": "population",
                    "allowNull": true
                },
                "timezone": {
                    "type": Sequelize.STRING(255),
                    "field": "timezone",
                    "allowNull": true
                },
                "translations": {
                    "type": Sequelize.TEXT,
                    "field": "translations",
                    "allowNull": true
                },
                "flag": {
                    "type": Sequelize.INTEGER,
                    "field": "flag",
                    "defaultValue": 1
                },
                "wikiDataId": {
                    "type": Sequelize.STRING(255),
                    "field": "wiki_data_id",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "locations",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                },
                "city_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "cities",
                        "key": "id"
                    },
                    "field": "city_id",
                    "allowNull": false
                },
                "country_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "countries",
                        "key": "id"
                    },
                    "field": "country_id",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "username": {
                    "type": Sequelize.STRING(25),
                    "field": "username"
                },
                "email": {
                    "type": Sequelize.STRING,
                    "field": "email",
                    "unique": true,
                    "allowNull": false
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "allowNull": false
                },
                "role_id": {
                    "type": Sequelize.INTEGER,
                    "field": "role_id",
                    "references": {
                        "model": "roles",
                        "key": "id"
                    },
                    "defaultValue": 2,
                    "allowNull": false
                },
                "email_verified": {
                    "type": Sequelize.BOOLEAN,
                    "field": "email_verified",
                    "defaultValue": false,
                    "allowNull": false
                },
                "email_verification_token": {
                    "type": Sequelize.STRING,
                    "field": "email_verification_token",
                    "allowNull": true
                },
                "email_verification_expires": {
                    "type": Sequelize.DATE,
                    "field": "email_verification_expires",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "role_permissions",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "role_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "roles",
                        "key": "id"
                    },
                    "unique": "role_permissions_role_id_permission_id_unique",
                    "field": "role_id",
                    "allowNull": false
                },
                "permission_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "permissions",
                        "key": "id"
                    },
                    "unique": "role_permissions_role_id_permission_id_unique",
                    "field": "permission_id",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "transfers",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "from_location_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "locations",
                        "key": "id"
                    },
                    "field": "from_location_id",
                    "allowNull": false
                },
                "to_location_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "locations",
                        "key": "id"
                    },
                    "field": "to_location_id",
                    "allowNull": false
                },
                "transfer_name": {
                    "type": Sequelize.STRING,
                    "field": "transfer_name",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "password_reset_tokens",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "field": "user_id",
                    "allowNull": false
                },
                "token": {
                    "type": Sequelize.STRING,
                    "field": "token",
                    "allowNull": false
                },
                "expires_at": {
                    "type": Sequelize.DATE,
                    "field": "expires_at",
                    "allowNull": false
                },
                "used_at": {
                    "type": Sequelize.DATE,
                    "field": "used_at",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "role_permissions",
            ["role_id", "permission_id"],
            {
                "indexName": "role_permissions_role_id_permission_id",
                "name": "role_permissions_role_id_permission_id",
                "indicesType": "UNIQUE",
                "type": "UNIQUE"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
