
var config = {
    type: 'line',
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
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'blue',
            pointHoverBorderColor: 'blue',
            pointHoverBorderWidth:0,
            pointRadius: 0,
            pointHitRadius: 5

        },{
          label: 'global price',
          data: [],
          fill: 'red',
           lineTension: 0,
           borderColor:'red',
           backgroundColor : 'red' ,
           borderCapStyle: 'butt',
           pointHoverRadius: 8,
           pointHoverBackgroundColor: "red",
           pointHoverBorderColor: "red",
           pointHoverBorderWidth:0,
           pointRadius: 0,
           pointHitRadius: 5
        }]
    },
    options: {

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
              position : 'nearest',
              intersect	 : false,
              callbacks : { title: function (tooltipItem, data) { return tooltipItem.xLabel;}}


          }
    }
  }
function initialRender (data) {

var ctx = document.getElementById("myChart").getContext('2d');
config.data.labels = data.labels
config.data.datasets[0].data = data.bit2c
config.data.datasets[1].data = data.global
price_chart = new Chart(ctx,config);

}

function render (data) {

config.data.labels = data.labels
config.data.datasets[0].data = data.bit2c
config.data.datasets[1].data = data.global
price_chart.update();

}




// Hook into main event handler
let parentEventHandler = Chart.Controller.prototype.eventHandler;
Chart.Controller.prototype.eventHandler = function () {
    let ret = parentEventHandler.apply(this, arguments);

    let x = arguments[0].x;
    let y = arguments[0].y;
    this.clear();
    this.draw();
    let yScale = this.scales['y-axis-0'];
    this.chart.ctx.beginPath();
    this.chart.ctx.moveTo(x, yScale.getPixelForValue(yScale.max));
    this.chart.ctx.strokeStyle = "#ff0000";
    this.chart.ctx.lineTo(x, yScale.getPixelForValue(yScale.min));
    this.chart.ctx.stroke();

    return ret;
};
