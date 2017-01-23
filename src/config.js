'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

const cfgPath = path.join(__dirname, '../config/config.json');

// Create config file if not exists.
if (!fs.existsSync(cfgPath)) {
    const sampleCfgPath = path.join(__dirname, '../config/config.sample.json');
    fs.copySync(sampleCfgPath, cfgPath);

    console.log(`Configuration file created : ${cfgPath}`);
}

const config = require(cfgPath);
const env = process.env.NODE_ENV || 'development';
const defaultConfig = config['default'];
const activeConfig = config[env];

// overwrite activeConfig settings in defaultConfig
_.defaultsDeep(activeConfig, defaultConfig);

module.exports = activeConfig;
