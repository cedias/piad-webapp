$(function userScript(){

	var orderTab = ["ASC","DESC"];
	var page = 1;
	var sort = "rid";
	var order = 0;

	var rowTemplate =  Handlebars.compile($("#row-template").html());
	var USERID = $("#uid_save").html().trim();
	console.log(USERID);
	console.log("/user/"+USERID+"/reviews?sort="+sort+"&order="+orderTab[order]);

	//init tab
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

	 //init graph
	 $.ajax({url: "/chart/user/"+USERID})
	  	.done(function dataGraphLoaded(data){
	  		$("#graph_loader").remove();

	  		var tab= data.tab;
	  		var cpt = [0,0,0];
	  		var current = 0;
	  		for(var i = 0;i<tab.length;i++){
	  			current = convertScoreValue(parseFloat(tab[i].hon));
	  			console.log(tab[i]);
	  			if(current < 25)
	  				cpt[2]++;
	  			else if(current > 75)
	  				cpt[0]++;
	  			else
	  				cpt[1]++;
	  		}
	  		
	  		scorepie("userpie",cpt[0],cpt[1],cpt[2],"trustable","unknown","untrustable");

	  		
	  	});


	 /*Binds*/
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
