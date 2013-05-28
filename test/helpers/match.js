module.exports = function(match, resources) {
    match('/', 'home#index');
    match('/create', 'home#create', {via: 'post'});
};
