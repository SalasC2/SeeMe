var config = require('./config.js');
var flock = require('flockos');
var express = require('express');
var store = require('./store');
var chrono = require('chrono-node');

flock.appId = config.appId;
flock.appSecret = config.appSecret;

var app = express();
app.use(flock.events.tokenVerifier);
app.post('/events', flock.events.listener);

app.listen(8080, function() {
	console.log('Listening on 8080');
});

flock.events.on('app.install', function(event, callback) {
	store.saveToken(event.userId, event.token);
	callback();
});

flock.events.on('client.slashCommand', function (event, callback) {
    var r = parseUser(event.text);
    console.log('parse result', r);
    console.log('event contents: ', event.text);
    if (r) {
        var user = {
            userId: event.userId,
            firstName: r.date.getTime(),
            lastName: event.text.slice(r.end).trim(),
            email: "",
            job: "working",
            discoverable: "true",
            localUsers: "1, 2, 3, 4, 5"
        };
        console.log('adding user', user);
		store.addUser(user);
        sendUser(user);
        callback(null, { text: 'User added' });
    } else {
        callback(null, { text: 'User not specified' });
    }
});

var parseUser = function (text) {
    var r = chrono.parse(text);
    if (r && r.length > 0) {
        return {
            date: r[0].start.date(),
            start: r[0].index,
            end: r[0].index + r[0].text.length
        };
    } else {
        return null;
    }
};

var sendUser = function (user) {
	console.log('bot will respond');
    flock.chat.sendMessage(config.botToken, {
        to: user.userId,
        text: user.firstName
    });
};








