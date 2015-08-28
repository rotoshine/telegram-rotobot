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
	'SEND_PHOTO': 'sendPhoto',
};

var API_SEND_TYPE_MAPPER = {
	'message': 'sendMessage',
	'sticker': 'sendSticker',
	'photo': 'sendPhoto'
};

var currentOffset = null;

if(fs.existsSync('./currentOffset')){
	currentOffset = fs.readFileSync('./currentOffset');
}
exports.currentOffset = currentOffset;

exports.getUpdates = function(callback){
	if(callback === undefined){
		callback = function(){}
	}
	var apiUrl = API_URL + '/' + API_MAPPER.GET_UPDATES;
	if(currentOffset != null){
		apiUrl = apiUrl + '?offset=' + currentOffset + '&limit=10';
	}else{
		apiUrl = apiUrl +'?limit=10';
	}

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


var send = function(sendType, params){
	if(!API_SEND_TYPE_MAPPER.hasOwnProperty(sendType)){
		throw new Error(sendType + "은 올바른 전송 타입이 아닙니다.");
	}
	var apiUrl = API_URL + '/' + API_SEND_TYPE_MAPPER[sendType];
	
	console.log('request url:' + apiUrl);
	
	var formData = {
		chat_id: params.chat_id
	};
	
	if(params.hasOwnProperty('reply_to_message_id')){
		formData.reply_to_message_id = params.reply_to_message_id;
	}
	
	if(sendType === 'message'){
		formData.text = params.content;	
	}
	
	if(sendType !== 'message' && params.content !== undefined){
		formData[sendType] = [
			fs.createReadStream(__dirname + '/' + params.content)
		];
	}
	
	console.log(formData);
	
	return request.post({ 
			url: apiUrl, 
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			formData: formData 
		}, function(err, res, result){
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
exports.send = send;

exports.sendMessage = function(params){
	return send('message', params);
};
