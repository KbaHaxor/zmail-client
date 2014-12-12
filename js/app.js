App = Ember.Application.create({
    LOG_TRANSITIONS: false,
    LOG_TRANSITIONS_INTERNAL: false,
    LOG_VIEW_LOOKUPS: false,
    LOG_ACTIVE_GENERATION: false,
    LOG_RESOLVER: false
});

/** ADAPTERS **/
App.ApplicationAdapter = DS.RESTAdapter.extend({});

DS.RESTAdapter.reopen({
    host: 'http://0.0.0.0:5000'
});

/** ROUTER MAP **/
App.Router.map(function() {
    this.resource('folders', function() {
        this.resource('folder', { path: ':folder_id' }, function() {
            this.resource('items', function() {
                this.resource('item', { path: ':item_id' }, function() {
                    this.resource('keys', function() {});
                });
            })
        })
    });
});

/** ROUTES **/
App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        console.log('IndexRoute: redirect');
        this.transitionTo('folders');
    }
});

App.FoldersRoute = Ember.Route.extend({
    model: function() {
        console.log('FoldersRoute: model');
        return this.store.find('folder');
    }
});

App.FoldersIndexRoute = Ember.Route.extend({
    afterModel: function() {
        var firstObject = this.modelFor('folders').get('firstObject');
        if (firstObject) {
            console.log('FoldersIndexRoute: afterModel => folder/firstObject');
            this.transitionTo('folder', firstObject);
        } else {
            console.log('FoldersIndexRoute: afterModel => folders');
            this.transitionTo('folders');
        }
    }
});

App.FolderIndexRoute = Ember.Route.extend({
    afterModel: function() {
        var firstObject = this.modelFor('folder').get('firstObject');
        if (firstObject) {
            console.log('FolderIndexRoute: afterModel => item/firstObject');
            this.transitionTo('item', firstObject);
        } else {
            console.log('FolderIndexRoute: afterModel => items');
            this.transitionTo('items');
        }
    }
});

App.ItemsRoute = Ember.Route.extend({
    model: function() {
        console.log('ItemsRoute: model');
        return this.modelFor('folder').get('items');
    }
});

App.ItemsIndexRoute = Ember.Route.extend({
    afterModel: function() {
        var firstObject = this.modelFor('items').get('firstObject');
        if (firstObject) {
            console.log('ItemsIndexRoute: afterModel => item/firstObject');
            this.transitionTo('item', firstObject);
        } else {
            console.log('ItemsIndexRoute: afterModel => items');
            this.transitionTo('items');
        }
    }
});

App.ItemIndexRoute = Ember.Route.extend({
    afterModel: function() {
        console.log('ItemIndexRoute: afterModel');
        this.transitionTo('keys');
    }
});

App.KeysRoute = Ember.Route.extend({
    model: function() {
        console.log('KeysRoute: model');
        return this.modelFor('item').get('keys');
    }
});

/** CONTROLLERS **/
App.FoldersController = Ember.ArrayController.extend({
    sortAscending: true,
    sortProperties: ['name']
});

App.KeysController = Ember.ArrayController.extend({
    sortAscending: true,
    sortProperties: ['name']
    //filteredContent: function() {
    //    var content = this.get('content');
    //    if (!content) {return content; }
    //    return content.filter( function(item) {
    //        return (item.get('name').substr(0,3) === 'PR_');
    //    });
    //}.property('content.isLoaded')
});

/** MODELS **/
App.Folder = DS.Model.extend({
    name: DS.attr('string'),
    count: DS.attr('number'),
    items: DS.hasMany('item', {async: true} )
});

App.Item = DS.Model.extend({
    name: DS.attr('string'),
    folder: DS.belongsTo('folder', {async: true} ),
    count: DS.attr('number'),
    keys: DS.hasMany('key', {async: true} )
});

App.Key = DS.Model.extend({
    name: DS.attr('string'),
    value: DS.attr('string'),
    item: DS.belongsTo('item', {async: true} )
});

/** HANDLEBAR HELPERS **/
Ember.Handlebars.helper('formatvalue', function(value, options) {
    if (value) {
        var maxlen = options.hash.maxlen || 50;
        if (/\s/g.test(value)) {
            return value;
        } else if (value.length > maxlen) {
            return value.substring(0,maxlen-4) + '...';
        } else {
            return value;
        }
    } else {
        return 'null';
    }
});
