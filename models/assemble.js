module.exports = function(mongoose){
  var AssembleSchema = new mongoose.Schema({
	assembleChatId: {
	  required: true,
	  type: Number	
	},
	assembleDateString: {
	  required: true,
	  type: String
	},
	assembleUsers: [String]
  });

  return mongoose.model('Assemble', AssembleSchema);
};
