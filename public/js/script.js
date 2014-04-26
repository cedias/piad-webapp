function visual() {
			//on document ready

			$(".score_field").map(function scoreField() {
				var elt = $(this);

				var value = convertScoreValue(parseFloat(elt.html()));
				elt.html(value);

				if(value > 75)
					elt.parent().addClass("success");
				if(value <=75 && value>25)
					elt.parent().addClass("warning");
				if(value<=25)
					elt.parent().addClass("danger");
				elt.removeClass("score_field");
			});

			$(".clickable_row").click(function goToLastClass () {
				  window.document.location = $(this).attr("data-url");
			});

			$(".truncatable").map(function truncate(){
				var elt = $(this)
				var max = 40;
				
				if(elt.html().length > max)
					elt.html(elt.html().substr(0,max)+" [...]");
			});

//ROUND((r.honesty_score + 1)*50) to change scores


}

function setSortArrow(id,order){
	$("#sort_arrow").remove();
	if(order === "ASC" || order ==="asc")
		$("#"+id).prepend("<span id=\"sort_arrow\" class=\"glyphicon glyphicon-chevron-up\"></span>");

	if(order === "DESC" || order ==="desc")
		$("#"+id).prepend("<span id=\"sort_arrow\" class=\"glyphicon glyphicon-chevron-down\"></span>");
}

function bigScoreColor(){
		var bs = $(".big_score");
		var value = convertScoreValue(parseFloat(bs.html()));
		bs.html(value);

		if(value > 25 && value <= 75)
			bs.addClass("alert-warning");
		if(value<=25)
			bs.addClass("alert-danger");
		if (value>75)
			bs.addClass("alert-success");
	}

function convertScoreValue(score)
{
	return Math.round((score+1)*50);
}

$(function(){
	$("#search_form").submit(function submitSearch(){
		var val = $("#search_input").val();
		var opt = $("#search_options").val();
		window.document.location = "/"+opt+"/"+val;
		return false; //no sub
	});
});
