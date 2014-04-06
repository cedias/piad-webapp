function visual() {
			//on document ready

			$(".score_field").map(function colorizer() {
				var elt = $(this);
				if(elt.html() > 75)
					elt.parent().addClass("success");
				if(elt.html() <=75 && elt.html()>25)
					elt.parent().addClass("warning");
				if(elt.html()<=25)
					elt.parent().addClass("danger");
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



}

function setSortArrow(id,order){
	$("#sort_arrow").remove();
	if(order === "ASC" || order ==="asc")
		$("#"+id).prepend("<span id=\"sort_arrow\" class=\"glyphicon glyphicon-chevron-up\"></span>");

	if(order === "DESC" || order ==="desc")
		$("#"+id).prepend("<span id=\"sort_arrow\" class=\"glyphicon glyphicon-chevron-down\"></span>");
}