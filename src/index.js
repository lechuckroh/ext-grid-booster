'use strict';

const server = require('./server');
const models = require('./models/index.js');
const sequelize = models.sequelize;


// Synchronize database
sequelize.sync().then(() => {
    console.log('Database synchronized.');
}).catch(e => {
    console.error('Failed to synchronize database : ', e.stack);
});

// populate sample data
require('./controllers/personnel').populateSampleData();

// Start HTTP server
server.start(err => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

