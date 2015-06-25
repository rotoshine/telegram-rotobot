var async = require('async');
var request = require('request');
var mongoose = require('mongoose');
var config = require('./config.js');

mongoose.connect('mongodb://localhost/rotobot');

var Log = require('./log')(mongoose);

var currentOffset = null;
var updateCycle = config.updateCycle || 500;

var API_URL = 'https://api.telegram.org/bot' + config.token;
var API_MAPPER = {
	'GET_UPDATES': 'getUpdates'
}
var getUpdates = function(callback){
	var apiUrl = API_URL + '/' + API_MAPPER.GET_UPDATES;
	if(currentOffset != null){
		apiUrl = apiUrl + '?offset' + currentOffset;
	}
	request(API_URL + '/' + API_MAPPER.GET_UPDATES, function(err, res, result){
		if(err){
			console.log(err);
		}else{
			result = JSON.parse(result);
			var messages = result.result;

			if(result.ok && messages.length > 0){
				currentOffset = messages[messages.length - 1].update_id + 1;

				var works = [];

				for(var i = 0; i < messages.length; i++){
					(function(message){
						works.push(function(next){
							Log
								.find({update_id : message.update_id})
								.exec(function(err, logs){
									if(err){
										console.log(err);
									}else if(logs && logs.length > 0){
										return next();
									}else{
										new Log(message).save(function(err){
											if(err){
												console.log(err);											
											}
											return next();
										});
									}
								});
						});
					})(messages[i]);
				}

				if(works.length > 0){
					async.parallel(works, function(){
						setTimeout(function(){
							getUpdates();
						}, updateCycle);
					});
				}
			}
		}
	});
};


getUpdates();
