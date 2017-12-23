$('document').ready( function() {
  $.ajax({

    // The URL for the request
    url: 'http://127.0.0.1:8000/json',

    // The data to send (will be converted to a query string)
    data: {
        hours: 1
    },

    // Whether this is a POST or GET request
    type: "GET",

    // The type of data we expect back
    dataType : "json",


    success:draw

  });
});




function draw(data){


  var lineFunction = d3.line()
                             .x(function(d) { return d.time; })
                             .y(function(d) { return d.global_price; })
                           .interpolate("linear");

   //The SVG Container
   var svgContainer = d3.select("body").append("svg")
                                       .attr("width", 200)
                                       .attr("height", 200);

  svgContainer.append("path")
                              .attr("d", lineFunction(data))
                              .attr("stroke", "blue")
                              .attr("stroke-width", 2)
                              .attr("fill", "none");



};
