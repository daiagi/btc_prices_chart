


Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
   draw: function(ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
         var activePoint = this.chart.tooltip._active[0],
             ctx = this.chart.ctx,
             x = activePoint.tooltipPosition().x,
             topY = this.chart.scales['y-axis-0'].top,
             bottomY = this.chart.scales['y-axis-0'].bottom;

         // draw line
         ctx.save();
         ctx.beginPath();
         ctx.moveTo(x, topY);
         ctx.lineTo(x, bottomY);
         ctx.lineWidth = 1;
         ctx.strokeStyle = '#000000';
         ctx.stroke();
         ctx.restore();
      }
   }
});

var config = {
    type: 'LineWithLine',
    data: {
        labels: [],
        datasets: [{
            label: 'bit2c price',
            data: [],
            fill : false,
            lineTension: 0,
            borderColor:'blue',
            backgroundColor : 'blue' ,
            borderCapStyle: 'butt',
            pointHoverRadius: 5,
            pointHoverBorderWidth:0,
            pointRadius: 0,
            pointHitRadius: 5

        },{
          label: 'global price',
          data: [],
          fill: false,
           lineTension: 0,
           borderColor:'red',
           backgroundColor : 'red' ,
           borderCapStyle: 'butt',
           pointHoverRadius: 5,
           pointHoverBorderWidth:0,
           pointRadius: 0,
           pointHitRadius: 5
        }]
    },
    options: {

      hover : {
            intersect : false
      },

        layout: {
          padding: {left: 50,right: 50,top: 12,bottom: 120}
        },

        legend: {
            labels: {
                usePointStyle: true,
                fontSize : 16,

            },
            position : 'right',

          },

        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:false
                  }
              }],
            xAxes: [{
                type : 'time'
              }]
          },

          tooltips : {
              enabled: false,
              mode : 'index',
              position : 'nearest',
              intersect	 : false,
              custom: customTooltips,

          }
    }
  } ,


initialRender = function (data) {

    var ctx = document.getElementById("myChart").getContext('2d'),
        chartData = config.data,
        yaxisTicks = config.options.scales.yAxes[0].ticks;

    chartData.labels = data.labels;
    chartData.datasets[0].data = data.bit2c ;
    chartData.datasets[1].data = data.global ;

     yaxisTicks.suggestedMin = Math.min.apply(null,data.bit2c.concat(data.global)) - 100 ;
     yaxisTicks.suggestedMax = Math.max.apply(null,data.bit2c.concat(data.global)) + 100 ;
     price_chart = new Chart(ctx,config);

} ,

render = function (data) {
    var chartData = config.data,
        yaxisTicks = config.options.scales.yAxes[0].ticks;

    chartData.labels = data.labels;
    chartData.datasets[0].data = data.bit2c ;
    chartData.datasets[1].data = data.global ;

    yaxisTicks.suggestedMin = Math.min.apply(null,data.bit2c.concat(data.global)) - 100 ;
    yaxisTicks.suggestedMax = Math.max.apply(null,data.bit2c.concat(data.global)) + 100 ;

    price_chart.update();

};
