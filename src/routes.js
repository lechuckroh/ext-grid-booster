'use strict';

const members = require('./controllers/members.controller');

const routeDelete = function (server, path, handler, validate) {
    server.route({
        method: 'DELETE',
        path: path,
        config: {
            handler: handler,
            validate: validate
        }
    });
};

const routeGet = function (server, path, handler, validate) {
    server.route({
        method: 'GET',
        path: path,
        config: {
            handler: handler,
            validate: validate
        }
    });
};

const routePost = function (server, path, handler, validate) {
    server.route({
        method: 'POST',
        path: path,
        config: {
            handler: handler,
            validate: validate
        }
    });
};

const routePut = function (server, path, handler, validate) {
    server.route({
        method: 'PUT',
        path: path,
        config: {
            handler: handler,
            validate: validate
        }
    });
};

const register = function (server) {
    routeGet(server, '/api/members', members.findAll);
    routeGet(server, '/api/members/sqlite', members.findAllSqlite);
};
exports.register = register;
