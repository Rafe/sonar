/**
 * Module dependencies.
 */

require.paths.unshift(".");

var model = require("model");
var _ = require("underscore");
var express = require('express');
var app = express.createServer();
var token;

/*  foursquare  */
var config = {
  "secrets":{
    "clientId" : "QYO1QPEB5G3D5IXAZLBZY0KF4DYWGQV54UQAXH34OHXIKR2T",
    "clientSecret" : "GUYIUUOFEUCTG3O0TJW3OYQNPEQC22L4MIYVPJTJWHM2QB1L",
    "redirectUrl" : "http://miimenu.com/callback"
  }
}

var places = [ 
  {location:{"lat":40.728771, "lng":-73.995752}, "name":"HackNY","stats":{"checkinsCount":100}}, 
  {location:{"lat":40.729218, "lng":-73.996664}, "name":"NYU Stern","stats":{"checkinsCount":290}}, 
  {location:{"lat":40.730779, "lng":-73.997533}, "name":"Washington Sq Park","stats":{"checkinsCount":4000}}, 
];

var foursquare = require("node-foursquare")(config);

//socket.io chat 
var io = require("socket.io").listen(app);

io.sockets.on("connection",function(socket){
   console.log("User Connected");

   if(token){
     foursquare.Venues.search(40.728771,-73.995752,{},token,function(err,data){
       socket.emit("venues",data.venues);
     });
   }
   socket.emit("feeds",places);

   socket.on("join",function(data){
     socket.set("name",data.name);

     console.log("User Joined "+ socket.name + " Room: " + data.room );

     //join room
     console.log("leaving..."+data.previous);
     console.log("joining..."+ socket.name + " to "+data.room);
     socket.leave(data.previous);
     socket.join(data.room);

     model.Room.findOne({name:data.room},function(err,doc){
       if(!doc){
         var doc = new model.Room({name:data.room }); 
         console.log("new room!!");
         doc.save();
       }else{
         //doc.users.push({name:data.name});
         data.messages = doc.messages.slice(-20);
         data.users = doc.users;
         console.log(doc);
       }
       io.sockets.emit("join room",data);
     });
   });

  socket.on("message",function(res){
    model.Room.findOne({name:res.room},function(err,doc){
      res.date = new Date();
      doc.messages.push({
        location: res.location,
        date : new Date(),
        user : res.user,
        data : res.data
      });
      doc.save();
      console.log("boardcasts to "+res.room);
      socket.broadcast.to(res.room).emit("message",res); 
    });
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
});

app.get('/login', function(req, res) {
  res.writeHead(303, { "location	": foursquare.getAuthClientRedirectUrl() });
  res.end();
});

app.get('/callback', function (req, res) {
  foursquare.getAccessToken({
    code: req.query.code ,
    redirect_uri: "http://miimenu.com/callback",
    client_id: config.secrets.clientId,
    client_secret: config.secrets.clientSecret
  }, function (error, accessToken) {
    if(error) {
      res.send("An error was thrown: " + error.message);
    } else {
      token = accessToken;
      foursquare.Users.getUser("self",accessToken,function(error,data){
        console.log(data);
        res.cookie("me",data.user.firstName);
        res.redirect("/");
      });
    }
  });
});

app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

