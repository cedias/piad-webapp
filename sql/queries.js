/*reviews-honesty*/
exports.indexTab1 = 
 'SELECT r.review_id as rid, r.honesty_score as hon '
 +'FROM reviews r '
 +'ORDER BY honesty_score asc LIMIT 0,10;';

/*user-Trustiness*/
 exports.indexTab2 = 
 'SELECT u.user_id as uid, u.trust_score as tru '
 +'FROM users u '
 +'ORDER BY trust_score asc LIMIT 0,10;';

/*Product - Reliability*/
 exports.indexTab3 = 
 'SELECT p.product_id as pid, p.reliability_score as rel '
 +'FROM products p '
 +'ORDER BY reliability_score asc LIMIT 0,10;';

 /*nb reviews*/
 exports.nbReviews = 
 'SELECT count(*) as nb_reviews '
 +'FROM reviews;' ;

 /*nb products*/
 exports.nbProducts = 
  'SELECT count(*) as nb_products '
 +'FROM products;';

 /*nb users*/
 exports.nbUsers = 
  'SELECT count(*) as nb_users '
 +'FROM users;';

  /*reviews listing*/
 exports.reviews = 
  'SELECT r.review_id as rid, r.user_id as uid, r.product_id as pid, DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, r.helpfullness as help, r.nb_helpfullness as nbhelp, r.honesty_score as hon '
 +'FROM reviews r '
 +'ORDER BY rid ASC '
 +'LIMIT 0,30;';

  /*products listing*/
 exports.products = 
  'SELECT p.product_id as pid, p.product_name as pname, p.reliability_score as rel '
 +'FROM products p '
 +'ORDER by pid ASC '
 +'LIMIT 0,30;';

 /* users listing*/
  exports.users = 
   'SELECT u.user_id as uid, u.username as uname, u.trust_score as tru '
  +'FROM users u '
  +'LIMIT 0,30;';

/*user info*/
    exports.userInfo = function(uid){
        return query =
       'SELECT u.user_id as uid, u.username as uname, u.trust_score as tru '
      +'FROM users u '
      +'WHERE u.user_id =\''+uid+'\' ;'
    };
  exports.userReviews = function(uid){
  return query =
       'SELECT r.honesty_score as hon, r.score as score, r.review_id as rid,DATE_FORMAT(r.time, "%d-%m-%Y") as date, r.summary as summary,r.helpfullness as help, r.nb_helpfullness as nbhelp, p.product_id as pid, p.reliability_score as rel '
      +'FROM reviews r, products p '
      +'WHERE r.user_id LIKE\''+uid+'\' '
      +'AND r.product_id = p.product_id '
      +'ORDER BY r.honesty_score ASC;'
    };