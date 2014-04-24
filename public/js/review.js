$( function reviewPageScript(){

	var REVIEWID = $("#rid_save").html();
	var orderTab = ["ASC","DESC"];
	var pageExact = 1;
	var sortExact = "rid";
	var orderExact = 0;

	var pageNear = 1;
	var sortNear = "rid";
	var orderNear = 0;

	var rowTemplate =  Handlebars.compile($("#row-template").html());
	//stars
	scoreToStars();

	//score
	bigScoreColor();
	//init
	$.ajax({url: "/review/"+REVIEWID+"/exactdupes?sort="+sortExact+"&order="+orderTab[orderExact]})
		  	.done(function dataloaded(data) {
		  		if(data["tab"].length > 0)
					$("#reviews_exact_list").append(rowTemplate(data));
				else
					$('#exact_dupes_table').remove();



		$.ajax({url: "/review/"+REVIEWID+"/neardupes?sort="+sortNear+"&order="+orderTab[orderNear]})

		  	.done(function dataloaded(data) {
		  		if(data["tab"].length > 0)
					$("#reviews_near_list").append(rowTemplate(data));
				else
					$('#near_dupes_table').remove()
				visual();
		});
	});

	

	function scoreToStars(){
		var star =" <span class=\"glyphicon glyphicon-star\"></span>";
		var starEmpty =" <span class=\"glyphicon glyphicon-star-empty\"></span>";
		var score = $("#review_score").html();

		$("#review_score").html("");

		for(var i = 0;i<score;i++)
			$("#review_score").append(star);

		for(var i = 0;i<5-score;i++)
			$("#review_score").append(starEmpty);

	}

});