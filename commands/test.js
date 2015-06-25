var telegram = require('../telegram');

module.exports = {
	commandKeywords: ['/test'],
	description: '봇의 생존여부를 테스트할 수 있습니다',
	run: function(message, commandParam, callback){
		return telegram.sendMessage({
			chat_id: message.chat.id,
			text: 'hello world! ' + commandParam,
			callback: callback
		});
	}
};