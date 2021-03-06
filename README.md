# Ext Grid Booster

[![Build Status](https://travis-ci.org/lechuckroh/ext-grid-booster.svg?branch=master)](https://travis-ci.org/lechuckroh/ext-grid-booster)

[[한국어](README_ko.md)]

ExtJS Grid booster for huge dataset.

This project is inspired by [ExtSpeeder](http://www.extspeeder.com/) (which provides full features including source code generation).

#### How-to
* [Configuration](docs/configuration.md)
* [Creating demo application](docs/demoapp.md)
* [Customization](docs/customization.md)

## Requirements
* node.js v7.0+

## Commands

```bash
# install modules
$ npm install

# run test
$ npm test

# generate coverage report to 'output/coverage.html'
$ npm htmlcov

# start server
$ npm start
```

## Configuration
1. Copy `config/config.sample.json` to `config/config.json` file.
2. Edit `config/config.json` file

See [Configuration](docs/configuration.md) for more details.

## Docker
```bash
# create image
$ docker build -t ext-grid-booster:1.0 .

# run image
$ docker run -d -p 9990:9990 ext-grid-booster:1.0

# container log
$ docker logs --follow {CONTAINER_HASH}
```

## References
* [Lab](https://github.com/hapijs/lab) : Node Test Utility
* [Joi](https://github.com/hapijs/joi) : Object Schema Validation
    * [API Reference](https://github.com/hapijs/joi/blob/master/API.md)
* [Code](https://github.com/hapijs/code) : BDD Assertion Library
    * [API Reference](https://github.com/hapijs/code/blob/master/API.md)
* [Sequelize Document](http://docs.sequelizejs.com/en/latest/) : ORM
