/*  sqlReviews.js
------------ Summary --------------

listReviews(offset,limit,orderby,ordering,[type{"product","user"},id])
	[{rid, uid, pid, date, score, summary, help, nbhelp, hon}]

getReview(id)
	[{rid, uid, pid, date, help, nbhelp,score,uname,pname,summary, hon, text}]

listExactDuplicates(id,offset,limit,orderby,ordering)
	[{rid, uid, pid, date, score, summary, help, nbhelp, hon}]

listNearDuplicates(id,offset,limit,orderby,ordering)
	[{rid, uid, pid, date, score, summary, help, nbhelp, hon}]

nbReviews()
	[{nb_reviews}]

nbDuplicates(id,type["exact","near"])
	[{nb_exact_dupes || nb_near_dupes}]
-----------------------------------
*/

/*
* Returns a list of reviews.
* [{rid, uid, pid, date, score, summary, help, nbhelp, hon}]
* ordered by "orderby" in "ordering" order
*/
function listReviews(offset,limit,orderby,ordering,type,id){
	var sql =
	'SELECT r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, '
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, r.honesty_score as hon '
	+'FROM reviews r '
	+'WHERE 1';

	if(arguments.length === 6){
		if(type === "product")
			sql+=' AND r.product_id LIKE \''+id+'\'' ;
		if(type === "user")
			sql+=' AND r.user_id LIKE\''+id+'\'' ;
	}

	if(arguments.length >= 4){
		sql+=' ORDER BY '+orderby+' '+ordering+' ';
		sql+='LIMIT '+offset+','+limit+';';
	}

	return sql;
}


/**
* Returns a review's complete information
* [{rid, uid, pid, date, help, nbhelp,score,uname,pname,summary, hon,tru,rel text}]
*/
function getReview(id){
	return 'SELECT r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(r.time, "%d-%m-%Y") as date,r.helpfullness as help, r.nb_helpfullness as nbhelp, '
		+'r.score as score, u.username as uname, p.product_name as pname, r.summary as summary, '
		+'r.exact_dup_id as exactDupe, r.near_dup_id as nearDupe, '
		+'r.honesty_score as hon,u.trust_score as tru, p.reliability_score as rel, '
		+'r.text as text '
	+'FROM reviews r, products p, users u '
	+'WHERE r.review_id =\''+id+'\' '
	+'AND r.user_id = u.user_id '
	+'AND r.product_id = p.product_id;';
}

/*
* Returns a list of exact duplicate reviews.
* [{rid, uid, pid, date, score, summary, help, nbhelp, hon}]
* ordered by "orderby" in "ordering" order
*/
function listExactDuplicates(id,offset,limit,orderby,ordering){
	return '('
	+'SELECT '
	    +'r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, '
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, r.honesty_score as hon '
	+'FROM  reviews r '
	+'WHERE exact_dup_id = '+id 
	+') ;';
	
	//IF NEEDED
	/*+'UNION ( '
	+'SELECT '
		+'r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, '
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, ROUND((r.honesty_score+1)*50) as hon '
	+'FROM  reviews r '
	+'WHERE review_id = '+id
	+');';*/

}

/*
* Returns a list of near duplicates reviews.
* [{rid, uid, pid, date, score, summary, help, nbhelp, hon}]
* ordered by "orderby" in "ordering" order
*/
function listNearDuplicates(id,offset,limit,orderby,ordering){
	return '('
	+'SELECT '
	    +'r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, '
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, r.honesty_score as hon '
	+'FROM  reviews r '
	+'WHERE near_dup_id = '+id 
	+') ;';
	/*IF NEEDED
	+'UNION ( '
	+'SELECT '
		+'r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, '
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, ROUND((r.honesty_score+1)*50) as hon '
	+'FROM  reviews r '
	+'WHERE review_id = '+id
	+');';*/

}

/**
* Returns the number of reviews in DB
* [{nb_reviews}]
*/
function nbReviews(type,id){ 
	if(type === "product"){
		return 'SELECT count(review_id) as nb_reviews '
			+'FROM reviews '
			+'WHERE product_id ='+id+";"; 
	}
	if(type === "user"){
		return 'SELECT count(review_id) as nb_reviews '
			+'FROM reviews '
			+'WHERE user_id ='+id+";"; 
	}

	return 'SELECT count(review_id) as nb_reviews '
		+'FROM reviews;'; 
}

function nbDuplicates(id,type){
	var dupeType = typeof type !== 'undefined' ? type : "exact";

	if(dupeType === "exact"){
		return 'SELECT count(review_id) as nb_exact_dupes WHERE exact_dup_id = '+id +' ;'
	}
	if(dupeType === "near"){
		return 'SELECT count(review_id) as nb_near_dupes WHERE near_dup_id = '+id+';'
	}
}

//exports
exports.listReviews = listReviews;
exports.getReview = getReview;
exports.listExactDuplicates = listExactDuplicates;
exports.listNearDuplicates = listNearDuplicates;
exports.nbReviews = nbReviews;