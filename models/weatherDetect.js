module.exports = function(mongoose){
  var WeatherDetect = new mongoose.Schema({
    chat_id: {
      type: Number,
      required: true,
      unique: true
    },
    status: {
      type: Boolean
    },
    detectCities: [String]
  });

  return mongoose.model('WeatherDetect', WeatherDetect);
};
