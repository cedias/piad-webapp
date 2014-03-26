$(function() {
			//on document ready


			$(".score_field").map(function colorizer() {
				var elt = $(this);
				if(elt.html() > 0.5)
					elt.addClass("success");
				if(elt.html() <=0.5 && elt.html()>-0.5)
					elt.addClass("warning");
				if(elt.html()<-0.5)
					elt.addClass("danger");
			});



});
