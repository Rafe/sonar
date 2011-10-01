var app = require('express').createServer(),
    io = require('socket.io').listen(app);

app.get('/', function(req,res){
  res.sendfile(__dirname+'/index.html');
});

app.listen(80);

