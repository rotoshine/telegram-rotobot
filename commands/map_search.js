var request = require('request');
var telegram = require('../telegram');
var config = require('../config');
var SEARCH_API = 'https://apis.daum.net/local/v1/search/keyword.json';

module.exports = {
  commandKeywords: ['/지도검색', '/search_map'],
  description: '지도에서 특정 장소를 검색합니다.',
  run: function(message, commandParam, callback){
    var messageFormat = {
      chat_id: message.chat.id,
      callback: callback
    };

    if(commandParam !== '' && commandParam.length > 1){
      var apiUrl = SEARCH_API + '?apikey=' + config.daumApiKey + '&query=' + commandParam + '&count=5';
      return request(apiUrl, function(err, res, result){
        if(err){
          messageFormat.text = '검색 중 에러가 발생했습니다. 개발자를 갈구세요.';
          return telegram.sendMessage(messageFormat)
        }else{
          if(result.length > 0){
            result = JSON.parse(result);

            if(result && result.channel && result.channel.item && result.channel){
              var items = result.channel.item;
              if(items && items.length > 0){
                var searchResults = ['"' + commandParam + '"의 다음지도 검색 결과'];
                for(var i = 0; i < items.length; i++){
                  searchResults.push(items[i].title + ' --> ' + items[i].placeUrl);
                }

                messageFormat.text = searchResults.join('\r\n');
                return telegram.sendMessage(messageFormat);
              }else if(items.length === 0) {
                messageFormat.text = "'" + commandParam + '"의 지도검색 결과가 없습니다.';
                return telegram.sendMessage(messageFormat);
              }
            }else{
              messageFormat.text = '검색 결과가 이상합니다. 개발자를 갈구세요.';
              return telegram.sendMessage(messageFormat)
            }
          }
        }
      })
    }else{
      messageFormat.text = '검색어는 2글자 이상 입력해주세요.';
      return telegram.sendMessage(messageFormat);
    }
  }
}
