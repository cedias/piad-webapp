var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();
/*
var site = require('./controllers/site');
var users = require('./controllers/users');
var products = require('./controllers/products');
*/

var reviews = require('./controllers/reviews');
var sql = require('./sql/queries');
var sqlUsers = require('./sql/sqlUsers');
var sqlReviews = require('./sql/sqlReviews');
var sqlProducts = require('./sql/sqlProducts');

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
  var sqlString = sqlReviews.nbReviews()+sqlUsers.nbUsers()+sqlProducts.nbProducts();
  sqlString += sqlReviews.listReviews(0,10,"hon","ASC");
  sqlString += sqlUsers.listUsers(0,10,"tru","ASC");
  sqlString += sqlProducts.listProducts(0,10,"rel","ASC");
 
	connection.query(sqlString, function(err, rows, fields) {
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

/* ---------- Reviews ------------ */

app.get('/reviews', function(req,res){

  connection.query(sqlReviews.listReviews(0,50,"rid","asc"), function(err, rows, fields) {
    if (err) throw err;
     res.render('reviews/reviews',{review_cat:true, tab:rows});

   });

});

app.get('/reviews/:page', function(req, res){ 
  var page = typeof req.param("page") !== 'undefined' ?(req.param("page")-1)*50 : 1;
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "rid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

  connection.query(sqlReviews.listReviews(page,50,sort,order), function(err, rows, fields) {
    if (err) throw err;

     res.send({tab:rows});

   });
});

app.get('/review/:id',function(req, res){
  var rid = req.param("id");

  connection.query(sqlReviews.getReview(rid), function(err, rows, fields) {
    if (err) throw err;

    res.render('reviews/review',{reviewInfo:rows});
  }); 
});

/*--------------- Users --------------*/
app.get('/users', function(req, res){ 

  connection.query(sqlUsers.listUsers(0,50,"uid","ASC"), function(err, rows, fields) {
    if (err) throw err;

	   res.render('users/users',{user_cat:true, tab:rows});
    });
	

});

app.get('/user/:id',function(req, res){
  var uid = req.param("id");

  connection.query(sqlUsers.getUser(uid), function(err, rows, fields) {
    if (err) throw err;
    

     var hashresults =
       {
        infoUser:rows
       };

    res.render('users/user',hashresults);
    });
});


/*----------------- Products --------------*/
app.get('/products', function(req, res){ 

   connection.query(sqlProducts.listProducts(0,50,"pid","ASC"), function(err, rows, fields) {
    if (err) throw err;

     res.render('products/products',{product_cat:true, tab:rows});
    });
});

app.get('/product/:id',function(req, res){
  var pid = req.param("id");

  connection.query(sqlProducts.getProduct(pid), function(err, rows, fields) {
    console.log(rows)
    res.render('products/product',{data:rows});
  });
  
});


app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
