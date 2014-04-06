//reviews.js
//	reviews/:page
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'amazon',
  password : 'amazon',
  multipleStatements: true,
});

connection.query('USE amazon');

exports.list = function reviewList(req,res)
{

  var page = typeof req.param("page") !== 'undefined' ?(req.param("page")-1)*50 : 1;
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "rid";
  var order = typeof req.query.order !== 'undefined' ? req.query.sort : "asc";


  connection.query(sqlReviews.listReviews(page,50,sort,order), function(err, rows, fields) {
    if (err) throw err;

     res.render('reviews/reviews',{review_cat:true, tab:rows});

   });

}