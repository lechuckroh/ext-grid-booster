# Configuration

`config/config.json` file stores the configuration.

By default, the `config/config.json` file does not exist.

On server startup, `config/config.sample.json` file is copied to `config/config.json` if not exists.
Or you can copy it manually.

## Setting profile
`development`, `test` and `production` are predefined profile names.

On server startup, profile name is read from `NODE_ENV` environment variable. If no values is set, `development` is used by default.

#### development
This profile is used while development.

#### test
This profile is used for testing. You don't have to set it manually because it is set automatically.

To run test:

```bash
$ npm test
```

#### production
Reserved for production environment.

To use this profile, you have to set `NODE_ENV` environment variable to `production`.

On Unix:
```bash
$ NODE_ENV=production npm start
```

On Windows:
```bash
$ set NODE_ENV=production
$ npm start
```

## Default settings
Values under `default` key are the default settings.

If a setting is not found in the profile setting, default setting will be used.

### Server settings
* `port` : server listening port
* `htdocs` : directory of static resource files

### DB settings
* `dialect` : The dialect of the database you are connecting to.
    * `mysql`
    * `postgres`
    * `sqlite`
    * `mssql`
* `queryLogging` : Boolean flag to display query or not.

#### sqlite
* `storage`: storage filename. Defaults to `:memory:` which is in-memory DB.

#### mysql
* `database` : datanase name
* `host` : host name or IP address
* `username` : username
* `password` : password [Optional]
* `port` : port [Optional]
* `charset` : database character set [Optional]
* `collate` : database collation [Optional]

#### postgres
TODO

#### mssql
TODO
