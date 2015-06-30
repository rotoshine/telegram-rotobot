module.exports = function(mongoose){
  var WeatherDetector = new mongoose.Schema({
    coord: {
      lon: Number,
      lat: Number
    },
    sys:{
      type: Number,
      id: Number,
      message: Number,
      country: String,
      sunrise: Date,
      sunset: Date
    },
    weather: [{
      id: Number,
      main: String,
      description: String,
      icon: String
    }],
    base: String,
    main: {
      temp: Number,
      pressure: Number,
      humidity: Number,
      temp_min: Number,
      temp_max: Number
    },
    visibility: Number,
    wind: {
      speed: Number,
      deg: Number
    },
    clouds: {
      all: Number
    },
    dt: Date,
    id: Number,
    name: String,
    cod: Number
  });

  return mongoose.model('WeatherDetector', WeatherDetector);
};
