
var outerWidth = 1200;
var outerHeight = 500;
var margin = {left: 120, top: 60, right: 120, bottom: 60}

var innnerWidth = outerWidth -margin.left - margin.right;
var innerHeight = outerHeight - margin.top - margin.bottom;

var xColumn  = "time"
var xLabel = "time"
var yLabel = "price"

const yTicks = 5;
const xTicks = 5;
var locale = d3.timeFormatLocale({
  "dateTime": "%a %b %e %X %Y",
  "date": "%d.%m.%y",
  "time": "%H:%M:%S",
  "periods": [],
  "days": ["Sunday", "Monday", "Tuesday", "Wednsday", "Thursday", "Friady", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
  "months": ["January", "Feruary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

  var formatMinute = locale.format("%H:%M"),
      formatHour = locale.format("%H:%M"),
      formatDay = locale.format("%a %d"),
      formatWeek = locale.format("%b %d"),
      formatMonth = locale.format("%B"),
      formatYear = locale.format("%y");

  function multiFormat(date) {

    return (d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
  };



//The outer SVG Container
var svg = d3.select(".graph-div").append("svg")
                                    .attr("width", outerWidth)
                                    .attr("height", outerHeight);

 var g = svg.append('g')
         .attr("transform", "translate(" + margin.left+" , "+ margin.top +")");


         const xAxisG = g.append('g')
             .attr('transform', `translate(0, ${innerHeight})`)
             .attr('id','x-axis');
         const yAxisG = g.append('g').attr('id','y-axis');

function set_up_graph(data,toUSD) {
  if (toUSD === true) {
     yColumn = "global_price_usd"
     yColumn2 = "bit2c_price_usd"
  } else {
    yColumn = "global_price_ils"
    yColumn2 = "bit2c_price_ils"
  }

  var xScale = d3.scaleTime()
        .range([0, innnerWidth])
        .domain(d3.extent(data, function(d) {return d[xColumn]; }))

        .nice(xTicks);
  var yScale = d3.scaleLinear()
        .range([innerHeight,0])
        .domain(d3.extent([].concat(data.map(function(item) {return item[yColumn];}),
                                    data.map(function(item) {return item[yColumn2];}))))
        .nice(yTicks);


  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(multiFormat);

    // .tickSize(-innerHeight);


  const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(yTicks)
    .tickPadding(15)
    .tickSize(-innerWidth);

  xAxisG.call(xAxis);
  yAxisG.call(yAxis);

  var line_global = d3.line()
                             .x(function(d) { return xScale(d[xColumn]); })
                             .y(function(d) { return yScale(d[yColumn]); })
                             .curve(d3.curveBasis);


   var line_bit2c = d3.line()
                              .x(function(d) { return xScale(d[xColumn]); })
                              .y(function(d) { return yScale(d[yColumn2]); })
                              .curve(d3.curveBasis);

  var output = {line_bit2c : line_bit2c,
                line_global : line_global,
                xAxis : xAxis,
                yAxis : yAxis};

  return output

};



function onLoad(data,toUSD){

    graph_elements = set_up_graph(data,toUSD)

    g.append("path")
            .attr("d", graph_elements.line_global(data))
            .attr("id", "global_price")

    g.append("path")
            .attr("d", graph_elements.line_bit2c(data))
            .attr("id", "bit2c_price")



};



function updateData(data, toUSD) {
  graph_elements = set_up_graph(data,toUSD)

    	// Scale the range of the data again

    // Select the section we want to apply our changes to
    var svg = d3.select(".graph-div").transition();

    // Make the changes
        svg.select("#global_price")   // change the line
            .duration(750)
            .attr("d",  graph_elements.line_global(data));

    svg.select("#bit2c_price")   // change the line
        .duration(750)
        .attr("d",  graph_elements.line_bit2c(data));


        svg.select("#x-axis") // change the x axis
            .duration(750)
            .call(graph_elements.xAxis);
        svg.select("#y-axis") // change the y axis
            .duration(750)
            .call(graph_elements. yAxis);
}
