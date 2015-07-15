var Mongo = require("mongodb");
var MongoClient = Mongo.MongoClient;
var Server = Mongo.Server;
var config = require("../config");

// Connection URL
var url = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/';

var _clientCache = {};
var connectingDBS = {};
var buffer = {};

/**
 * callbacks
 * Fires all buffered callbacks
 */
function callbacks (err, dbName) {
    buffer[dbName] = buffer[dbName] || [];

    // handle error
    if (err) {
        buffer[dbName].forEach(function(cBuff) {
            cBuff.callback.call(this, err);
        });

        buffer[dbName] = [];
        return;
    }

    // handle no db in cache
    if (!_clientCache[dbName]) {
        buffer[dbName].forEach(function(cBuff) {
            cBuff.callback.call(this, new Error("DB object not found in cache"));
        });

        buffer[dbName] = [];
        return;
    }

    // fire buffered callbacks
    buffer[dbName].forEach(function(cBuff) {
        cBuff.callback.call(this, null, _clientCache[dbName]);
    });

    buffer[dbName] = [];
}

/**
 * bufferCallback
 * Buffers a callback during connecting
 */
function bufferCallback(dbName, callback) {
    buffer[dbName] = buffer[dbName] || [];

    if (buffer[dbName].length < 100) {
        buffer[dbName].push({ dbName: dbName, callback: callback });
    } else {
        callback(new Error("Number of callbacks in buffer exceeded."));
    }
}

/**
 * connect
 * Connects to database
 */
function connect(dbName, callback) {

    // check if db is cached
    if (_clientCache[dbName]) {
        return callback(null, _clientCache[dbName]);
    }

    if (connectingDBS[dbName]) {
        return bufferCallback(dbName, callback);
    }

    connectingDBS[dbName] = true;
    bufferCallback(dbName, callback);

    // connect
    MongoClient.connect(url + dbName, function(err, db) {
        
        if (err) {
            connectingDBS[dbName] = false;
            return callbacks(err, null);
        }

        connectingDBS[dbName] = false;
        _clientCache[dbName] = db;

        callbacks(null, dbName);
    });
}

exports.connect = connect;
exports.ObjectID = Mongo.ObjectID;