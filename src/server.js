'use strict';

const path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const routes = require('./routes');
const config = require('./config');
const CacheManager = require('./cache/cacheManager');


const getConfig = function(property) {
    return config[property];
};

/**
 * Get htdocs directory from configuration file
 */
const getHtdocs = function () {
    const htdocs = getConfig('htdocs');
    if (htdocs) {
        if (path.isAbsolute(htdocs)) {
            return htdocs;
        } else {
            return path.join(__dirname, '..', htdocs);
        }
    } else {
        return path.join(__dirname, '../htdocs');
    }
};

const getPort = function () {
    const port = getConfig('port');
    return port ? port : 9990;
};


// Http Server
const htdocs = getHtdocs();
const port = getPort();

const httpServer = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: htdocs
            }
        }
    }
});

httpServer.connection({port});
httpServer.register(Inert, () => {
});

console.log(`Static files directory : ${htdocs}`);
console.log(`Service port : ${port}`);

httpServer.route({
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

routes.register(httpServer);

// CacheManager
const cacheManager = new CacheManager();

// Exports
exports.httpServer = httpServer;
exports.cacheManager = cacheManager;
