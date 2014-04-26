//scorepie.js
/*
	Build a pie chart out of scores hon/un/dis
*/

function dataObj(name,value,color){
	return  { name:name, y:value, color:color};
}
function scorepie(id_container,pc_hon,pc_und,pc_dis,name1,name2,name3) { 

	var pieData =  [];
	if(pc_hon !== 0)
		pieData.push(dataObj(name1,pc_hon,'#47a447'));
	if(pc_und !== 0)
		pieData.push(dataObj(name2,pc_und,'#ed9c28'));
	if(pc_dis !== 0)
		pieData.push(dataObj(name3,pc_dis,'#d2322d'));
       


    $('#'+id_container).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            spacing:[0,0,0,0],
            margin: [0, 0, 0, 0],
        },
        credits:{
        	enabled:false
        },
        title: {
            text: null,
        },
        tooltip: {
            pointFormat: 'Count: <b>{point.y:.f}</b><br/>(<b>{point.percentage:.1f}%)</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    },
                },
            }
        },
        series: [{
            type: 'pie',
            name: 'serie',
            innerSize: '0%',
            data: pieData,
        }]
    });
}