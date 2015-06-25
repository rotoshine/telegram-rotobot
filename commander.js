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
