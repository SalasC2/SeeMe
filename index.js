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
    var r = parseDate(event.text);
    console.log('parse result', r);
    console.log('event contents: ', event.text);
    if (r) {
        var alarm = {
            userId: event.userId,
            firstName: r.date.getTime(),
            lastName: event.text.slice(r.end).trim(),
            email: "",
            job: "working",
            discoverable: "true",
            localUsers: "1, 2, 3, 4, 5"
        };
        console.log('adding alarm', alarm);
	    scheduleAlarm(alarm);
        callback(null, { text: 'Alarm added' });
    } else {
        callback(null, { text: 'Alarm time not specified' });
    }
});

var parseDate = function (text) {
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

var scheduleAlarm = function (alarm) {
    var delay = Math.max(0, alarm.time - new Date().getTime());
    setTimeout(function () {
        sendAlarm(alarm);
        store.removeAlarm(alarm);
    }, delay);
};

// schedule all alarms saved in db
store.allAlarms().forEach(scheduleAlarm);

var sendAlarm = function (alarm) {
    flock.chat.sendMessage(config.botToken, {
        to: alarm.userId,
        text: alarm.text
    });
};








