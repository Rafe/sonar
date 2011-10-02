/**
 * Module dependencies.
 */

<<<<<<< HEAD
//test
=======
//chat
>>>>>>> 02916257a755bb0b2cbb255553e8d79427c9c6b8

var express = require('express');

var app = module.exports = express.createServer();

//socket.io chat 
var chat = require("socket.io").listen(app);

chat
  .of("/join")
  .on("conntection",function(socket){
   console.log("test socket");
});

setInterval(4000,function(){
  chat.emit("message",{data:"test"}); 
});

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Sonar'
  });
});

app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
