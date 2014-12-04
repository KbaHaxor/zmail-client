# ZMail-Client

This is a Simple Mail Client for Zarafa built using [Ember.js](http://www.emberjs.com) and [python-zarafa](https://github.com/zarafagroupware/python-zarafa).

Makes use of an elegant RESTful Web API and [Flask](http://flask.pocoo.org/) to expose the functionalities to list and view folders, items and properties.

![](images/screenshot.png?raw=true)

## RESTful Web API

In short, the REST requests are quite simple.

  GET /folders => list of folders
  GET /folders/:folder_id/items => list of items for a given folder
  GET /folders/:folder_id/items/:item_id => list of properties for a given item for a given folder

For more information, check out [Z-REST Readme](z-rest/README-REST.md).

## Instructions

On the remote ZCP server you will have to run the example REST python script found in the z-rest directory.

```bash
$ python z-rest.py
```

## Author

You can contact me here: Kiffin Gish <k.gish@zarafa.com>

## Thanks

A special thanks to Jelle van der Waa, Mark Dufour and the kind folks at ember.js for helping me out alot.
