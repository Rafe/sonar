var io = require("socket.io").listen(8000);
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
