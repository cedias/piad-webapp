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
var sqlUsers = require('./sql/sqlUsers');
var sqlReviews = require('./sql/sqlReviews');
var sqlProducts = require('./sql/sqlProducts');
var dbconfig = require('./config/database');

/**
* Config in /config/database.js
*/
var connection = mysql.createConnection({
  host     : dbconfig.dbhost,
  user     : dbconfig.user,
  password : dbconfig.pass,
  multipleStatements: true,
});

connection.query('USE '+dbconfig.database);

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);

app.use(express.static(path.join(__dirname, 'public')));

/*******************************- PAGE ROUTES -***************************************/

/*-----------INDEX -----------*/

app.get('/', function(req, res){ 
  var sqlString = sqlReviews.nbReviews()+sqlUsers.nbUsers()+sqlProducts.nbProducts();
 
	connection.query(sqlString, function(err, rows, fields) {
	  if (err) throw err;
	
  	   var hashresults =
  	   {
  	   	nb_reviews:rows[0][0]["nb_reviews"],
  	   	nb_users:rows[1][0]["nb_users"],
  	   	nb_products:rows[2][0]["nb_products"],
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

    if(rows.length === 0){
      res.render('error/error');
    }else{
      if(rows[0].nearDupe === null && rows[0].exactDupe === null)
        res.render('reviews/review',{reviewInfo:rows});
      else
        res.render('reviews/duplicateReview',{reviewInfo:rows});
    }
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

    if(rows.length === 0){
      res.render('error/error');
    }else{
    res.render('users/user',hashresults);
    }
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

    if(rows.length === 0){
      res.render('error/error');
    }else{
    res.render('products/product',{data:rows});
  }
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
/*load user reviews*/
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

//--------- CHARTS

/*user piechart*/
app.get('/chart/user/:id',function(req,res){
  connection.query(sqlReviews.listReviews(0,300,"rid","asc","user",req.param("id")), function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});
   });
});

/*product piechart*/
app.get('/chart/product/:id',function(req,res){
  connection.query(sqlReviews.listReviews(0,365,"time","asc","product",req.param("id")), function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});
   });
});


/*first page time*/
app.get('/chart/reviews/time',function(req,res){

  var query1 = 'SELECT DATE_FORMAT(r.time, "%Y-%m-%d") as time, COUNT( * ) as nbReviews '
  +'FROM reviews r '
  +'WHERE r.honesty_score < -0.25 '
  +'GROUP BY r.time ORDER BY  r.time DESC LIMIT 0 , 100;';

  var query2 = 'SELECT DATE_FORMAT(r.time, "%Y-%m-%d") as time, COUNT( * ) as nbReviews '
  +'FROM reviews r '
  +'WHERE r.honesty_score >= -0.25 AND  r.honesty_score < 0.25 '
  +'GROUP BY r.time ORDER BY  r.time DESC LIMIT 0 , 100;';

  var query3 = 'SELECT DATE_FORMAT(r.time, "%Y-%m-%d") as time, COUNT( * ) as nbReviews '
  +'FROM reviews r '
  +'WHERE r.honesty_score >= 0.25 '
  +'GROUP BY r.time ORDER BY  r.time DESC LIMIT 0 , 100;';
  
  connection.query(query1+query2+query3, function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});
   });
});

/*first page repartition*/
app.get('/chart/reviews/percentage',function(req,res){

  var query1 = 'SELECT COUNT( * ) as nbReviews '
  +'FROM reviews r '
  +'WHERE r.honesty_score < -0.25;'

  var query2 = 'SELECT COUNT( * ) as nbReviews '
  +'FROM reviews r '
  +'WHERE r.honesty_score >= -0.25 AND  r.honesty_score < 0.25 ;'

  var query3 = 'SELECT COUNT( * ) as nbReviews '
  +'FROM reviews r '
  +'WHERE r.honesty_score >= 0.25 ;'
  
  connection.query(query1+query2+query3, function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});
   });
});

/*first page repartition*/
app.get('/chart/users/percentage',function(req,res){

  var query1 = 'SELECT COUNT( * ) as nbUsers '
  +'FROM users u '
  +'WHERE u.trust_score < -0.25;'

  var query2 = 'SELECT COUNT( * ) as nbUsers '
  +'FROM users u '
  +'WHERE u.trust_score >= -0.25 AND  u.trust_score < 0.25 ;'

  var query3 = 'SELECT COUNT( * ) as nbUsers '
  +'FROM users u '
  +'WHERE u.trust_score >= 0.25 ;'
  
  connection.query(query1+query2+query3, function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});
   });
});

/*first page repartition*/
app.get('/chart/products/percentage',function(req,res){

  var query1 = 'SELECT COUNT( * ) as nbProducts '
  +'FROM products p '
  +'WHERE p.reliability_score < -0.25;'

  var query2 = 'SELECT COUNT( * ) as nbProducts '
  +'FROM products p '
  +'WHERE p.reliability_score >= -0.25 AND  p.reliability_score < 0.25 ;'

  var query3 = 'SELECT COUNT( * ) as nbProducts '
  +'FROM products p '
  +'WHERE p.reliability_score >= 0.25 ;'
  
  connection.query(query1+query2+query3, function(err, rows, fields) {
    if (err) throw err;
      res.send({tab:rows});
   });
});




app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
