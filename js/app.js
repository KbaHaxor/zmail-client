App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    LOG_VIEW_LOOKUPS: true,
    LOG_ACTIVE_GENERATION: true,
    LOG_RESOLVER: true
});

App.Router.map(function() {
    this.resource('folders', function() {
        this.resource('folder', { path: ':folder_id' }, function() {
            this.resource('items', { path: 'items' }, function() {
                this.resource('item', { path: ':item_id' });
            });
        });
    });
});

/** ROUTES **/
App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        console.log('IndexRoute: redirect() => folders');
        this.transitionTo('folders');
    }
});

App.FoldersRoute = Ember.Route.extend({
    model: function() {
        console.log('FoldersRoute: model() => ');
        // GET => '/folders'
        var res =this.store.find('folder');
        console.log(res);
        return res;
    }
});

/** This is default Ember behavior **/
App.FolderRoute = Ember.Route.extend({
    model: function(params) {
        console.log('FolderRoute: model('+params.folder_id+') => ');
        // GET => '/folder/folder_id'
        var res =this.store.find('folder', params.folder_id);
        console.log(res);
        return res;
    }
});

App.ItemsRoute = Ember.Route.extend({
    model: function() {
        console.log('ItemsRoute: model() => ');
        var res = this.modelFor('folder').get('items');
        console.log(res);
        return res;
    }
});

//GET => /folders/1/items/2
//store.find('folder', 1).then(function (myFolderModel) {
//  store.find('item', 2, {folder: myFolderModel});
//});

// TODO: change detail to details in z-rest.py

App.ItemRoute = Ember.Route.extend({
    model: function(params) {
        console.log('ItemRoute: model(item_id='+params.item_id+') => ');
        var res = this.modelFor('items').findBy('id', params.item_id);
        console.log(res);
        return res;
    }
});

/** CONTROLLERS **/
App.FoldersController = Ember.ArrayController.extend({
    sortAscending: true,
    sortProperties: ['name']
});

App.ItemController = Ember.ArrayController.extend({
    sortAscending: true,
    sortProperties: ['received']
});

/** MODELS **/
App.Folder = DS.Model.extend({
    name: DS.attr('string'),
    count: DS.attr('number'),

    items: DS.hasMany('item', { async: true })
});

App.Item = DS.Model.extend({
    subject: DS.attr('string'),
    received: DS.attr('string'),

    folder: DS.belongsTo('folder', { async: true }),
    detail: DS.belongsTo('detail', { async: true })
});

App.Detail = DS.Model.extend({
    subject: DS.attr('string'),
    received: DS.attr('string'),
    sent: DS.attr('string'),
    size: DS.attr('number'),
    importance: DS.attr('string'),
    flags: DS.attr('string'),
//       sender: get_adddresslist(item.sender),
//       recipients: [get_adddresslist(recip) for recip in item.recipients()],
//       headers: item.headers().items(),
    html: DS.attr('string'),
    text: DS.attr('string'),

    item: DS.belongsTo('item', { async: true })
});

/** REST ADAPTER **/
DS.RESTAdapter.reopen({
    host: 'http://192.168.50.12:5000',
    headers: { "Authorization":  "Basic ZGVtbzE6dGVzdA==" }
});

App.Store = DS.Store.extend({
    adapter: "App.Adapter"
});

/** ADAPTERS **/
App.Adapter = DS.RESTAdapter.extend({
    defaultSerializer: "App/application"
});

App.FoldersAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, record);
        console.log('FoldersAdapter: buildURL => ' + url);
        return url;
    }
});

App.FolderAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, record);
        console.log('FolderAdapter: buildURL => ' + url);
        return url;
    }
});

App.ItemsAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
        var url = this._super(type, id, record);
        console.log('ItemsAdapter: buildURL => ' + url);
        return url;
    }
});

App.ItemAdapter = DS.RESTAdapter.extend({
    buildURL: function(type, id, record) {
//      var url = '/folders/' + record.get('folder.id') + '/items/' + id;
        var url = this._super(type, id, record);
        console.log('ItemAdapter: buildURL => ' + url);
        return url;
    }
});

App.ApplicationSerializer = DS.RESTSerializer.extend({});
