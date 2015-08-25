var telegram = require('../telegram');
var request = require('request');
var ROTOWIKI_URL = 'http://roto.wiki';
var ROTOWIKI_SEARCH_API = ROTOWIKI_URL + '/api/documents';


module.exports = {
	commandKeywords: ['/로토위키검색', '/search_rotowiki', '/로토위키 검색'],
	description: '로토위키를 검색합니다',
	run: function(message, commandParam, callback){
		if(commandParam !== '' && commandParam.length > 1){
			request(ROTOWIKI_SEARCH_API + '?title=' + commandParam, function(err, res, result){
				console.log(arguments);	
				if(err){
					return telegram.sendMessage({
						chat_id: message.chat.id,
						reply_to_message_id: message.message_id,
						content: '검색 중 에러가 발생했습니다. 개발자를 갈구세요.',
						callback: callback
					});
				}else if(result !== ''){
					try{
						var documents = JSON.parse(result);
										
						if(documents.length > 0){
							var resultMessages = [
								'"' + commandParam + '"의 검색결과 입니다.'
							];
	
							for(var i = 0; i < documents.length; i++){
								resultMessages.push(documents[i].title + ' - ' + ROTOWIKI_URL + '/document-by-id/' + documents[i].id);
							}
	
							return telegram.sendMessage({
								reply_to_message_id: message.message_id,
								chat_id: message.chat.id,
								content: resultMessages.join('\r\n'),
								callback: callback
							});
						}else{
							return telegram.sendMessage({
								chat_id: message.chat.id,
								reply_to_message_id: message.message_id,
								content: commandParam + '의 검색 결과가 없습니다.',
								callback: callback
							});
						}
					}catch(e){
						console.error(e.message);
						return callback();
					}
				}

				// 혹시 모르는 상태를 대비
				return callback();
			});
		}else{
			return telegram.sendMessage({
				chat_id: message.chat.id,
				reply_to_message_id: message.message_id,
				content: '검색어를 2글자 이상 입력하세요.',
				callback: callback
			});
		}
	}
}
