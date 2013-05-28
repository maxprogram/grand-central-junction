var assert = require('assert'),
    path = require('path'),
    gcj = require('..'),
    express = require('express');

describe('grand-central-junction', function() {

var app = express();
var ops = {
    dir: __dirname,
    controllers: 'helpers',
    routes: 'helpers/match',
    models: 8886
};

it('should initialize with provided options', function() {
    var router = gcj.route(app, ops);

    assert.equal(router.routesPath, path.join(__dirname, 'helpers/match'));
    assert.equal(router.controllerPath, path.join(__dirname, 'helpers'));
});

it('should match route', function() {
    var routes = app.routes;
    assert.equal(routes.get[0].path, '/');
    assert.equal(routes.get[0].callbacks[0](), 8886);
});

it('should match route with other methods', function() {
    var routes = app.routes;
    assert.equal(routes.post[0].path, '/create');
    assert.equal(routes.post[0].callbacks[0](), 'post');
});

it('should route to CRUD resources', function() {
    var appNew = express();

    ops.routes = 'helpers/resources';
    var router = gcj.route(appNew, ops),
        routes = appNew.routes;

    assert.equal(routes.get[2].path, '/user/edit/:id');
    assert.equal(routes.get[2].keys[0].name, 'id');

    routes.get.forEach(function(method) {
        assert.equal(method.callbacks[0](), 8886);
    });
    assert.equal(routes.post[0].callbacks[0](), 8886);
    assert.equal(routes.put[0].callbacks[0](), 8886);
    assert.equal(routes['delete'][0].callbacks[0](), 8886);
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
