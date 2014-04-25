/*  sqlProducts.js
------------ Summary --------------

listProducts(offset,limit,orderby,ordering)
	[{pid, name ,rel}]

getProduct(id)
	[{pid, name,burst ,rel}]

nbProducts()
	[{nb_products}]
-----------------------------------
*/

function listProducts(offset,limit,orderby,ordering){
	return 'SELECT p.product_id as pid, p.product_name as pname, p.reliability_score as rel '
 	+'FROM products p '
 	+'ORDER BY '+orderby+' '+ordering
  	+' LIMIT '+offset+' , '+limit+';';
}

function getProduct(id){
	return 'SELECT p.product_id as pid, p.product_name as pname,p.nb_bursts as burst, p.reliability_score as rel '
 	+'FROM products p '
 	+'WHERE p.product_id LIKE\''+id+'\';';
}

function nbProducts(){
	return 'SELECT count(*) as nb_products '
	+'FROM products;';
}

exports.nbProducts = nbProducts;
exports.getProduct = getProduct;
exports.listProducts = listProducts;