$(function() {
			//on document ready


			$(".score_field").map(function colorizer() {
				var elt = $(this);
				if(elt.html() > 0.5)
					elt.parent().addClass("success");
				if(elt.html() <=0.5 && elt.html()>-0.5)
					elt.parent().addClass("warning");
				if(elt.html()<-0.5)
					elt.parent().addClass("danger");
			});

			$(".clickable_row").click(function goToLastClass () {
				  window.document.location = $(this).attr("data-url");
			})



});
