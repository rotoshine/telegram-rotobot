module.exports = function(mongoose){
  var NoticeSchema = new mongoose.Schema({
    chat_id: {
      type: Number,
      required: true
    },
    username: String,
  	content: String,
    noticeDate: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.model('Notice', NoticeSchema);
};
