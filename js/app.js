App = Ember.Application.create({
    //LOG_TRANSITIONS: true,
    //LOG_TRANSITIONS_INTERNAL: true,
    //LOG_VIEW_LOOKUPS: true,
    //LOG_ACTIVE_GENERATION: true,
    //LOG_RESOLVER: true
});

//Ember.LOG_BINDINGS = true;

/** ADAPTERS **/
//App.ApplicationAdapter = DS.FixtureAdapter.extend({});

App.ApplicationAdapter = DS.RESTAdapter.extend({});

DS.RESTAdapter.reopen({
//    host: 'http://0.0.0.0:5000'
    host: 'http://192.168.2.9:5000'
});

App.FoldersAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, url);
//        console.log('FoldersAdapter: buildURL(type='+type+',id='+id+') => '+url);
        return url;
    }
});

App.FolderAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, url);
//        console.log('FolderAdapter: buildURL(type='+type+',id='+id+') => '+url);
        return url;
    }
});

App.ItemsAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, url);
//        console.log('ItemsAdapter: buildURL(type='+type+',id='+id+') => '+url);
        return url;
    }
});

App.ItemAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, url);
//        console.log('ItemAdapter: buildURL(type='+type+',id='+id+') => '+url);
        return url;
    }
});

App.KeysAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, url);
//        console.log('KeysAdapter: buildURL(type='+type+',id='+id+') => '+url);
        return url;
    }
});

/** SERIALIZERS **/
App.FolderSerializer = DS.RESTSerializer.extend({
    typeForRoot: function(root) {
        var res = this._super(root);
        console.log('FolderSerializer: typeForRoot(root='+root+') => '+res);
        return res;
    },
    normalize: function(type, hash, prop) {
        var res = this._super(type, hash, prop);
//        console.log('FolderSerializer: normalize(type='+type+',hash='+JSON.stringify(hash)+',prop='+JSON.stringify(prop)+') => '+JSON.stringify(res));
        return res;
    }
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
        console.log('FoldersRoute: model()');
        return this.store.find('folder');
    }
});

App.FoldersIndexRoute = Ember.Route.extend({
    afterModel: function() {
        // On startup we first go to the inbox by default.
        var firstObject = this.modelFor('folders').findBy('name','Inbox');
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
        console.log('ItemsRoute: model()');
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
        console.log('KeysRoute: model()');
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
    sortAscending: false,
    sortProperties: ['received']
});

App.KeysController = Ember.ArrayController.extend({
    sortAscending: true,
    sortProperties: ['name'],

    queryParams: ['filterOn'],
    filterOn: false,

    filterRe: '^PR_',

    filterOnObserver: function() {
        var filterOn = this.get('filterOn');
        console.log('KeysController: filterOn='+filterOn);
    }.observes('filterOn')

    //filteredContent: function() {
    //    var filter = this.get('filter');
    //    var filterProperties = this.get('filterProperties');
    //    var keys = this.get('model');
    //    if (!keys || !filterProperties) {
    //        console.log('KeysController: filteredContent() => do nothing');
    //        return keys;
    //    }
    //    console.log('KeysController: filteredContent() => do something');
    //    return keys;
    //    console.log('KeysController: filteredContent() => filter contents');
    //    return keys.filter( function(k) {
    //        var name = k.get('name'),
    //            value = k.get('value'),
    //            len = filter.length,
    //            ok = (name.substr(0,len) === filter && value);
    //            if (ok) {
    //                name = name.substr(len);
    //                k.set('name', name);
    //            }
    //        //console.log('KeysController: filterContent(name='+name+') => '+ok);
    //        return ok;
    //    });
    //}.property('filter', 'content', 'filterProperties')
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
    received: DS.attr('date'),
    folder: DS.belongsTo('folder', {async: true} ),
    count: DS.attr('number'),
    keys: DS.hasMany('key', {async: true} )
});

App.Key = DS.Model.extend({
    name: DS.attr('string'),
    value: DS.attr('string')
//    item: DS.belongsTo('item', {async: true} )
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

/** FIXTURES **/
/*
App.Folder.reopenClass({
  FIXTURES: [
    { id: 1, name: 'Sent items', ftype: 'none',            count: 3, items: [51, 52] },
    { id: 2, name: 'Notes',      ftype: 'pf.note',         count: 4, items: [53, 54, 55, 56] },
    { id: 3, name: 'Inbox',      ftype: 'none',            count: 1, items: [57] },
    { id: 4, name: 'Calendar',   ftype: 'ipf.appointment', count: 0, items: [] },
    { id: 5, name: 'Journal',    ftype: 'ipf.journal',     count: 2, items: [58, 59] }
  ]
});

App.Item.reopenClass({
  FIXTURES: [
    { id: 51, name: 'Fifty-one',   received: new Date(), folder: 1, count: 2, keys: [101, 102] },
    { id: 52, name: 'Fifty-two',   received: new Date(), folder: 1, count: 0, keys: [] },
    { id: 53, name: 'Fifty-three', received: new Date(), folder: 2, count: 1, keys: [103] },
    { id: 54, name: 'Fifty-four',  received: new Date(), folder: 2, count: 1, keys: [104] },
    { id: 55, name: 'Fifty-five',  received: new Date(), folder: 2, count: 1, keys: [105] },
    { id: 56, name: 'Fifty-six',   received: new Date(), folder: 2, count: 3, keys: [106, 107, 108] },
    { id: 57, name: 'Fifty-seven', received: new Date(), folder: 3, count: 0, keys: [] },
    { id: 58, name: 'Fifty-eight', received: new Date(), folder: 5, count: 2, keys: [109, 110] },
    { id: 59, name: 'Fifty-nine',  received: new Date(), folder: 5, count: 1, keys: [111] }
  ]
});
*/

App.Key.reopenClass({
  FIXTURES: [
    { id: 101, name: 'Hundred-one',    value: 'Future famous novel',          item: 51 },
    { id: 102, name: 'Hundred-two',    value: 'Something to think about',     item: 51 },
    { id: 103, name: 'Hundred-three',  value: 'A storm in a teacup',          item: 53 },
    { id: 104, name: 'Hundred-four',   value: 'Keep up the good work',        item: 54 },
    { id: 105, name: 'Hundred-five',   value: 'One small step for man',       item: 55 },
    { id: 106, name: 'Hundred-six',    value: 'Who can tell me more?',        item: 56 },
    { id: 107, name: 'Hundred-seven',  value: 'That is the name of the game', item: 56 },
    { id: 108, name: 'Hundred-eight',  value: 'Will be back tomorrow',        item: 56 },
    { id: 109, name: 'Hundred-nine',   value: 'Sweep it under the rug',       item: 58 },
    { id: 110, name: 'Hundred-ten',    value: 'You must be kidding me',       item: 58 },
    { id: 111, name: 'Hundred-eleven', value: 'An apple a day is healthy',    item: 59 }
  ]
});

/** HANDLEBARS HELPERS **/
Ember.Handlebars.helper('formatvalue', function(value, options) {
    if (value) {
        var maxlen = options.hash.maxlen || 50;
        var force = options.hash.force;
        if (!force && /\s/g.test(value)) {
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

Ember.Handlebars.helper('formatdate', function(value, options) {
    return moment(value).format('YYYY MMM DD hh:mm')
});

Ember.Handlebars.helper('prefixstrip', function(value, options) {
    var prefix = options.hash.prefix;
    if (!prefix) {
//        console.log('prefixstrip => prefix missing!');
        return value;
    }
    var re = new RegExp('^'+prefix);
    return value.replace(re, '');
});

