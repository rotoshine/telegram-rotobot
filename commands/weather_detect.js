var _ = require('underscore');
var telegram = require('../telegram');
var weather = require('../weather');
var mongoose = require('../connection');
var WeatherDetect = mongoose.model('WeatherDetect');

function addDetectCity(chat_id, city, callback){
  if(weather.isAssistCity(city)) {
    WeatherDetect
      .find({chat_id: chat_id})
      .exec(function (err, weatherDetects) {
        if (err) {
          return callback(err);
        } else if (weatherDetects.length === 1) {
          var weatherDetect = weatherDetects[0];
          if (_.indexOf(weatherDetect.detectCities, city) === -1) {
            weatherDetect.detectCities.push(city);
            weatherDetect.save(function (err) {
              return callback(err);
            });
          } else {
            return callback(err);
          }
        }
      });
  }else{

  }
}

function removeDetectCity(chat_id, city, callback){
  WeatherDetect
    .find({chat_id:chat_id})
    .exec(function(err, weatherDetects){
      if(err){
        return callback(err);
      }else if(weatherDetects.length === 1){
        var weatherDetect = weatherDetects[0];
        if(_.indexOf(weatherDetect.detectCities, city) > -1){
          weatherDetect.detectCities = _.without(weatherDetect.detectCities, city);
          weatherDetect.save(function(err){
            return callback(err);
          });
        }else{
          return callback(err);
        }
      }
    });
}

module.exports = {
	commandKeywords: ['/weather_detector', '/날씨탐지'],
	description: '날씨의 변동을 탐지합니다.',
	run: function(message, commandParam, callback){
		if(commandParam !== ''){
			var commandParams = commandParam.split(' ');

			if(commandParams.length === 1){

			}else if(commandParams.length === 2){
        if(commandParams[0] === '추가'){
          addDetectCity(message.chat.id, commandParams[1], message)
        }
			}else{
				var howToUse = '/날씨탐지 시작|중지\r\n' +
					'/날씨탐지 추가 (도시명)\r\n' +
					'/날씨탐지 삭제 (도시명)';
				return telegram.sendMessage({
					chat_id: message.chat.id,
					text:howToUse,
					callback: callback
				});
			}
		}
	}
};
