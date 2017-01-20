'use strict';

const Boom = require('boom');

exports.logResponse = function(res) {
    console.log(`Response: statusCode = ${res.statusCode}, payload = ${res.payload}, result = ${res.result}`);
};

exports.replyJson = function(reply, obj, statusCode) {
    if (statusCode) {
        // TODO: apply statusCode
        reply(JSON.stringify(obj));
    } else {
        reply(JSON.stringify(obj));
    }
};

exports.replyOk = function(reply, obj) {
    reply(obj);
};

exports.replyBadRequest = function(reply, message) {
    reply(Boom.badRequest(message));
};

exports.replyError = function(reply, err) {
    console.error(err.stack);
    reply(err);
};
