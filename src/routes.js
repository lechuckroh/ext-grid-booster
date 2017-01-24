'use strict';

const personnel = require('./controllers/personnel.controller');

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
    routeGet(server, '/api/personnel/orm', personnel.selectORM);
    routeGet(server, '/api/personnel/native1', personnel.selectNative1);
    routeGet(server, '/api/personnel/native2', personnel.selectNative2);
};

exports.routeDelete = routeDelete;
exports.routeGet = routeGet;
exports.routePost = routePost;
exports.routePut = routePut;
exports.register = register;
