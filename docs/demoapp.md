# Demo Application
[[한국어](demoapp_ko.md)]

You can generate a working demonstration by following these steps.

We assume that ExtJS SDK is located in `~/ext-6.2.1`. Change it to match your path.

## app generation
```bash
$ cd htdocs
$ sencha -sdk ~/ext-6.2.1 generate app -classic MyApp myapp
```

## Edit store to use `BufferedStore`
Open `htdocs/myapp/app/store/Personnel.js` and replace with the following code.

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

## Edit view
1. Open `htdocs/myapp/app/view/main/List.js`.
2. Add `height` configuration.

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
	height: 600,          // <== add this line
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

## Build and Run
Build sencha application

```bash
$ cd htdocs/myapp
$ sencha app build
```

Run server in the root directory.

```bash
$ npm start
```

Open `http://localhost:9990/myapp`.
