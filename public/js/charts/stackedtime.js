


function stackedTime(id_container,data) {

        $('#'+id_container).highcharts({
            title: {
                text: 'Reviews Honesty over time'
            },
            
            xAxis: {
                type: 'datetime',

                title: {
                    text: 'Date'
                }
            },
            yAxis:[{
                title: {
                    text: 'Number of reviews'
                },
                
                 labels: {
                    format: '{value} Reviews'
                }
            },
            {
                title: {
                    text: 'Average score of product'
                },
                 labels: {
                    format: '{value} Stars'
                },
                min:0,
                max:5,
                opposite: true
            }],
            tooltip: {
                shared: true,
                valueSuffix: ' Reviews'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: data
        });
}