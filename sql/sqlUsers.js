/*  sqlUsers.js
------------ Summary --------------

listUsers(offset,limit,orderby,ordering)
	[{uid, uname,tru}]

getUser(id)
	[{uid, uname,tru}]

nbUsers()
	[{nb_users}]
-----------------------------------
*/

function listUsers(offset,limit,orderby,ordering){
	return 'SELECT u.user_id as uid, u.username as uname, u.trust_score as tru '
 	+'FROM users u '
 	+'ORDER BY '+orderby+' '+ordering
  	+' LIMIT '+offset+' , '+limit+';';
}

function getUser(id){
	return 'SELECT u.user_id as uid, u.username as uname, u.trust_score as tru '
 	+'FROM users u '
 	+'WHERE u.user_id LIKE \''+id+'\';';
}

 /*nb users*/
function nbUsers(){
	return 'SELECT count(*) as nb_users '
	+'FROM users;';
}

//exports
exports.listUsers = listUsers;
exports.getUser = getUser;
exports.nbUsers = nbUsers;