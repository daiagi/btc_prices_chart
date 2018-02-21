
function render (data,toUSD) {

var labels = data.map(function (e) {return e.time});
if (toUSD) {
  bit2c_id = "bit2c_price_usd";
  global_id = "global_price_usd";
} else {
  bit2c_id = "bit2c_price_ils";
  global_id = "global_price_ils";
}

var bit2c_data = data.map(function(e) {return e[bit2c_id];});
var global_data = data.map(function(e) {return e[global_id];});
// console.log(bit2c_data)

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'bit2c price',
            data: bit2c_data,
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
          data: global_data,
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
});




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
