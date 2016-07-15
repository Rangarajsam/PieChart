 var containerSelection = d3.select("#container");
 var svgSelection = containerSelection.append("svg")
     .attr("width", 200)
     .attr("height", 200);

 var circleRadi = [{
     radius: 40,
     bg: "#00bbcc"
 }, {
     radius: 20,
     bg: "#189"
 },{
     radius: 10,
     bg: "#156"
 }];
 var radiFunction = function(d) {
     return d.radius;
 };
 var colorFunction = function(d) {
     return d.bg;
 };

 var circleSelection = svgSelection.selectAll("circle")
     .data(circleRadi)
     .enter()
     .append("circle")
     .attr("cx", 50)
     .attr("cy", 50)
     .attr("r", radiFunction)
     .style("fill", colorFunction);

 // var theData = [5, 8, 12];
 //
 // var p = d3.select("body").selectAll("p")
 //     .data(theData)
 //     .enter()
 //     .append("p").text(function(d, i) {
 //         return "i= " + i + ", D= " + d;
 //     });

 console.log(circleSelection);
