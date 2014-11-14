var assert = require('assert'),
    path = require('path'),
    _ = require('lodash'),
    gcj = require('..'),
    express = require('express');

describe('grand-central-junction', function() {

var app = express();
var ops = {
    dir: __dirname,
    controllers: 'helpers',
    routes: 'helpers/match'
};
var router = gcj.route(app, ops), route;

function getRoute(name) {
    return _.where(router.routes, function(r) {
        return r.route && r.route.path == name;
    })[0].route;
}

it('should initialize with provided options', function() {
    assert.equal(router.routesPath, path.join(__dirname, 'helpers/match'));
    assert.equal(router.controllerPath, path.join(__dirname, 'helpers'));
});

it('should match route', function() {
    route = getRoute('/');
    assert(route.methods['get']);
});

it('should match route with other methods', function() {
    route = getRoute('/create');
    assert(route.methods['post']);
    route = getRoute('/update');
    assert(route.methods['put']);
});

it('should be able to use functions', function() {
    route = getRoute('/test');
    assert.equal(route.stack.length, 2);
    assert.equal(route.stack[1].handle(), 8886);
});

it('should route to CRUD resources', function() {
    var appNew = express();

    ops.routes = 'helpers/resources';
    router = gcj.route(appNew, ops);

    route = getRoute('/user/edit/:id');
    assert(route.methods['get']);

    route = getRoute('/user/:id');
    assert(route.methods['get']);
    assert.equal(route.stack[0].handle(), 'show');
});

it('should throw err with bad routes file', function() {
    var appNew = express();
    ops.routes = 'helpers/no-routes';
    assert.throws(function(){ gcj.route(appNew, ops); }, /file/);
});

it('should throw err with bad controller path', function() {
    var appNew = express();
    ops.routes = 'helpers/match';
    ops.controllers = 'not-a-path';
    assert.throws(function(){ gcj.route(appNew, ops); }, /path/);
});


});
