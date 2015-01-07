# ZMail-Client

This is a Simple Mail Client for Zarafa built using the [Ember.js](http://www.emberjs.com) framework and the [python-zarafa API](https://github.com/zarafagroupware/python-zarafa).

Makes use of an elegant RESTful Web API and [Flask](http://flask.pocoo.org/) to expose the functionalities to list and view folders, items and properties.

For the time being this version is limited to read only.

![](images/screenshot.png?raw=true)

## RESTful Web API

In short, the REST requests are quite simple. On startup, a list of folders is displayed and when a folder is selected the items within that folder are listed. Slecting an item will display all of the MAPI properties (PR_*) that are associated with it.
```
GET /folders => list of folders
GET /folders/:folder_id/items => list of items for a given folder
GET /folders/:folder_id/items/:item_id => list of properties for a given item for a given folder
```
For more information, check out the [Z-REST Readme](z-rest/README-REST.md) which explains the interface in more technical detail.

## Instructions

On the remote ZCP server you will have to run the example REST python script found in the z-rest directory.

```bash
$ python z-rest.py
```

## Author

You can contact me here: Kiffin Gish <k.gish@zarafa.com>

## Thanks

A special thanks to [Jelle van der Waa](https://github.com/jelly), [Mark Dufour](https://github.com/srepmub) and the kind folks at [Ember.js](http://emberjs.com/) for helping me out alot.
