var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect('mongodb:localhost/sonar');

var User = exports.User = mongoose.model("User", new Schema({
  name: String,
  location: String
}));

var Room = exports.Room = mongoose.model("Room", new Schema({
  name: String,
  users: [User],
  messages: [Message],
  lat: Number,
  lon: Number
}));

var Message = exports.Message = mongoose.model("Message",new Schema({
  user: String,
  date: Date,
  location: String,
  data: String  
}));
