'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "password" on table "users"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2026-06-22T07:22:51.760Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "changeColumn",
    params: [
        "users",
        "password",
        {
            "type": Sequelize.STRING,
            "field": "password",
            "default": false,
            "allowNull": false
        }
    ]
}];

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
