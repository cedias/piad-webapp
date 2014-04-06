//users.js

$(function userListScript(){
	var orderTab = ["ASC","DESC"];
	var page = 1;
	var sort = "uid";
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
		
			$.ajax({url: "/users/"+page+"?sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$(".clickable_row").remove();
				$("#users_list").append(rowTemplate(data));
				visual();
				setSortArrow(idSort,orderTab[order]);

	 		 });
		}
	);


	$("#show_more").click(
		function clickMore(){
			page++;
			
			$.ajax({url: "/users/"+page+"?sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$("#users_list").append(rowTemplate(data));
				visual(); 	 
			});
		}
	);
});