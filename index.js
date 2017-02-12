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

flock.events.on('client.pressButton', function (event, callback) {
	var data = store.allUsers();

	for (var i = 0; i < data.length; i++) {
		data[i]
		var user = {
	        userId: event.userId,
	        firstName: data[i]['itemName'],
	        lastName: data[i]['price'],
	        job: data[i]['image'],
	        email: data[i]['description'],
	        discoverable: true,
	        localUsers: "1, 2, 3, 4, 5"
	    };
	    sendUser(user);
	}
	
    callback(null, { text: 'Finding Local Users...' });
});

flock.events.on('client.messageAction', function(event, callback) {
	console.log(event);
    callback(null, { text: 'Sending Request...' });
});

flock.events.on('client.slashCommand', function (event, callback) {
    var r = parseUser(event.text);
    console.log('parse result', r);
    console.log('event contents: ', event.text);
    if (r) {
        var user = {
            userId: event.userId,
            firstName: r[0],
            lastName: r[1],
            job: r[2],
            email: r[3],
            discoverable: true,
            localUsers: "1, 2, 3, 4, 5"
        };
        console.log('adding user', user);
        sendUser(user);
        callback(null, { text: 'User added' });
    } else {
        callback(null, { text: 'User not specified' });
    }
});

var parseUser = function (text) {
    if (text.length > 3) {
        return text.split(" ");
    } else {
        return null;
    }
};

var sendUser = function (user) {
    flock.chat.sendMessage(config.botToken, {
        to: user.userId,
        text: user.firstName + " " + user.lastName
        + "\nRole: " + user.job
    });
};








