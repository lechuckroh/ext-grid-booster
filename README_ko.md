# Ext Grid Booster
[[English](README.md)]

[![Build Status](https://travis-ci.org/lechuckroh/ext-grid-booster.svg?branch=master)](https://travis-ci.org/lechuckroh/ext-grid-booster)

ExtJS Grid booster는 대용량 데이터셋을 그리드에 표시하기 위한 서버 애플리케이션입니다.

이 프로젝트의 기본 컨셉은 [ExtSpeeder](http://www.extspeeder.com/)에서 영감을 받았습니다.

#### How-to
* [설정](docs/configuration_ko.md)
* [데모 애플리케이션](docs/demoapp_ko.md)
* [사용자 프로젝트 설정](docs/customization_ko.md)

## 요구사항
* node.js v7.0+

## 사용 명령

```bash
# 모듈 설치
$ npm install

# 테스트 실행
$ npm test

# 커버리지 보고서를 'output/coverage.html'에 생성
$ npm htmlcov

# 서버 시작
$ npm start
```

## 설정 파일
1. `config/config.sample.json` 파일을 `config/config.json` 파일로 복사
2. `config/config.json` 파일 수정

좀 더 자세한 내용은 [설정](docs/configuration_ko.md) 항목을 참고합니다.

## Docker
```bash
# 이미지 생성
$ docker build -t ext-grid-booster:1.0 .

# 이미지 실행
$ docker run -d -p 9990:9990 ext-grid-booster:1.0

# 컨테이너 로그 출력
$ docker logs --follow {컨테이너 해쉬}
```

## 참고문서
* [Lab](https://github.com/hapijs/lab) : Node.js 테스트 라이브러리
* [Joi](https://github.com/hapijs/joi) : HTTP 요청 파라미터 정합성 확인
    * [API Reference](https://github.com/hapijs/joi/blob/master/API.md)
* [Code](https://github.com/hapijs/code) : BDD 테스트 라이브러리
    * [API Reference](https://github.com/hapijs/code/blob/master/API.md)
* [Sequelize Document](http://docs.sequelizejs.com/en/latest/) : ORM
