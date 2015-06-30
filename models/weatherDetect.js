module.exports = function(mongoose){
  var WeatherDetector = new mongoose.Schema({
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

  return mongoose.model('WeatherDetector', WeatherDetector);
};
