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