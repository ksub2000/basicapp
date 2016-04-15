var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

var router = express.Router();

// "Use" function from method-override Readme, with slight change beacuse of deprecated body-parser
router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride( function(req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
}));


router.route('/')
      //Find all blog posts and throw them out there
    .get(function(req, res, next) {
        mongoose.model('blog').find({}, function (err, blogs) {
              if (err) {
                  return console.error(err); //If there's an error, return it
              } else {
                  res.format({
                    html: function(){
                        res.render('blogs/index', {
                              title: 'All posts',
                              "blogs" : blogs
                          });
                    },
                });
              }
        });
    })
    // POSTing a new blog
    .post(function(req, res) {
        var title = req.body.title;
        var bodyText = req.body.bodyText;
        var author = req.body.author;
        var date = req.body.date;
        mongoose.model('blog').create({
            title : title,
            bodyText : bodyText,
            author : author,
            date : date
        }, function (err, blog) {
              if (err) {
                  res.send("Error");
              } else {
                  //blog post created
                  console.log('Posted blog with title: ' + blog.title);
                  res.format({
                    html: function(){
                        res.location('/');
                        res.redirect('/');
                    },
                });
              }
        });
    });

router.get('/new', function(req, res) {

       res.render('blogs/new', { title: 'New Post:' });

});

// Here is the GET function to read a post
router.route('/:id')
      .get(function(req, res) {
        mongoose.model('blog').findById(req.id, function (err, blog) {
          if (err) {
            console.log('GET Error: ' + err); // display error if there is one
          } else {
            console.log('GET Retrieving ID: ' + blog._id);
            var blogdate = blog.date.toISOString();
            res.format({
              html: function(){
                  res.render('blogs/show', {
                    'blogdate' : blogdate,
                    'blog' : blog
                  });
              },
            });
          }
        });
 });

router.route('/:id/edit')
    	.get(function(req, res) {
    	    mongoose.model('blog').findById(req.id, function (err, blog) {
    	        if (err) {
    	            console.log('GET Error: There was a problem retrieving: ' + err);
    	        } else {
    	            console.log('GET Retrieving ID: ' + blog._id);
                  var blogdate = blog.date.toISOString();
    	            res.format({
    	                html: function(){
    	                       res.render('blogs/edit', {
    	                          title: 'blog' + blog._id,
                                'blogdate' : blogdate,
    	                          'blog' : blog
    	                      });
    	                 },
    	            });
    	        }
    	    });
    	})

    	.put(function(req, res) {
          var title = req.body.title;
          var bodyText = req.body.bodyText;
          var author = req.body.author;
          var date = req.body.date;

    	    mongoose.model('blog').findById(req.id, function (err, blog) {
    	        blog.update({
    	            title : title,
    	            bodyText : bodyText,
    	            author : author,
    	            date : date
    	        }, function (err, blogID) {
    	          if (err) {
    	              res.send("Error: " + err);
    	          }
    	          else {
    	                  res.format({
    	                      html: function(){
    	                           res.redirect('/' + blog._id);
    	                     },
    	                  });
    	           }
           });
    	    });
    	})

    	.delete(function (req, res){
    	    mongoose.model('blog').findById(req.id, function (err, blog) {
    	        if (err) {
    	            return console.error(err);
    	        } else {
    	            blog.remove(function (err, blog) {
    	                if (err) {
    	                    return console.error(err);
    	                } else {
    	                    console.log('DELETE removing ID: ' + blog._id);
    	                    res.format({
    	                          html: function(){
    	                               res.redirect('/');
    	                         },
    	                      });
    	                }
    	            });
    	        }
    	    });
    });

// Export the routes
module.exports = router;
