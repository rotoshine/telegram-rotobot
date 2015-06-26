var request = require('request');
var telegram = require('../telegram');

var API_URL = 'http://api.openweathermap.org/data/2.5/weather?q=';
var DEFAULT_QUERY = 'Seoul';
var DEFAULT_QUERY_POSTFIX = ',kr';

var CITY_KOREAN_MAPPER = {
  '서울': 'Seoul',
  '부산': 'Busan',
  '대전': 'Daejeon',
  '마포': 'Mapo',
  '마포구': 'Mapo',
  '강남': 'Gangnam',
  '강남구': 'Gangnam'
}

module.exports = {
  commandKeywords: ['/search_weather', '/날씨'],
  description: '날씨를 검색합니다.',
  run: function(message, commandParam, callback){
    var searchResultText;
    var apiUrl;
    if(commandParam === '' || !CITY_KOREAN_MAPPER.hasOwnProperty(commandParam)){
      apiUrl = API_URL + DEFAULT_QUERY + DEFAULT_QUERY_POSTFIX;
      searchResultText = commandParam + ' 도시를 찾을 수 없어서 서울 날씨로 검색합니다. ';
    }else{
      apiUrl = API_URL + CITY_KOREAN_MAPPER[commandParam] + DEFAULT_QUERY_POSTFIX;
      searchResultText = '현재 ' + commandParam + '의 날씨입니다. ';
    }

    return request(apiUrl, function(err, res, result){
      if(err){
        return telegram.sendMessage({
          chat_id: message.chat.id,
          text: '날씨검색 에러가 발생했습니다. 개발자를 갈구세요.',
          callback;
        });
      }else{
          try{
            result = JSON.parse(result);
            var weatherText = [];
            for(var i = 0; i < result.weather.length; i++){
              weatherText.push(result.weather[i].description);
            }

            return telegram.sendMessage({
              chat_id: message.chat.id,
              text: searchResultText + weatherText.join(', ');
              callback: callback
            });
          }catch(e){
            console.log(e);
            return telegram.sendMessage({
              chat_id: message.chat.id,
              text: '날씨검색 에러가 발생했습니다. 개발자를 갈구세요.',
              callback;
            });
          }
      }
    });
  }
};
