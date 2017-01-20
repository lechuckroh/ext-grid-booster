# Ext Grid Booster

ExtJS Grid booster for huge dataset.

This project is inspired by [ExtSpeeder](http://www.extspeeder.com/) (which provides full features including source code generation).

## Requirements
* node.js v5.0+
* [yarn](https://yarnpkg.com/) (Optional)

All the command lines are based on `yarn`.
If you have not installed `yarn`, you can use `npm` instead.

## Install modules
```bash
$ yarn install
```

## Test
```bash
# run test
$ yarn test

# generate coverage report to 'output/coverage.html'
$ yarn htmlcov
```

## Configuration
1. Copy `config/config.sample.json` to `config/config.json` file.
2. Edit `config/config.json` file.
    * `development` : for development
    * `test` : for unit test
    * `production` : for production operation

## Run
```bash
$ yarn start
```

## References
* [Lab](https://github.com/hapijs/lab) : Node Test Utility
* [Joi](https://github.com/hapijs/joi) : Object Schema Validation
    * [API Reference](https://github.com/hapijs/joi/blob/master/API.md)
* [Code](https://github.com/hapijs/code) : BDD Assertion Library
    * [API Reference](https://github.com/hapijs/code/blob/master/API.md)
* [Sequelize Document](http://docs.sequelizejs.com/en/latest/) : ORM
