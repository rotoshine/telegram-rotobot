var telegram = require('../telegram');

// TODO DB로 이관하자.
var REPLY_COMMENT = {
	39598673: {
		messageType: 'sticker',
		content: 'stickers/oi.webp'
	},
	59496128: {
		messageType: 'sticker',
		content: 'photos/trapcard.jpg'
	},
	64128282: {
		messageType: 'sticker',
		content: 'photos/trapcard.jpg'
	}
};

module.exports = {
	commandKeywords: ['/test'],
	description: '봇의 생존여부를 테스트할 수 있습니다',
	run: function(message, commandParam, callback){
		var replyComment = 'hello world!';
		var replyType = 'message';
		
		var target = message.from.id;
		if(REPLY_COMMENT.hasOwnProperty(target) && 
			REPLY_COMMENT[target].messageType !== undefined){
			
			replyType = REPLY_COMMENT[target].messageType;
			replyComment = REPLY_COMMENT[target].content;
		}
		
		return telegram.send(replyType, {
			chat_id: message.chat.id,
			reply_to_message_id: message.message_id,
			content: replyComment,
			callback: callback
		});
	}
};
