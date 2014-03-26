var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();
/*
var site = require('./controllers/site');
var reviews = require('./controllers/reviews');
var users = require('./controllers/users');
var products = require('./controllers/products');
*/
var sql = require('./sql/queries');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'amazon',
  password : 'amazon',
  multipleStatements: true,
});

connection.query('USE amazon');

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);

app.use(express.static(path.join(__dirname, 'public')));

/*HOME*/
app.get('/', function(req, res){ 

	connection.query(sql.nbReviews+sql.nbUsers+sql.nbProducts+sql.indexTab1+sql.indexTab2+sql.indexTab3, function(err, rows, fields) {
	  if (err) throw err;
	
  	   var hashresults =
  	   {
  	   	nb_reviews:rows[0][0]["nb_reviews"],
  	   	nb_users:rows[1][0]["nb_users"],
  	   	nb_products:rows[2][0]["nb_products"],
  	   	tab1:rows[3],
  	   	tab2:rows[4],
  	   	tab3:rows[5],
  	   };
  	   

	   res.render('index',hashresults);
	});

});

/*Reviews*/
app.get('/reviews', function(req, res){ 

	connection.query(sql.reviews, function(err, rows, fields) {
    if (err) throw err;

	   res.render('reviews/reviews',{reviews:true, tab:rows});

   });
	

});

/*Users*/
app.get('/users', function(req, res){ 

  connection.query(sql.users, function(err, rows, fields) {
    if (err) throw err;

	   res.render('users/users',{users:true, tab:rows});
    });
	

});

/*Products*/
app.get('/products', function(req, res){ 

   connection.query(sql.products, function(err, rows, fields) {
    if (err) throw err;

     res.render('products/products',{products:true, tab:rows});
    });
});




app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
