var path = require('path'),
    fs = require('fs'),
    Router = require('./router');

function Junction(){}
module.exports = new Junction();

Junction.prototype.route = function(app, options) {
    options = options || {};

    var routesPath = options.routes || "config/routes",
        controllerPath = options.controllers || "controllers",
        models = options.models || null;

    routesPath = path.join(__dirname, routesPath);
    controllerPath = path.join(__dirname, controllerPath);

    return new Router(app, routesPath, controllerPath, models);
};
