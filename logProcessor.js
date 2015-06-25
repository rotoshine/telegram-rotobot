var mongoose = require('./connection');
var Log = mongoose.model('Log');
var commander = require('./commander');
var async = require('async');

var config = require('./config');
var processCycle = config.processCycle || 500;

function process(){	
	Log.find({ isProcessed : false}).exec(function(err, unprocessedLogs){
		if(err){
			console.log(err);
		}
		if(unprocessedLogs.length > 0){		
			console.log('unprocessedLogs count :' + unprocessedLogs.length);	
		}
	
		var works = [];
		for(var i = 0; i < unprocessedLogs.length; i++){
			(function(unprocessedLog){				
				works.push(function(next){
					commander.parse(unprocessedLog, function(){
						unprocessedLog.isProcessed = true;
						unprocessedLog.save(function(){
							console.log('chat_id ' + unprocessedLog.message.from.id + ' ' + unprocessedLog.message.text + ' parse complete.');
							return next();
						});
					}, function(log){
						console.log(log.message.text + ' parse fail.');
						return next();
					});				
				});	
			})(unprocessedLogs[i]);
		}
		if(works.length > 0){
			async.parallel(works, function(){
				return setTimeout(process, processCycle);
			});
		}else{
			return setTimeout(process, processCycle);
		}		
	});
}

exports.process = process;
