var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'amazon',
  password : 'amazon'
});

connection.query('USE amazon');


app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){ 

	connection.query('SELECT r.review_id as rid, u.username as uid, p.product_name as pname, r.honesty_score as hon FROM reviews r,users u, products p where u.user_id = r.user_id AND p.product_id = r.product_id ORDER BY honesty_score asc LIMIT 0,10 ', function(err, rows, fields) {
	  if (err) throw err;
	   res.render('index',{title:"SpamReviewDetection",result:rows});
	});

});




app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
