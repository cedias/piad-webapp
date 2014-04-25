$(function userScript(){

	var orderTab = ["ASC","DESC"];
	var page = 1;
	var sort = "rid";
	var order = 0;

	var rowTemplate =  Handlebars.compile($("#row-template").html());
	var USERID = $("#uid_save").html().trim();
	console.log(USERID);
	console.log("/user/"+USERID+"/reviews?sort="+sort+"&order="+orderTab[order]);

	//init
	$.ajax({url: "/user/"+USERID+"/reviews?sort="+sort+"&order="+orderTab[order]})
	  	.done(function dataloaded(data) 
	  	{
			$("#review_list").append(rowTemplate(data));
			visual();
			setSortArrow("sort_"+sort,orderTab[order]);

			if(data["tab"].length < 10)
					$("#show_more").hide();
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
		
			$.ajax({url: "/user/"+USERID+"/reviews?sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$(".clickable_row").remove();
				$("#review_list").append(rowTemplate(data));
				visual();
				setSortArrow(idSort,orderTab[order]);
				$("#show_more").show();

				if(data["tab"].length < 10)
					$("#show_more").hide();

	 		 });
		}
	);


	$("#show_more").click(
		function clickMore(){
			page++;
			
			$.ajax({url: "/user/"+USERID+"/reviews?page="+page+"&sort="+sort+"&order="+orderTab[order]})

		  	.done(function dataloaded(data) {
				$("#review_list").append(rowTemplate(data));

				if(data["tab"].length < 10)
					$("#show_more").hide();

				visual(); 	 
			});
		}
	);	


});
