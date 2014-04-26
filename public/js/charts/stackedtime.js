


function stackedTime(id_container,data) {

        $('#'+id_container).highcharts({
            title: {
                text: 'Reviews Honesty over time'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
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