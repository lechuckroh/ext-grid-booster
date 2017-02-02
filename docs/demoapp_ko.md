# 데모 애플리케이션
[[English](demoapp.md)]

작동하는 데모용 애플리케이션을 생성하려면 다음과 같은 단계를 따릅니다.

ExtJS SDK 는 `~/ext-6.2.1` 디렉토리에 있다고 가정하며, 자신의 환경에 맞게 경로를 변경해서 사용합니다.

## 애플리케이션 생성
```bash
$ cd htdocs
$ sencha -sdk ~/ext-6.2.1 generate app -classic MyApp myapp
```

## `BufferedStore`를 사용하도록 Store 변경
`htdocs/myapp/app/store/Personnel.js` 파일을 열어서 다음과 같이 코드를 변경합니다.

```javascript
Ext.define('MyApp.store.Personnel', {
    extend: 'Ext.data.BufferedStore',
    alias: 'store.personnel',
	autoLoad: true,
    fields: ['name', 'email', 'phone'],
	proxy: {
		type: 'jsonp',
		url: '/api/personnel',
		callbackKey: 'callback',
		reader: {
			rootProperty: 'data',
			idProperty: 'id',
			totalProperty: 'total'
		}
	}
});
```

## view 수정
1. `htdocs/myapp/app/view/main/List.js` 파일을 엽니다.
2. `height` 설정을 추가합니다.

```javascript
Ext.define('MyApp.view.main.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlist',
    requires: [
        'MyApp.store.Personnel'
    ],
    title: 'Personnel',
    store: {
        type: 'personnel'
    },
	height: 600,          // <== 이 부분 추가
    columns: [
        { text: 'Name',  dataIndex: 'name' },
        { text: 'Email', dataIndex: 'email', flex: 1 },
        { text: 'Phone', dataIndex: 'phone', flex: 1 }
    ],
    initComponent: function() {
        this.callParent();

        var store = this.getStore();
        Ext.Ajax.request({
            url: '/api/personnel',
            method: 'POST',
            params: {
                create: false,
                refresh: false
            },
            success: function(res) {
                var cacheId = JSON.parse(res.responseText)['cacheId'];
                var extraParams = store.proxy.extraParams;
                extraParams.cacheId = cacheId;
                store.load();
            },
            failure: function(res) {
                console.error(res);
            }
        });
    }
});
```

## 빌드 및 실행
애플리케이션을 빌드합니다.

```bash
$ cd htdocs/myapp
$ sencha app build
```

프로젝트의 루트 디렉토리에서 서버를 구동합니다.

```bash
$ npm start
```

웹 브라우저에서 `http://localhost:9990/myapp` 주소로 접속합니다.
