var telegram = require('../telegram');

var REPLY_COMMENT = {
	39598673: 'Oi!!!',
	59496128: '가슴 만지게 해주세요!',
	64128282: 'ㅗ'
};

module.exports = {
	commandKeywords: ['/test'],
	description: '봇의 생존여부를 테스트할 수 있습니다',
	run: function(message, commandParam, callback){
		var replyComment = 'hello world!';

		if(REPLY_COMMENT.hasOwnProperty(message.from.id)){
			replyComment = REPLY_COMMENT[message.from.id];
		}
		return telegram.sendMessage({
			chat_id: message.chat.id,
			text: replyComment,
			callback: callback
		});
	}
};
