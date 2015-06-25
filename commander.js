var _ = require('underscore');
var _s = require('underscore.string');

var mongoose = require('./connection');
var glob = require('glob');
var Notice = mongoose.model('Notice');
var telegram = require('./telegram');

var commands = [];
var commandPaths = glob.sync('./commands/*.js');

_.each(commandPaths, function(commandPath){
	commands.push(require(commandPath));
	console.log(commandPath + ' command loaded.');
});

// 도움말 커맨드는 다른 커맨드를 순회하므로 여기에 작성한다.
comments.push({
	commandKeywords: ['/help', '/도움', '/스피드웨건'],
	description: '...설명이 필요한가?',
	run: function(message, keywordParam, callback){
		var commandHelps = [];
		for(var i = 0; i < commands.length; i++){
			commandHelps.push(commands[i].commandKeywords.join(', ') + ' - ' + commands[i].description);
		}

		return telegram.sendMessage({
			chat_id: message.chat.id,
			text: commandHelps.join('\r\n'),
			callback: callback
		});
	}
});

function getCommandParam(text, commandKeyword){
	return _s.trim(text.replace(commandKeyword, ''));	
}

function isCommand(text, commandKeyword){
	var textStart = text.substring(0, commandKeyword.length);	
	return textStart === commandKeyword;
}


function parse(log, parseSuccessCallback, parseFailCallback){
	var message = log.message;
	var isCommandCall = false;
	_.each(commands, function(command){
		_.each(command.commandKeywords, function(commandKeyword){
			if(isCommand(message.text, commandKeyword) && command.run){
				console.log('running command:' + commandKeyword);			
				isCommandCall = true;	
				return command.run(message, getCommandParam(message.text, commandKeyword), parseSuccessCallback);
			}
		});
	});

	if(!isCommandCall){
		return parseFailCallback(log);	
	}	
};
exports.parse = parse;
