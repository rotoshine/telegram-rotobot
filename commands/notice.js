var mongoose = require('../connection');
var Notice = mongoose.model('Notice');
var telegram = require('../telegram');

function setNotice(params){
	var notice = new Notice({
		chat_id: params.chat_id,
		username: params.username,
		content: params.content
	});

	notice.save(function(err){
		if(err){
			console.log(err);
		}else{
			telegram.sendMessage({
				chat_id: params.chat_id,
				text: '공지가 설정되었습니다. "' + notice.content + '"',
				callback: params.callback || function(){}				
			});	
		}
	});
};

function getNotice(params){
	var chat_id = params.chat_id;
	return Notice
		.find({ chat_id: chat_id, })
		.sort('-noticeDate')
		.limit(1)
		.exec(function(err, notices){			
			if(err){
				console.log(err);
				telegram.sendMessage({
					chat_id: chat_id,
					text: '공지를 가져오다 에러가 발생했습니다. 개발자를 갈구세요.'							
				});
			}else if(notices.length === 1){
				telegram.sendMessage({
					chat_id: chat_id,
					text: '현재 공지는 "' + notices[0].content + '" 입니다.'							
				});
			}else{
				telegram.sendMessage({
					chat_id: chat_id,
					text: '현재 공지가 없습니다.',							
				});
			}
			return params.callback();
		});
}

var command = {
	commandKeywords: ['/공지', '/notice'],
	description: '공지사항을 확인하거나 설정합니다.',
	run: function(message, commandParam, callback){
		if(commandParam !== '' && commandParam.length > 0){
			return setNotice({
				chat_id: message.chat.id,
				username: message.from.username,
				content: commandParam,
				callback: callback
			});	
		}else{
			return getNotice({
				chat_id: message.chat.id,
				callback: callback
			});
		}		
	}
};

module.exports = command;