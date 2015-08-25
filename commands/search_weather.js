var telegram = require('../telegram');
var weather = require('../weather');


module.exports = {
  commandKeywords: ['/search_weather', '/날씨'],
  description: '날씨를 검색합니다.',
  run: function(message, commandParam, callback){
    var searchResultTexts = [];

    if(commandParam === ''){
      commandParam = '서울';
    }

    return weather.getWeather(commandParam, function(err, result){
      if(err){
        return telegram.sendMessage({
          chat_id: message.chat.id,
          content: '날씨검색 에러가 발생했습니다. 개발자를 갈구세요.',
          reply_to_message_id: message.message_id,
          callback: callback
        });
      }else{
        searchResultTexts.push('현재 ' + commandParam + '의 날씨입니다.');
        searchResultTexts.push('온도:' + result.main.temp + '도, ' + '습도:' + result.main.humidity);

        var weatherTexts = [];
        for(var i = 0; i < result.weather.length; i++){
          var weather = result.weather[i];
          if(weather.descriptionKr !== undefined){
            weatherTexts.push(weather.main + ':' + weather.descriptionKr);
          }else{
            weatherTexts.push(weather.main + ':' + weather.description);
          }
        }
        return telegram.sendMessage({
          chat_id: message.chat.id,
          reply_to_message_id: message.message_id,
          content: searchResultTexts.join('\r\n') + weatherTexts.join(', '),
          callback: callback
        });
      }
    });
  }
};
