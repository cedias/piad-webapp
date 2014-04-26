$(function indexScript(){

		//load graph
		$.ajax({url: "/chart/reviews/time"})
	  		.done(function datahistGraphLoaded(data){
	  			var tabDishonest = data.tab[0];
	  			var tabUndecided = data.tab[1];
	  			var tabHonest = data.tab[2];

	  			var dataChartDis = [];
	  			var dataChartUnd = [];
	  			var dataChartHon = [];

	  			for(var i = tabDishonest.length-1;i>=0;i--)
	  			{
	  				var a = tabDishonest[i]["time"].split("-");
	  				var b = tabUndecided[i]["time"].split("-");
	  				var c = tabHonest[i]["time"].split("-");
	  				dataChartDis.push([Date.UTC(a[0],a[1],a[2]),tabDishonest[i]["nbReviews"]]);
	  				dataChartUnd.push([Date.UTC(b[0],b[1],b[2]),tabUndecided[i]["nbReviews"]]);
	  				dataChartHon.push([Date.UTC(c[0],c[1],c[2]),tabHonest[i]["nbReviews"]]);
	  			}

	  			$("#graph_loader").remove();

	  			var data = createDataSeries(dataChartHon,dataChartUnd,dataChartDis);
	  			histline("daily_review_chart",data);
	  			
	  		});

	  	$.ajax({url: "/chart/reviews/percentage"})
	  		.done(function datahistGraphLoaded(data){
	  	
	  			var hon = parseInt(data.tab[2][0].nbReviews);
	  			var und = parseInt(data.tab[1][0].nbReviews);
	  			var dis = parseInt(data.tab[0][0].nbReviews);
	  			
	  			
	  			$("#reviews_pie_loader").remove();

	  			scorepie("reviewpie",hon,und,dis,"Honest","Unknown","Dishonest");
	  		});

	  	$.ajax({url: "/chart/users/percentage"})
	  		.done(function datahistGraphLoaded(data){
	  	
	  			var hon = parseInt(data.tab[2][0].nbUsers);
	  			var und = parseInt(data.tab[1][0].nbUsers);
	  			var dis = parseInt(data.tab[0][0].nbUsers);
	  			
	  			
	  			$("#users_pie_loader").remove();

	  			scorepie("userpie",hon,und,dis,"Trustfull","Unknown","Untrustfull");
	  		});


	  	$.ajax({url: "/chart/products/percentage"})
	  		.done(function datahistGraphLoaded(data){
	  	
	  			var hon = parseInt(data.tab[2][0].nbProducts);
	  			var und = parseInt(data.tab[1][0].nbProducts);
	  			var dis = parseInt(data.tab[0][0].nbProducts);
	  			
	  			
	  			$("#products_pie_loader").remove();

	  			scorepie("productpie",hon,und,dis,"Reliable","Unknown","Unreliable");
	  		});





	  	});
