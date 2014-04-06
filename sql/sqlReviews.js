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
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, ROUND((r.honesty_score + 1)*50) as hon '
	+'FROM reviews r '
	+'WHERE 1 ';

	if(arguments.length === 6){
		if(type === "product")
			sql+=' AND pid='+id ;
		if(type === "user")
			sql+=' AND uid='+id ;
	}

	if(arguments.length >= 4){
		sql+=' ORDER BY '+orderby+' '+ordering+' ';
		sql+='LIMIT '+offset+','+limit+';';
	}

	return sql;
}


/**
* Returns a review's complete information
* [{rid, uid, pid, date, help, nbhelp,score,uname,pname,summary, hon, text}]
*/
function getReview(id){
	return 'SELECT r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(r.time, "%d-%m-%Y") as date,r.helpfullness as help, r.nb_helpfullness as nbhelp, '
		+'r.score as score, u.username as uname, p.product_name as pname, r.summary as summary, '
		+'ROUND((r.honesty_score+1)*50) as hon, r.text as text '
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
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, ROUND((r.honesty_score+1)*50) as hon '
	+'FROM  reviews r '
	+'WHERE exact_dup_id = '+id 
	+') '
	+'UNION ( '
	+'SELECT '
		+'r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, '
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, ROUND((r.honesty_score+1)*50) as hon '
	+'FROM  reviews r '
	+'WHERE review_id = '+id
	+');';

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
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, ROUND((r.honesty_score+1)*50) as hon '
	+'FROM  reviews r '
	+'WHERE near_dup_id = '+id 
	+') '
	+'UNION ( '
	+'SELECT '
		+'r.review_id as rid, r.user_id as uid, r.product_id as pid, '
		+'DATE_FORMAT(time, "%d-%m-%Y") as date, r.score as score, r.summary as summary, '
		+'r.helpfullness as help, r.nb_helpfullness as nbhelp, ROUND((r.honesty_score+1)*50) as hon '
	+'FROM  reviews r '
	+'WHERE review_id = '+id
	+');';

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

//exports
exports.listReviews = listReviews;
exports.getReview = getReview;
exports.listExactDuplicates = listExactDuplicates;
exports.listNearDuplicates = listNearDuplicates;
exports.nbReviews = nbReviews;