var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  title: String,
  bodyText: String,
  author: String,
  date: {type: Date, default: Date.now}
});

/* // TODO: Will implement comments later
var commentSchema = new mongoose.Schema({
  body: String,
  author: {type: String, default: "Anonymous"}
  date: {type: Date, default: Date.now}
});
*/

mongoose.model('blog', blogSchema);

//Comment out for now
//mongoose.model('comment', commentSchema);
