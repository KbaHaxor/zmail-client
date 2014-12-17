App = Ember.Application.create({
    //LOG_TRANSITIONS: true,
    //LOG_TRANSITIONS_INTERNAL: true,
    //LOG_VIEW_LOOKUPS: true,
    //LOG_ACTIVE_GENERATION: true,
    //LOG_RESOLVER: true
});

//Ember.LOG_BINDINGS = true;

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
//        var firstObject = this.controllerFor('folders').get('arrangedContent.firstObject');
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
    sortProperties: ['name'],
    itemController: 'folder'
});

App.FolderController = Ember.ObjectController.extend({
    glyphicon: function() {
        var modifier;
        var name = this.get('name').toLowerCase();
        var ftype = this.get('ftype').toLowerCase();
        if (ftype === 'none') {
            switch(name) {
                case 'inbox': modifier = 'inbox'; break;
                case 'deleted items': modifier = 'trash'; break;
                case 'outbox': modifier = 'log-out'; break;
                case 'sent items': modifier = 'send'; break;
                default: modifier = 'question-sign';
            }
        } else {
            ftype = ftype.replace(/^ipf\./, '');
            switch(ftype) {
                case 'appointment': modifier = 'th'; break;
                case 'deleted items': modifier = 'trash'; break;
                case 'contact': modifier = 'user'; break;
                case 'task': modifier = 'th-list'; break;
                case 'configuration': modifier = 'cog'; break;
                case 'note': modifier = 'tag'; break;
                case 'note.outlookhomepage': modifier = 'tag'; break;
                case 'stickynote': modifier = 'tags'; break;
                case 'journal': modifier = 'book'; break;
                default: modifier = 'question-sign';
            }
        }
//        console.log('FolderController: glyphicon(name='+name+',ftype='+ftype+') => '+modifier);
        return 'glyphicon-'+modifier;
    }.property('name','ftype')
});

App.ItemsController = Ember.ArrayController.extend({
    sortAscending: true,
    sortProperties: ['name'],
    itemController: 'item'
});

App.ItemController = Ember.ObjectController.extend({
});

App.KeysController = Ember.ArrayController.extend({
//    filter: 'PR_',
    sortAscending: true,
    sortProperties: ['name']
//    filteredContent: function() {
//        var filter = this.get('filter');
//        var keys = this.get('arrangedContent');
//        if (!keys) {
//            return keys;
//        }
//        return keys.filter( function(k) {
//            var name = k.get('name'),
//                value = k.get('value'),
//                len = filter.length,
//                ok = (name.substr(0,len) === filter && value);
//                if (ok) {
//                    name = name.substr(len);
//                    k.set('name', name);
//                }
//            console.log('KeysController: filterContent(name='+name+',value='+value+') => '+ok);
//            return ok;
//        });
//    }.property('arrangedContent', 'filter')
});

/** MODELS **/
App.Folder = DS.Model.extend({
    name: DS.attr('string'),
    ftype: DS.attr('string'),
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

Ember.Handlebars.helper('prefixstrip', function(value, options) {
    var prefix = options.hash.prefix;
    if (!prefix) {
        console.log('prefixstrip => prefix missing!');
        return value;
    }
    var re = new RegExp('^'+prefix);
    return value.replace(re, '');
});
