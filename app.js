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

/*******************************- PAGE ROUTES -***************************************/

/*-----------INDEX -----------*/

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

/*---- Get review list page -------*/
app.get('/reviews', function(req,res){

  connection.query(sqlReviews.listReviews(0,50,"rid","asc"), function(err, rows, fields) {
    if (err) throw err;
     res.render('reviews/reviews',{review_cat:true, tab:rows});

   });

});

/*get review :id page*/
app.get('/review/:id',function(req, res){
  var rid = req.param("id");

  connection.query(sqlReviews.getReview(rid), function(err, rows, fields) {
    if (err) throw err;
    

    if(rows[0].nearDupe === null && rows[0].exactDupe === null)
      res.render('reviews/review',{reviewInfo:rows});
    else
      res.render('reviews/duplicateReview',{reviewInfo:rows});
  }); 
});

/*--------------- Users --------------*/

/*Get 1st page*/
app.get('/users', function(req, res){ 

  connection.query(sqlUsers.listUsers(0,50,"uid","ASC"), function(err, rows, fields) {
    if (err) throw err;

	   res.render('users/users',{user_cat:true, tab:rows});
    });
	

});

/*Get user page*/
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

/*get products list*/
app.get('/products', function(req, res){ 

   connection.query(sqlProducts.listProducts(0,50,"pid","ASC"), function(err, rows, fields) {
    if (err) throw err;

     res.render('products/products',{product_cat:true, tab:rows});
    });
});

/*get product page*/
app.get('/product/:id',function(req, res){
  var pid = req.param("id");

  connection.query(sqlProducts.getProduct(pid), function(err, rows, fields) {
    res.render('products/product',{data:rows});
  });
  
});



/************************- AJAX CALLS -****************************************/



//----- REVIEWS 

/*Ajax reviews loader*/
app.get('/reviews/:page', function(req, res){ 
  var page = typeof req.param("page") !== 'undefined' ?(req.param("page")-1)*50 : 0;
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "rid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

  connection.query(sqlReviews.listReviews(page,50,sort,order), function(err, rows, fields) {
    if (err) throw err;

     res.send({tab:rows});

   });
});

/*review exact_duplicates*/
app.get('/review/:id/exactdupes', function(req, res){
  var rid = req.param("id");
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "rid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

  connection.query(sqlReviews.listExactDuplicates(rid,0,30,sort,order), function(err, rows, fields) {
    if (err) throw err;
     res.send({tab:rows});
   });

}); 

/*review near_duplicates*/
app.get('/review/:id/neardupes', function(req, res){
  var rid = req.param("id");
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "rid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

   connection.query(sqlReviews.listNearDuplicates(rid,0,30,sort,order), function(err, rows, fields) {
    if (err) throw err;
     res.send({tab:rows});
   });

}); 

//----- USERS
/*Ajax users loader*/
app.get('/users/:page', function(req, res){ 
  var page = typeof req.param("page") !== 'undefined' ?(req.param("page")-1)*50 : 0;
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "uid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

  connection.query(sqlUsers.listUsers(page,50,sort,order), function(err, rows, fields) {
    if (err) throw err;

     res.send({tab:rows});

   });
});

app.get('/user/:id/reviews',function(req,res){

  var page = typeof req.query.page !== 'undefined' ?(req.query.page-1)*10 : 0;
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "rid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

  connection.query(sqlReviews.listReviews(page,10,sort,order,"user",req.param("id")), function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});

   });

});


//----- PRODUCTS

/*Ajax products loader*/
app.get('/products/:page', function(req, res){ 
  var page = typeof req.param("page") !== 'undefined' ?(req.param("page")-1)*50 : 0;
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "pid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

  connection.query(sqlProducts.listProducts(page,50,sort,order), function(err, rows, fields) {
    if (err) throw err;

     res.send({tab:rows});
  });
});

app.get('/product/:id/reviews',function(req,res){
  var page = typeof req.query.page !== 'undefined' ?(req.query.page-1)*10 : 0;
  var sort = typeof req.query.sort !== 'undefined' ? req.query.sort : "rid";
  var order = typeof req.query.order !== 'undefined' ? req.query.order : "asc";

  connection.query(sqlReviews.listReviews(page,10,sort,order,"product",req.param("id")), function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});

   });

});



app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
