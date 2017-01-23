# Customization

## Remove demo model
The application has a sample model named `Personnel` for demonstration.

If you no longer need this model, you can remove it.

1. delete `src/controllers/personnel.controller.js`
2. delete `src/models/personnel.js`
3. Open `src/index.js` and remove the following lines.
```javascript
// populate sample data
require('./controllers/personnel.controller').populateSampleData();
```
4. Open `src/routes.js` and remove the following lines.
```javascript
const personnel = require('./controllers/personnel.controller');
routeGet(server, '/api/personnel', personnel.findAll);
```

## API using native query

TODO

## API using ORM

TODO