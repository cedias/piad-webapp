
function createDataSeries(dataHon,dataUnd,dataDis){

	var data = [{
        name: 'Honest Reviews',
        data: dataHon,
        color: '#47a447'               
    },
    {
    	name: 'Undecided Reviews',
    	data: dataUnd,
    	color: '#ed9c28'
    },
    {
    	name: 'Dishonest Reviews',
    	data: dataDis,
    	color: '#d2322d'
	}];
	return data;
}


function histline(id_container,dataSeries){

	$('#'+id_container).highcharts({
	    chart: {
	        type: 'spline'
	    },
	    title: {
	        text: null
	    },
	    credits:{
	    	enabled:false
	    },
	    xAxis: {
	        type: 'datetime',

	        title: {
	            text: 'Date'
	        }
	    },
	    yAxis: {
	        title: {
	            text: 'Number of daily reviews'
	        },
	        min: 0
	    },
	    tooltip: {
	        headerFormat: '<b>{series.name}</b><br>',
	        pointFormat: '{point.x:%e. %b %Y}: {point.y:.2f} reviews'
	    },

	    series: dataSeries
	});
}