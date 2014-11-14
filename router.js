module.exports = function(app, routesPath, controllerPath) {
    var _global = {}, _oldGlobals = {};

    function middleware(method, route, action) {
        return app[method](route, action);
    }

    function parseAction(action) {
        if (typeof action === 'function') return action;

        action = action.split("#");
        var controller = controllerPath + '/' + action[0];
        var mod = require(controller);

        if (action.length > 1) action = action[1];
        else action = 'index';

        return mod[action];
    }

    // @param {(string|regex)} route
    // @param {string} action
    // @param {object} options
    _global.match = function match(route, action, options) {
        options = options || {};
        action = parseAction(action);

        var method = options.via || options.method || 'get';

        if (method == 'delete') method = 'del';
        return middleware(method, route, action);
    };

    function shortcut(method, args) {
        var i = 0;
        args = Array.prototype.slice.call(args);
        args = args.map(function(action) {
            if (i++ != 0) return parseAction(action);
            else return action;
        });

        app[method].apply(app, args);
    }

    // VERB shortcuts
    // @param {string} route
    // @param {(string|function)} action or callback ...
    _global.get = function get() {
        return shortcut('get', arguments);
    };
    _global.post = function post() {
        return shortcut('post', arguments);
    };
    _global.put = function put() {
        return shortcut('put', arguments);
    };
    _global.del = function del() {
        return shortcut('del', arguments);
    };
    _global.all = function all() {
        return shortcut('all', arguments);
    };

    // @param {string} route
    // @param {string} [controller]
    _global.resources = function resources(route, controller) {
        route = route.replace(/\/$/,'');
        if (!controller) controller = route.replace(/\//g,'');
        controller = controllerPath + '/' + controller;

        var mod = require(controller),
            routeId = route + '/:id';

        middleware('get',  route,   mod['index']);
        middleware('get',  route+'/create', mod['create']);
        middleware('get',  route+'/edit/:id', mod['update']);
        middleware('get',  route+'/delete/:id', mod['destroy']);
        middleware('get',  routeId, mod['show']);
        middleware('post', route,   mod['create']);
        middleware('put',  routeId, mod['update']);
        middleware('del',  routeId, mod['destroy']);
    };

    // Copy global vars
    for (var key in _global) {
        if (global[key]) _oldGlobals = global[key];
        global[key] = _global[key];
    }

    // Run all routes in routesPath
    var routes = require(routesPath);
    if (typeof routes === 'function') routes(match, resources);

    // Remove global vars
    for (var key in _global) {
        if (_oldGlobals[key]) global[key] = _oldGlobals[key];
        else delete global[key];
    }

    return {
        routes: app.routes || app._router.stack,
        controllerPath: controllerPath,
        routesPath: routesPath
    };
};
