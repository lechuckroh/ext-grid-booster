'use strict';

const fs = require('fs-extra');
const path = require('path');

const cfgPath = path.join(__dirname, '../config/config.json');

// Create config file if not exists.
if (!fs.existsSync(cfgPath)) {
    const sampleCfgPath = path.join(__dirname, '../config/config.sample.json');
    fs.copySync(sampleCfgPath, cfgPath);

    // Exit process with return code = 1
    console.log(`Configuration file created : ${cfgPath}`);
}

const env = process.env.NODE_ENV || 'development';
const config = require(cfgPath)[env];

module.exports = config;
