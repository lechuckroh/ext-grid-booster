# Ext Grid Booster

[![Build Status](https://travis-ci.org/lechuckroh/ext-grid-booster.svg?branch=master)](https://travis-ci.org/lechuckroh/ext-grid-booster)

ExtJS Grid booster for huge dataset.

This project is inspired by [ExtSpeeder](http://www.extspeeder.com/) (which provides full features including source code generation).

#### How-to
* [Configuration](docs/configuration.md)
* [Creating demo application](docs/demoapp.md)
* [Customization](docs/customization.md)

## Requirements
* node.js v7.0+
* [yarn](https://yarnpkg.com/) (Optional)

All the command lines are based on `yarn`.
If you have not installed `yarn`, you can use `npm` instead.

## Commands

```bash
# install modules
$ yarn install

# run test
$ yarm test

# generate coverage report to 'output/coverage.html'
$ yarn htmlcov

# start server
$ yarn start
```

## Configuration
1. Copy `config/config.sample.json` to `config/config.json` file.
2. Edit `config/config.json` file

See [Customization](docs/customization.md) for more details.

## References
* [Lab](https://github.com/hapijs/lab) : Node Test Utility
* [Joi](https://github.com/hapijs/joi) : Object Schema Validation
    * [API Reference](https://github.com/hapijs/joi/blob/master/API.md)
* [Code](https://github.com/hapijs/code) : BDD Assertion Library
    * [API Reference](https://github.com/hapijs/code/blob/master/API.md)
* [Sequelize Document](http://docs.sequelizejs.com/en/latest/) : ORM
