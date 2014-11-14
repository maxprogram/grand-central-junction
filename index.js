var path = require('path'),
    fs = require('fs'),
    Router = require('./router');

function Junction(){}
module.exports = new Junction();

Junction.prototype.route = function(app, options) {
    options = options || {};

    var dir = options.dir || path.join(__dirname, '../..'),
        routesPath = options.routes || "config/routes",
        controllerPath = options.controllers || "controllers";

    routesPath = path.join(dir, routesPath);
    controllerPath = path.join(dir, controllerPath);

    if (!fs.existsSync(routesPath) && !fs.existsSync(routesPath + '.js'))
        throw new Error('Routes file "'+routesPath+'" not found');
    if (!fs.existsSync(controllerPath))
        throw new Error('Controller path "'+controllerPath+'" not found');

    return new Router(app, routesPath, controllerPath);
};
