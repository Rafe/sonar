var config = {
  me : $.cookie("me") || "me"
};

$(function(){
  socket = io.connect("/");
  socket.on("connection",function(){
    socket.emit("join",{
      user: config.me
    });
    console.log("started");
  });

  socket.on("join",function(data){
    $("#say").append("<li>"+ data.user +"</li>");
  });

  socket.on("message",function(data){
    addMessage(data);
  });

  $("#say").keypress(function(event){
    var data = $(event.target).val();
    
    if(event.which == 13){
      sendMessage({
        user:config.me,
        data:data,
      })
      event.preventDefault();
    }
  });

  function joinRoom(room){
    socket.of("/room/"+room).on("message",function(data){
      addMessage(data);
    });
  }

  function sendMessage(data){
    socket.emit("message",data);
    $("#say").val("");
  }
});

function addMessage(data){
  var template = "<li>"+
  "<span class='user'><%= user %></span> says " +
  "<span><%= data %></span> at " +
  "<abbr class='timeago' title='<%= date %>'></abbr> " +
  "</li>";
  var message = _.template(template,data);
  $("#chatroom").append(message);
  $("abbr.timeago").timeago();
}
