# Grand Central Junction

A simple Rails-inspired router for Node built on top of Express.

## Documentation

### route(app, options)

__Options that can be specified:__

* `dir` -- the home directory of the app. Defaults to the directory that contains the `node_modules` folder
* `routes` -- the routes path, relative to the directory route() is called from. Defaults to `config/routes`
* `controllers` -- the controllers path. Defaults to `controllers`

In your `app.js` file or wherever you initialize your Express app, add the following code:

```js
var express = require('express'),
    gcj = require('grand-central-junction'),
    app = express();

gcj.route(app);
```
With custom options:
```js
gcj.route(app, {
    dir: __dirname + '/app',
    routes: 'router/routes',    // Will get the routes from ./app/router/routes.js
    controllers: 'controllers'  // Will look for controllers in ./app/controllers/
});
```

### Routes.js

Example of __/config/routes.js__:
```js
var oauth = require('../oauth');

match('/',         'home#index');
match('/user/:id', 'user#get');
match('/user',     'user#create', {via: 'post'});
put('/user/:id',   'user#update');
del('/user/:id',   oauth.requireAuth, 'user#remove');

resources('/animal', 'animal');
```
Routes:
```
GET    /            => /controllers/home.js#index
GET    /user/:id    => /controllers/user.js#get
POST   /user        => /controllers/user.js#create
PUT    /user/:id    => /controllers/user.js#update
DELETE /user/:id    => /oauth.js#requireAuth >> /controllers/user.js#remove

GET    /animal      => /controllers/animal.js#index
GET    /animal/:id  => /controllers/animal.js#show
POST   /animal      => /controllers/animal.js#create
PUT    /animal/:id  => /controllers/animal.js#update
DELETE /animal/:id  => /controllers/animal.js#destroy
GET    /animal/create     => /controllers/animal.js#create
GET    /animal/edit/:id   => /controllers/animal.js#update
GET    /animal/delete/:id => /controllers/animal.js#destroy
```

#### match(route, action, [options])

A `GET` route to the specified controller/action.

* __route__ `string` `regex`-- the [Express routing](http://expressjs.com/api.html#router.VERB) string/RegEx
* __action__ `string` `function` -- either a direct callback with `req, res` params or a string in the format of `'controller#action'`, with *controller* being the name of the file in the controllers directory and *action* being the name of the method in the controller.
* [__options__] `object`
    * `via` changes the method of the route: `get` (default), `post`, `put`, `delete`
    * `method` same as `via`

#### VERB(route, [action...], action)

Same as **match()** options above, but without options and the ability to include many actions. **VERB** = `get`|`post`|`put`|`del`|`all`

#### resources(route, [controller])

Maps all HTTP methods to their respective CRUD actions in a controller. The action names are the same [as those in Rails](http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions) with a few extras added in (see above list of routes for names).

* __route__ `string` `regex` -- the [Express routing](http://expressjs.com/api.html#router.VERB) string/RegEx
* __controller__ `string` -- the name of the file in the controllers directory, so `'project'` would be the name of `./controllers/project.js`. This defaults to whatever name is in the `route` *string*. 
