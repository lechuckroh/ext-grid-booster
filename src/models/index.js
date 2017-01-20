'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('../config');
const db = {};

let cfg = {};
Object.assign(cfg, config);

// common options for sequelize.define
cfg.define = {
    timestamps: false,
    underscored: true
};

const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) &&
            (file !== basename) &&
            (file.slice(-3) === '.js') &&
            file !== 'modelHelper.js';
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
