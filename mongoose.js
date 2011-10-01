var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect('mongodb:localhost/test');

var User = mongoose.model("User", new Schema({
  name: String,
  password: String,
  date : Date
}));

var me = new User();
me.name = "Jimmy";
me.password = "test";
me.date = new Date();
me.save();

User.find({},function(err, docs){
  console.log(docs);
});
