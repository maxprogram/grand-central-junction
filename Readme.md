# Grand Central Junction

A simple Rails-inspired router for Node built on top of Express.

## Documentation

### route(app, options)

__Options that can be specified:__

* `dir` is the home directory of the app. Defaults to the directory that contains the `node_modules` folder
* `routes` is the routes path, relative to the directory route() is called from. Defaults to `config/routes`
* `controllers` is the controllers path. Defaults to `controllers`
* `models` is an object or array that is passed as the 3rd parameter to every controller, i.e. in function (req, res, models). Defaults to `null`

In your `app.js` file or wherever you initialize your Express app, add the following code:

```js
var express = require('express'),
    gcj = require('grand-central-junction'),
    app = express();

gcj.route(app);
```
With options:
```js
gcj.route(app, {
    dir: __dirname + '/app',
    routes: 'router/routes',       // Will get the routes from ./app/router/routes.js
    controllers: 'controllers'  // Will look for controllers in ./app/controllers/
    models: orm.getModels()        // Will be passed as te 3rd param to every controller function
});
```

### Routes.js

Example of __/config/routes.js__:
```js
module.exports = function(match, resources) {
    match('/',      'home#index');
    match('/users', 'user#list', {via: 'post'});
    resources('/animal', 'animal');
};
```
Routes:
```
GET    /            => /controllers/home.js#index
POST   /users       => /controllers/user.js#list

GET    /animal      => /controllers/animal.js#index
GET    /animal/:id  => /controllers/animal.js#show
POST   /animal      => /controllers/animal.js#create
PUT    /animal/:id  => /controllers/animal.js#update
DELETE /animal/:id  => /controllers/animal.js#destroy
GET    /animal/create     => /controllers/animal.js#create
GET    /animal/edit/:id   => /controllers/animal.js#update
GET    /animal/delete/:id => /controllers/animal.js#destroy
```

#### match(route, controller#action, options)

A `GET` route to the specified controller/action.

* __route__ is the [Express routing](http://expressjs.com/api.html#app.VERB) string
* __controller__ is the name of the file in the controllers directory, so `'project'` would be the name of ./controllers/project.js
* __action__ is the name of the exported function in the controller, so `'home'` in `exports.home = function(req, res){}`
* __options__ are *optional*
    * `via` changes the method of the route: `get` (default), `post`, `put`, `delete`
    * `method` same as `via`

#### resources(route, controller)

Maps all HTTP methods to their respective CRUD actions in a controller. The action names are the same [as those in Rails](http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions) with a few extras added in (see above list of routes for names).

* __route__ is the [Express routing](http://expressjs.com/api.html#app.VERB) string
* __controller__ is the name of the file in the controllers directory, so `'project'` would be the name of ./controllers/project.js
