/**
 * Module dependencies.
 */

var express = require('express');

var app = express.createServer();

/*  foursquare  */
var config = {
  "secrets" : {
    "clientId" : "RJQIJESWVTS4NH4MFD4M0R4XWP0GTT4N540UGLMODADMOG4S",
    "clientSecret" : "TU0Z0TAVCI21IK3Q4ZEMZWJ4CTWYQCGJNZ2E2Z4ECJV1X5ZG",
    "redirectUrl" : "http://miimenu.com/callback"
  }
}

var places = {"markers": [ 
  {"lat":40.728771, "lng":-73.995752, "chat":"HackNY", "users":"Jimmy, Daren, Ray", "label":"Marker One"}, 
  {"lat":40.729218, "lng":-73.996664, "chat":"NYU Stern", "users":"Jimmy, Daren, Ray", "label":"Marker One"}, 
  {"lat":40.730779, "lng":-73.997533, "chat":"Washington Sq Park", "users":"Jimmy, Daren, Ray", "label":"Marker Three"}
]}

var channels = {}

var foursquare = require("node-foursquare")(config);

//socket.io chat 
var io = require("socket.io").listen(app);

var channels = {};

io.sockets.on("connection",function(socket){

   console.log("User Connected");

   socket.emit("feeds",places);

   socket.on("join",function(data){
     socket.set("name",data.name);
     console.log("User Joined "+ socket.name + " Room: " + data.room );
     //setting users
     data.users = ["Jimmy","John","Jack"];

     //register channels
     socket.leave(data.previous);
     console.log("leaving..."+data.previous);
     socket.join(data.room);
     console.log("joining..."+ socket.name + " to "+data.room);

     data.messages = channels[data.room] = channels[data.room] || [];
     io.sockets.emit("join room",data);
   });

  socket.on("message",function(res){
    res.date = new Date();
    console.log("boardcasts to "+res.room);
    socket.broadcast.to(res.room).emit("message",res); 
    channels[res.room].push(res);
  });

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
  console.log(places);
});

/**********************************************************/
app.get('/login', function(req, res) {
  res.writeHead(303, { "location	": Foursquare.getAuthClientRedirectUrl() });
  res.end();
});

app.get('/callback', function (req, res) {
  Foursquare.getAccessToken({
    code: req.query.code ,
    redirect_uri: "http://miimenu.com/callback",
    client_id: "RJQIJESWVTS4NH4MFD4M0R4XWP0GTT4N540UGLMODADMOG4S",
    client_secret: "TU0Z0TAVCI21IK3Q4ZEMZWJ4CTWYQCGJNZ2E2Z4ECJV1X5ZG"
  }, function (error, accessToken) {
	if(error) {
      res.send("An error was thrown: " + error.message);
    }
    else {
      // Save the accessToken and redirect.
    }
  });
});
/**********************************************************/

app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

