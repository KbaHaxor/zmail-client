App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    LOG_VIEW_LOOKUPS: true,
    LOG_ACTIVE_GENERATION: true,
    LOG_RESOLVER: true
});

/** ROUTER **/
App.Router.map(function() {
    this.resource('folders', {path: "/"}, function() {
        this.resource('folder', {path: "/folders/:folder_id"}, function() {

        })
    });
});

App.FolderRoute = Ember.Route.extend({
    model: function(folder) {
        return this.store.find('folder', folder.folder_id);
    }
});

App.FoldersRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('folder');
    }
});

/** CONTROLLERS **/
App.FoldersController = Ember.ArrayController.extend({
    sortAscending: true,
    sortProperties: ['name']
});

/** MODELS **/
App.Folder = DS.Model.extend({
    name: DS.attr('string'),
    count: DS.attr('number')
});

App.Item = DS.Model.extend({
    subject: DS.attr('string'),
    received: DS.attr('string'),
    sent: DS.attr('string'),
    size: DS.attr('number'),
    importance: DS.attr('string'),
    flags: DS.attr('string'),
//    sender: get_adddresslist(item.sender),
//    recipients: [get_adddresslist(recip) for recip in item.recipients()],
//    headers: item.headers().items(),
    html: DS.attr('string'),
    text: DS.attr('string')
});

/** REST ADAPTER **/
DS.RESTAdapter.reopen({
//    host: 'http://192.168.50.11:5000',
    host: 'http://192.168.2.17:5000',
    headers: {
        "Authorization": (function() {
            return "Basic " + Base64.encode('demo1:test');
        })()
    }
});

App.Store = DS.Store.extend({
    adapter: "DS.RESTAdapter"
});
