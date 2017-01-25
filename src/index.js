'use strict';

const Server = require('./server');
const httpServer = Server.httpServer;
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
httpServer.start(err => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${httpServer.info.uri}`);
});

