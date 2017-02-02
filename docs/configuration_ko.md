# 설정
[[English](configuration.md)]

설정은 `config/config.json` 파일에 저장되어 있습니다.

기본적으로 `config/config.json` 파일은 생성되어 있지 않습니다.

서버 구동시에 `config/config.json` 파일이 없으면 `config/config.sample.json` 파일을 복사해서 생성하게 됩니다. 서버 구동전에 미리 복사해서 설정을 변경한 다음 서버를 구동하는 것이 좋습니다.

## 프로파일 설정
미리 정의된 프로파일은 `development`, `test`, `production`이 있습니다.

서버 구동시에 사용할 프로파일명은 `NODE_ENV` 환경 변수를 읽어와서 사용하며, 설정되어 있지 않은 경우 `development` 를 기본값으로 사용합니다.

#### development
개발시에 사용하는 프로파일

#### test
테스트용 프로파일. 테스트 실행시에 자동으로 설정되기 때문에 따로 프로파일을 설정할 필요는 없습니다.

테스트를 실행하려면 다음과 같이 실행합니다 :

```bash
$ npm test
```

#### production
운영 환경을 위한 프로파일.

이 프로파일을 사용하려면 `NODE_ENV` 환경변수를 `production`로 설정합니다.

유닉스:
```bash
$ NODE_ENV=production npm start
```

윈도우:
```bash
$ set NODE_ENV=production
$ npm start
```

## 기본 설정
`default` 키 아래에 있는 항목들은 기본 설정이 됩니다.

프로파일 설정에 없는 설정들은 기본 설정에 지정된 값을 사용합니다.

### 서버 설정
* `port` : 서버 포트 번호
* `htdocs` : HTML, 이미지 파일과 같은 정적 리소스 파일 디렉토리

### DB 설정
* `dialect` : 연결할 DB 종류
    * `mysql`
    * `postgres`
    * `sqlite`
    * `mssql`
* `queryLogging` : 쿼리를 로그에 표시할지 여부 (`true` / `false`)

#### sqlite
* `storage`: DB를 저장할 파일명. 기본값은 `:memory:` 이며, 이 경우 메모리 DB를 사용.

#### mysql
* `database` : 데이터베이스 이름
* `host` : 호스트 / IP 주소
* `username` : 사용자 이름
* `password` : 패스워드 (선택사항)
* `port` : 포트번호 (선택사항)
* `charset` : 데이터베이스 문자셋 (선택사항)
* `collate` : 데이터베이스 collation (선택사항)

#### postgres
TODO

#### mssql
TODO
