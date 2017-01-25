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

/**
 * Scan models in the 'dir' directory.
 */
const scanDir = function (dir, excludes = []) {
    fs.readdirSync(dir)
        .filter(file => {
            return (file.indexOf('.') !== 0) &&
                (file !== basename) &&
                (file.slice(-3) === '.js') &&
                excludes.indexOf(file) < 0;
        })
        .forEach(file => {
            const model = sequelize.import(path.join(dir, file));
            db[model.name] = model;
        });

    // associate relations
    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
};

scanDir(__dirname, ['model_helper.js']);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.scanDir = scanDir;

module.exports = db;
