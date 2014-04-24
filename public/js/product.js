$(function productScript(){

	var orderTab = ["ASC","DESC"];
	var page = 1;
	var sort = "rid";
	var order = 0;

	var rowTemplate =  Handlebars.compile($("#row-template").html());
	var PRODUCTID = $("#pid_save").html().trim();
	console.log(PRODUCTID);
	console.log("/product/"+PRODUCTID+"/reviews?sort="+sort+"&order="+orderTab[order]);

	//init
	$.ajax({url: "/product/"+PRODUCTID+"/reviews?sort="+sort+"&order="+orderTab[order]})
	  	.done(function dataloaded(data) 
	  	{
			$("#product_list").append(rowTemplate(data));
			visual();
			setSortArrow("sort_"+sort,orderTab[order]);
		}
	);


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
		
			$.ajax({url: "/product/"+PRODUCTID+"/reviews?sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$(".clickable_row").remove();
				$("#product_list").append(rowTemplate(data));
				visual();
				setSortArrow(idSort,orderTab[order]);
				$("#show_more").show();

	 		 });
		}
	);


	$("#show_more").click(
		function clickMore(){
			page++;
			
			$.ajax({url: "/product/"+PRODUCTID+"/reviews?page="+page+"&sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$("#product_list").append(rowTemplate(data));

				if(data["tab"].length < 10)
					$("#show_more").hide();

				visual(); 	 
			});
		}
	);	


});
