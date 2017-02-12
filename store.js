'use strict';

var fs = require('fs');
var dbFile = 'db.json';

// Everything is stored here

var db = {
    users: {},
    alarms: []
};

// Read db file on startup and save on exit

var readDatabase = function () {
    try {
        var stringContent = fs.readFileSync(dbFile);
        db = JSON.parse(stringContent);
    } catch (e) {
        console.log('No db found, creating %s', dbFile);
    }
};

var saveDatabase = function () {
    console.log('Saving db');
    var stringContent = JSON.stringify(db);
    fs.writeFileSync(dbFile, stringContent);
};

readDatabase();
process.on('SIGINT', function () { console.log('SIGINT'); process.exit(); });
process.on('SIGTERM', function () { console.log('SIGTERM'); process.exit(); });
process.on('exit', saveDatabase);

// Accessors

exports.getToken = function (userId) {
    return db.users[userId];
};

exports.saveToken = function (userId, token) {
    db.users[userId] = token;
};

exports.peekAlarm = function () {
    if (db.alarms.length > 0) {
        return db.alarms[0];
    } else {
        return null;
    }
};

exports.removeUser = function (user) {
    var index = db.alarms.indexOf(user);
    if (index !== -1) {
        db.alarms.splice(index, 1);
    }
};

exports.addUser = function (user) {
    console.log('push: ', user);
    db.alarms.push(user);
};

exports.userAlarms = function (userId) {
    return db.alarms.filter(function (alarm) {
        return alarm.userId === userId;
    });
};

exports.allUsers = function () {
    return db.alarms;
};
