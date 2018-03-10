


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
var customTooltips = function(tooltip) {
  // Tooltip Element
  var tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.style = 'text-align: center'
    tooltipEl.innerHTML = "<table></table>"
    // document.getElementById("myChart").appendChild(tooltipEl);
    document.body.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  // Set Text
  if (tooltip.body) {
    var titleLines = tooltip.title || [];
    var bodyLines = tooltip.body.map(getBody);

    var innerHtml = '<thead>';

    titleLines.forEach(function(title) {
      innerHtml += '<tr><th>' + title + '</th></tr>';
    });
    innerHtml += '</thead><tbody>';

    bodyLines.forEach(function(body, i) {
      var colors = tooltip.labelColors[i];
      var style = 'background:' + colors.backgroundColor;
      style += '; border-color:' + colors.borderColor;
      style += '; border-width: 2px';
      style += '; margin: auto' ;
      var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
      innerHtml += '<tr><td>' + span + body + '</td></tr>';
    });
    innerHtml += '</tbody>';

    var tableRoot = tooltipEl.querySelector('table');
    tableRoot.innerHTML = innerHtml;
  }

  var position = this._chart.canvas.getBoundingClientRect();

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = position.left + tooltip.caretX-150 + 'px';
  tooltipEl.style.top = position.top + tooltip.caretY-80 + 'px';
  tooltipEl.style.fontFamily = tooltip._fontFamily;
  tooltipEl.style.fontSize = tooltip.fontSize;
  tooltipEl.style.fontStyle = tooltip._fontStyle;
  tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
};

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
            borderWidth : 1.2,
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
           borderWidth : 1.2,
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
    var ctx = document.getElementById("priceChart").getContext('2d'),
        chartData = config.data,
        yaxisTicks = config.options.scales.yAxes[0].ticks;
        // ctx.canvas.width  = window.innerWidth;

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
