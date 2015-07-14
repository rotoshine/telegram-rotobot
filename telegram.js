var config = require('./config');
var request = require('request');
var async = require('async');
var mongoose = require('./connection');
var Log = mongoose.model('Log')
var fs = require('fs');

var API_URL = 'https://api.telegram.org/bot' + config.token;
var API_MAPPER = {
	'GET_UPDATES': 'getUpdates',
	'SEND_MESSAGE': 'sendMessage',
	'SEND_PHOTO': 'sendPhoto'
};

var currentOffset = null;

if(fs.existsSync('./currentOffset')){
	currentOffset = fs.readFileSync('./currentOffset');
}
exports.currentOffset = currentOffset;

exports.getUpdates = function(callback){
	var apiUrl = API_URL + '/' + API_MAPPER.GET_UPDATES;
	if(currentOffset != null){
		apiUrl = apiUrl + '?offset=' + currentOffset + '&limit=10';
	}else{
		apiUrl = apiUrl +'?limit=10';
	}

	console.log(apiUrl);
	request(apiUrl, function(err, res, result){
		if(err){
			console.log('request error:', err);
			return callback(err);
		}else{
			var works = [];
			try{
				result = JSON.parse(result);
				var messages = result.result;

				if(result.ok && messages.length > 0){
					currentOffset = messages[messages.length - 1].update_id;
					fs.writeFileSync('currentOffset', currentOffset);

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

					if(works.length > 0){
						return async.parallel(works, callback);
					}else{
						return callback();
					}
				}
			}catch(e){
				console.log('error:', e);
				return callback(e);
			}
		}
	});
};


exports.sendMessage = function(params){
	var apiUrl = API_URL + '/' + API_MAPPER.SEND_MESSAGE;
	var querystring = 'chat_id=' + params.chat_id + '&text=' + params.text + '&disable_web_page_preview=false';
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
