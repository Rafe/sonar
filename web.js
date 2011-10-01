var app = require('express').createServer(),
    io = require('socket.io').listen(app);


app.get('/', function(req,res){
  res.sendfile(__dirname+'/index.html');
});

app.listen(80);

var chat = io
  .of('/chat')
  .on('connection',function(socket){
    socket.emit('a message',{
      that: 'only',
      '/chat':'will get'
    });

    socket.emit('a message',{
      eveeryone: 'in',
      '/chat':'will get'
    });
  
  });

var news = io
  .of('/news')
  .on('connection', function(socket){
    socket.emit('item',{news: 'item'});
  });

io.sockets.on('connection',function(socket){
  socket.emit('news',{ hello:'world' });
  socket.on('my other event', function (data){
    console.log(data);
  });

  socket.on('set nickname',function(name){
    socket.set("nickname",name,function(){
      socket.emit('ready',name);
    })
  });

  socket.on('msg',function(data){
    socket.get('nickname',function(err, name){
      console.log('Chat messgae by ', name);
    });
  });
});
