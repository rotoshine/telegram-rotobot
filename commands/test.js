var telegram = require('../telegram');

module.exports = {
	commandKeywords: ['/test'],
	run: function(message, commandParam, callback){
		return telegram.sendMessage({
			chat_id: message.chat.id,
			text: 'hello world! ' + commandParam,
			callback: callback
		});
	}
};