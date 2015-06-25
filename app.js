var mongoose = require('mongoose');
var config = require('./config.js');
var telegram = require('./telegram');

var updateCycle = config.updateCycle || 500;

setInterval(function(){
	telegram.getUpdates();
}, updateCycle)
