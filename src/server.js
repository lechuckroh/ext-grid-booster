'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const routes = require('./routes');

// Http Server
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../htdocs')
            }
        }
    }
});

server.connection({port: 9990});
server.register(Inert, () => {
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});

routes.register(server);

module.exports = server;
