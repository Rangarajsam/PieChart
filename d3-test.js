(function(){
  "use strict";
  var hubble_data = [{
      nebulae: "NGC 6822",
      distance: 0.500,
      distance_error: 0.010,
      velocity: 57,
      velocity_error: 2,
  }, {
      nebulae: "NGC 221",
      distance: 0.763,
      distance_error: 0.024,
      velocity: 200,
      velocity_error: 6,
  }, {
      nebulae: "NGC 598",
      distance: 0.835,
      distance_error: 0.105,
      velocity: 179,
      velocity_error: 3,
  }, {
      nebulae: "NGC 4736",
      distance: 6.5,
      distance_error: 0.400,
      velocity: 400,
      velocity_error: 1,
  }];
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
  };
  var width = 640 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var svg = d3.select("#container").append("svg")
      .attr("height", height + margin.left + margin.right)
      .attr("width", width + margin.top + margin.bottom);
  var chart = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var xScale = d3.scaleLinear().range([0, width]);
  var yScale = d3.scaleLinear().range([height, 0]);
  xScale.domain([
          d3.min(hubble_data, function(nebulae) {
              return nebulae.distance - nebulae.distance_error;
          }),
          d3.max(hubble_data, function(nebulae) {
              return nebulae.distance + nebulae.distance_error;
          })
      ])
      .nice();
  yScale.domain([
          d3.min(hubble_data, function(nebulae) {
              return nebulae.velocity - nebulae.velocity_error;
          }),
          d3.max(hubble_data, function(nebulae) {
              return nebulae.velocity + nebulae.velocity_error;
          })
      ])
      .nice();

  var xAxis = d3.axisBottom(xScale);
      // .scaleLinear();

  var yAxis = d3.axisLeft(yScale);
  var xAxisGroup = chart.append("g")
      .attr("transform", "translate(0," + height + ")").call(xAxis).append("text")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Distance (Mpc)");
  xAxis(xAxisGroup);
  var yAxisGroup = chart.append("g")
      .attr("transform", "translate(" + 0 + ","+ 0 +")").call(yAxis).append("text")
      .attr("x", 10)
      .attr("y", height)
      .style("text-anchor", "end")
      .text("Distance (Mpc)");
  xAxis(yAxisGroup);
})();
