'use strict';

const helper = require('./model_helper');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Personnel", {
        name: helper.STRING(DataTypes, 'name', 40, {
            allowNull: false
        }),
        email: helper.STRING(DataTypes, 'email', 60, {
            allowNull: true
        }),
        phone: helper.STRING(DataTypes, 'phone', 20, {
            allowNull: true
        })
    }, {
        tableName: 'personnel',
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });
};
