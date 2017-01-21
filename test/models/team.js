'use strict';

const helper = require('../../src/models/modelHelper');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Team", {
        name: helper.STRING(DataTypes, 'name', 40, {
            allowNull: false,
            unique: true
        }),
        alias: helper.STRING(DataTypes, 'alias', 20, {
            allowNull: true
        })
    }, {
        tableName: 'team',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
    });
};
