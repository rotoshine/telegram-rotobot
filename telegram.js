var config = require('./config');
var request = require('request');
var async = require('async');
var mongoose = require('./connection');
var Log = mongoose.model('Log')

var API_URL = 'https://api.telegram.org/bot' + config.token;
var API_MAPPER = {
	'GET_UPDATES': 'getUpdates',
	'SEND_MESSAGE': 'sendMessage',
	'SEND_PHOTO': 'sendPhoto'
};

var currentOffset = null;
exports.currentOffset = currentOffset;

exports.getUpdates = function(callback){
	var apiUrl = API_URL + '/' + API_MAPPER.GET_UPDATES;
	if(currentOffset != null){
		apiUrl = apiUrl + '?offset' + currentOffset + '&limit=10';
	}else{
		apiUrl = apiUrl +'?limit=10';
	}

	console.log(apiUrl);
	request(apiUrl, function(err, res, result){
		if(err){
			console.log(err);
			callback(err);
		}else{
			var works = [];
			try{
				result = JSON.parse(result);
				var messages = result.result;

				if(result.ok && messages.length > 0){
					currentOffset = messages[messages.length - 1].update_id;

					for(var i = 0; i < messages.length; i++){
						(function(message){
							works.push(function(next){
								Log
									.find({update_id : message.update_id})
									.exec(function(err, logs){
										if(err){
											console.log(err);
											return next(err);
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

					console.log(works);
					if(works.length > 0){
						console.log('new command log count : ' + works.length);
						async.parallel(works, callback);
					}else{
						callback();
					}
				}
			}catch(e){
				console.log(e);
				callback(e);
			}
		}
	});
};


exports.sendMessage = function(params){
	var apiUrl = API_URL + '/' + API_MAPPER.SEND_MESSAGE;
	var querystring = 'chat_id=' + params.chat_id + '&text=' + params.text;
	if(params.reply_to_message_id){
		querystring = querystring + '&reply_to_message_id=' + params.reply_to_message_id;
	}

	apiUrl = apiUrl + '?' + querystring;
	console.log('request url:' + apiUrl);

	request(apiUrl, function(err, res, result){
		if(err){
			console.log(err);
		}
		if(params.callback && typeof params.callback === 'function'){
			if(typeof result === 'string'){
				result = JSON.parse(result);
			}
			params.callback(result);
		}
	});
};
