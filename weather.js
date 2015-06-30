var request = require('request');

var API_URL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=';
var DEFAULT_QUERY = 'Seoul';
var DEFAULT_QUERY_POSTFIX = ',kr';

var CITY_KOREAN_MAPPER = {
  '서울': 'Seoul',
  '부산': 'Busan',
  '대전': 'Daejeon',
  '마포': 'Mapo',
  '마포구': 'Mapo',
  '강남': 'Gangnam',
  '강남구': 'Gangnam',
  '용산': 'Yongsan',
  '용산구': 'Yongsangu',
  '수원': 'Suwon'
};

var WEATHER_RESULT_TEXT = {
  'sky is clear': '맑음',
  'few clouds': '구름 약간',
  'mist': '안개',
  'haze': '옅은 안개',
  'light rain': '약간의 비'
};

/**
 * 
 * @param city
 * @returns {boolean}
 */
function isAssistCity(city){
  return CITY_KOREAN_MAPPER.hasOwnProperty(city);
}
exports.getCityFromEn = isAssistCity;

function getWeather(city, callback) {
  var apiUrl;

  if(city === '') {
    city = '서울';
  }
  if(!CITY_KOREAN_MAPPER.hasOwnProperty(city)){
    apiUrl = API_URL + DEFAULT_QUERY + DEFAULT_QUERY_POSTFIX;

  }else{
    apiUrl = API_URL + CITY_KOREAN_MAPPER[city] + DEFAULT_QUERY_POSTFIX;
  }
  return request(apiUrl, function(err, res, result){
    if(err){
      return callback(err, null);
    }else{
      try{
        result = JSON.parse(result);
        for(var i = 0; i < result.weather.length; i++){
          if(WEATHER_RESULT_TEXT.hasOwnProperty(result.weather[i].description)){
            result.weather[i].descriptionKr = WEATHER_RESULT_TEXT[result.weather[i].description];
          }
        }
        return callback(null, result);
      }catch(e){
        return callback(e, null);
      }
    }
  });
}

exports.getWeather = getWeather;

function collectWeatherLog(){

}

