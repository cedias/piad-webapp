$(function productScript(){

	var orderTab = ["ASC","DESC"];
	var page = 1;
	var sort = "rid";
	var order = 0;

	var rowTemplate =  Handlebars.compile($("#row-template").html());
	var PRODUCTID = $("#pid_save").html().trim();

	//init
	$.ajax({url: "/product/"+PRODUCTID+"/reviews?sort="+sort+"&order="+orderTab[order]})
	  	.done(function dataloaded(data) 
	  	{
			$("#product_list").append(rowTemplate(data));
			visual();
			setSortArrow("sort_"+sort,orderTab[order]);

			if(data["tab"].length < 10)
					$("#show_more").hide();
		}
	);

	  //init graphs
	 $.ajax({url: "/chart/product/"+PRODUCTID})
	  	.done(function dataGraphLoaded(data){
	  		console.log(data);
	  		pieGraph(data);
	  		stackGraph(data);
	  	});

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

				if(data["tab"].length < 10)
					$("#show_more").hide();
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


function pieGraph(data){
	var tab = data.tab;
	var cpt = [0,0,0];
	var current = 0;
	for(var i = 0;i<tab.length;i++){
		current = convertScoreValue(parseFloat(tab[i].hon));
		if(current < 25)
			cpt[2]++;
		else if(current > 75)
			cpt[0]++;
		else
			cpt[1]++;
	}
	$("#graph_loader").remove();
	scorepie("reviewpie",cpt[0],cpt[1],cpt[2],"Honest","Unknown","Dishonest");
}

function stackGraph(data){
	

	var dataHon = [];
	var dataUnk = [];
	var dataDis = [];
	var avgScore = [];
	var diff = [];

	var sumScore = 0;
	var sum = 0;

	var tab = data.tab;
	var cpt = [0,0,0];
	var current = 0;
	var currentDate;

	if(tab.length<2)
	{ //not enought reviews...
		$("#stackedTime_loader").remove();
		return;
	}

	for(var i = 0;i<tab.length;i++){
		sumScore += parseFloat(tab[i].score);
		sum++;

		current = convertScoreValue(parseFloat(tab[i].hon));
		if(current < 25)
			cpt[2]++;
		else if(current > 75)
			cpt[0]++;
		else
			cpt[1]++;
		if(i===0){
			currentDate = tab[i].date;
		}
		else{
			if(currentDate !== tab[i].date){
				var d = currentDate.split("-");
				var date = Date.UTC(d[2],d[1],d[0]);

				dataHon.push([date,cpt[0]]);
				dataUnk.push([date,cpt[1]]);
				dataDis.push([date,cpt[2]]);
				avgScore.push([date,sumScore/(cpt[0]+cpt[1]+cpt[2])]);

				if(sum > 10) //only interested if more than 10 review/day
					diff.push([date,sum]);
				sum = 0;
			}
			currentDate = tab[i].date;

		}
	}

	var serie =  [{
	    name: 'Honest Reviews',
	    type:'areaspline',
	    data: dataHon,
	    color:'#47a447',
	    yAxis:0
		}, {
	    name: 'Unknown Reviews',
	    type:'areaspline',
	    data: dataUnk,
	    color:'#ed9c28',
	    yAxis:0
		},
		{
	    name: 'Dishonest Reviews',
	    type:'areaspline',
	    data: dataDis,
	    color:'#d2322d',
	    yAxis:0
	},
	{
	    name: 'Average Score',
	    type:'spline',
	    yAxis:1,
	    data: avgScore,
	    color:'#0000ff',
	     tooltip: {
                valueSuffix: ' Stars'
            },
     }];
     if( diff.length > 0){   
	var diffObj = {
	    name: 'New Reviews',
	    type:'column',
	    yAxis:0,
	    data: diff,
	    color:'#0000ff',
	     tooltip: {
                valueSuffix: ' Reviews'
            }
        };

	   serie.push(diffObj);
	}
	

	console.log(serie);

	$("#stackedTime_loader").remove();
	stackedTime("stackgraph",serie);
}