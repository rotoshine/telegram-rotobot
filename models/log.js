module.exports = function(mongoose){
  var LogSchema = new mongoose.Schema({
  	update_id: {
  		type: Number,
  		unique: true
  	},
  	message: {
  		message_id: Number,
  		from: {
  			id: Number,
  			first_name: String,
  			username: String
  		},
  		chat: {
  			id: Number,
  			first_name: String,
  			username: String
  		},
  		text: String,
      date: {
        type: Date,
        default: Date.now
      }
  	}
  });

  return mongoose.model('Log', LogSchema);
};
