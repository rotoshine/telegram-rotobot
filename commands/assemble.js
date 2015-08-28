var mongoose = require('../connection');
var Assemble = mongoose.model('Assemble');
var moment = require('moment');
var telegram = require('../telegram');
var _ = require('underscore');

var command = {
  commandKeywords: ['/어셈블', '/assemble', '/어쎔블'],
  description: '어셈블!!!',
  run: function(message, commandParam, callback){
    var userName = getUserName(message);
    var currentDateString = getCurrentDateString();
    
    return Assemble
      .findOne({
        assembleChatId: message.chat.id,
        assembleDate: currentDateString
      })
      .exec(function(err, assemble){
        if(err){
          console.error(err);
          return;
        }else{
          return sendAssemblePhoto(message, function(){
            if(assemble !== undefined && assemble !== null){
              var alreadyAssembleJoin = false;
              for(var i = 0; i < assemble.assembleUsers.length;i++){
                if(assemble.assembleUsers[i] === userName){
                  alreadyAssembleJoin = true;
                  break;
                }
              }
              
              if(alreadyAssembleJoin){
                return sendAssembleInfo(message, assemble, callback);
              }else{
                Assemble
                  .update(
                    {
                      assembleChatId: message.chat.id,
                      assembleDateString: currentDateString
                    },
                    {
                      assembleUsers: assemble.concat([userName])
                    },
                    {},
                    function(err){
                      if(err){
                        console.error(err);
                        return;
                      }else{
                        assemble.assembleUsers.push(userName);
                        return sendAssembleInfo(message, assemble, callback);
                      }
                    }
                  )
              }
            }else{
              var newAssemble = new Assemble({
                assembleChatId: message.chat.id,
                assembleName: commandParam,
                assembleUsers: [userName],
                assembleDateString: currentDateString
              });
              
              return newAssemble.save(function(err){
                if(err){
                  console.error(err);
                }
                
                return sendAssembleInfo(message, newAssemble, callback);
              });  
          }
        });
      }
    }); 
  }
};

function sendAssembleInfo(message, assemble, callback){
  return telegram.sendMessage({
    chat_id: message.chat.id,
    content: '어셈블 멤버 : ' + assemble.assembleUsers.join(', '),
    callback: callback
  });
}
function sendAssemblePhoto(message, callback){
  return telegram.send('sticker', {
    chat_id: message.chat.id,
    content: '/photos/assemble.jpg',
    callback: callback
  });
}

function getCurrentDateString(){
  return moment().format('YYYYMMDD');
}

function getUserName(message){
  var username = undefined;
  if(message && message.from && message.from.first_name){
    username = message.from.first_name;
    if(message.from.last_name){
      username = username + message.from.last_name;
    }
  }
  
  if(username === undefined || username.length === 0){
    username = message.from.username;
  }
  
  return username;
}
module.exports = command;