//products.js

$(function productListScript(){
	var orderTab = ["ASC","DESC"];
	var page = 1;
	var sort = "pid";
	var order = 0;
	var rowTemplate =  Handlebars.compile($("#row-template").html());

	//init
	visual();
	setSortArrow("sort_"+sort,orderTab[order]);

	//binds
	$(".sortable").click(
		function clickSortable(){
			page = 1;
			var idSort = $(this).attr("id");
			var sorter = idSort.split("_")[1];

			if(sorter===sort){
				order = (order+1)%2;
			}
			else
			{
				sort = sorter;
				order = 0;
			}
		
			$.ajax({url: "/products/"+page+"?sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$(".clickable_row").remove();
				$("#products_list").append(rowTemplate(data));
				visual();
				setSortArrow(idSort,orderTab[order]);

	 		 });
		}
	);


	$("#show_more").click(
		function clickMore(){
			page++;
			
			$.ajax({url: "/products/"+page+"?sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$("#products_list").append(rowTemplate(data));
				visual(); 	 
			});
		}
	);
});