// Asynchronous Objects Example
// See the accompanying README.md for details.

// Run this demo: `node script.js`
var express = require('express');
var bodyParser = require('body-parser');
var RiveScript = require('rivescript');
var app = express();
var rs = new RiveScript();
var weatherService = require('./services/weather');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a prototypical class for our own chatbot.
var AsyncBot = function(onReady) {
    var self = this;

    // Load the replies and process them.
    rs.loadFile('weatherman.rive', function() {
      rs.sortReplies();
      weatherService(rs);
      onReady();
    });

    // This is a function for delivering the message to a user.
    self.sendMessage = function(username, message) {
      // This just logs it to the console like '[Bot] @username: message'

      return ['[Brick Tamland]', message].join(': ');
    };

    // This is a function for a user requesting a reply. It just proxies through
    // to RiveScript.
    self.getReply = function(username, message, callback) {
      return rs.replyAsync(username, message, self).then(function(reply){
        callback.call(this, null, reply);
      }).catch(function(error) {
        callback.call(this, error);
      });
    }
};

// Create and run the bot.
var bot = new AsyncBot(function() {
  app.post('/reply', function(req, res) {
    var nick = req.body.nick;
    var cmd = req.body.cmd;

    bot.getReply(nick, cmd, function(error, reply){
      if (error) {
        res.json(bot.sendMessage(nick, 'Oops. The weather service is not cooperating!'));
      } else {
        res.json(bot.sendMessage(nick, reply));
      }
    });
  });

  app.listen(3000, function() {
		console.log('Listening on http://localhost:3000');
	});
});
