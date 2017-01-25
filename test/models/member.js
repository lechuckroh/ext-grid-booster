'use strict';

const helper = require('../../src/models/model_helper');

module.exports = function (sequelize, DataTypes) {
    const Member = sequelize.define("Member", {
        name: helper.STRING(DataTypes, 'name', 80, {
            allowNull: false
        }),
        address: helper.STRING(DataTypes, 'address', 100, {
            allowNull: true
        }),
        teamId: helper.BIGINT(DataTypes, 'team_id', {
            allowNull: true
        }),
        age: helper.INTEGER(DataTypes, 'age', {
            allowNull: true
        })
    }, {
        tableName: 'member',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Member.hasOne(models.Team);
            }
        }
    });

    return Member;
};
