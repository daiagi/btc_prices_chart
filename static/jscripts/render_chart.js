


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

    // return cursor to default



    var parseDate = function(date) {
        date = date[0];
        // output format : dd.mm.yy , HH:MM local time
        if (typeof date === "string") {
            date = new Date(date)
        }
        var dayOfWeekAsString=function(dayIndex) {
            return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayIndex];
        };

        const year = date.getFullYear().toString().slice(2);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const shortDay = dayOfWeekAsString(date.getDay());
        const hour = (date.getHours()<10?'0':'') + date.getHours() ;
        const minutes = (date.getMinutes()<10?'0':'') + date.getMinutes() ;

        const dateString = day+"/"+month+"/"+year;
        const timeString = hour+":"+minutes;



        return [shortDay+", "+dateString+", "+timeString];

    };
  // Tooltip Element
  var tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.style = 'text-align: center';
    tooltipEl.innerHTML = "<table></table>";
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

  function getNumericPrices(bodyLine) {
      return parseFloat(bodyLine[0].split(": ")[1]);
  }
  function getRatioLine(prices) {
      var ratio = prices.length > 1 ? (((prices[0] / prices[1])-1)*100).toFixed(2) : '';
      const color = ratio > 0 ? 'green' : 'red';
      const sign = ratio > 0 ? '+' : '';
      if (ratio !== '') {ratio += "\%";}
      const style = 'color:' + color + '; font-size: medium; font-weight: bold;';

      return '<span style = "' +style+ '">' + sign + ratio +'</span>';
  }

  // Set Text
  if (tooltip.body) {
    var titleLines = parseDate(tooltip.title) || [];
    var bodyLines = tooltip.body.map(getBody);
    var prices = bodyLines.map(getNumericPrices);
    bodyLines.map(function(line) {
        const price= line[0].split(': ')[1];
        const origin = line[0].split(' ')[0];
        return origin +': '+price;

    });


    var innerHtml = '<thead >';

    titleLines.forEach(function(title) {
      innerHtml += '<tr><th class="text-center" style="font-weight: bold">' + title + '</th></tr>';
    });
    innerHtml += '</thead><tbody>';

    bodyLines.forEach(function(body, i) {
      var colors = tooltip.labelColors[i];
      var style = 'background:' + colors.backgroundColor;
      style += '; border-color:' + colors.borderColor;
      style += '; border-width: 2px';
      style += '; margin: auto' ;
      var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
      innerHtml += '<tr><td class="text-left">' + span +'&nbsp;&nbsp;'+ body + '</td></tr>';
    });
      innerHtml += '<tr><td>' + getRatioLine(prices) + '</td></tr>';
    innerHtml += '</tbody>';

    var tableRoot = tooltipEl.querySelector('table');
    tableRoot.innerHTML = innerHtml;
  }

  var position = this._chart.canvas.getBoundingClientRect();

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = position.left + tooltip.caretX-85 + 'px';
  tooltipEl.style.top = position.top + tooltip.caretY-110 + 'px';
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
            intersect : false,
            onHover: function(e) {
                  $("#priceChart").css("cursor", "auto");
              }
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
            onHover : function(event, legendItem) {
                document.getElementById("priceChart").style.cursor = 'pointer';
            }

        },

        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:false,
                    fontSize: 16
                  }
              }],
            xAxes: [{
                type : 'time',
                ticks: {fontSize: 16},
                gridLines : {
                    offsetGridLines: false

                }

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

