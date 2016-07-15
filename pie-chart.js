var svgElementAttr = {
    width: 190,
    height: 190
};
var container = d3.select("#container");
var svgElement = container.append("svg").attr("class","holder").attr("width", svgElementAttr.width).attr("height", svgElementAttr.height);
var circle = svgElement.append("g").attr("transform", "translate(" + svgElementAttr.width / 2 + "," + svgElementAttr.height / 2 + ")").attr("class", "tt-tuningbar-container");
svgElementAttr.radius = Math.min(svgElementAttr.width, svgElementAttr.height) / 2;
svgElementAttr.innerRadius = 40;
console.log(svgElementAttr.radius);
d3.json("./pie-chart-data.json", function(d) {
    var tuningBar = d.tuningBar;
    var pieColors = [];
    tuningBar.forEach(function(data) {
        pieColors.push(data.color);
    });
    var color = d3.scaleOrdinal()
        .range(pieColors);
    var arc = d3.arc()
        .innerRadius(svgElementAttr.innerRadius)
        .outerRadius(svgElementAttr.radius);

    var pie = d3.pie()
        .startAngle(-90 * Math.PI / 180)
        .endAngle(-90 * Math.PI / 180 + 2 * Math.PI).value(function(d, i) {
            return d.percentage;
        }).sort(null);
    var seperateGroups = circle.selectAll("g")
        .data(pie(tuningBar))
        .enter()
        .append("g").attr("xlink:href",function(d){
          return d.data.url;
        });
    var path = seperateGroups.append("path")
        .attr("d", arc)
        .attr("id", function(d, i) {
            return "bendtext" + i;
        })
        .attr("class", "tuning-menu")
        .attr('fill', function(d, i) {
            return color(d.data.color);
        });


    var bendTxt = seperateGroups.append("text").attr("class", "chartText")
        .attr("x", function(d) {
            return d.data.xOffset;
        })
        .attr("dy", 25)
        .append("textPath").attr("xlink:href", function(d, i) {
            return "#bendtext" + i;
        })
        .text(function(d) {
            return d.data.text;
        });
    var innerCircle = circle.append("g").attr("class", "inner-circle");
    innerCircle.append("circle").attr("cx", 0).attr("cy", 0).attr("r", svgElementAttr.innerRadius);
    innerCircle.append("text").attr("x", 0).attr("y", -2).attr("class", "inner-circle-txt").style("fill", "#fff").text("Tuning")
        .append('tspan').attr("x", 0).attr("y", 15).text("Bar");
    var mouseEnterFn = function() {
        d3.select(this).select("path").transition().duration(500).style("fill", function(d) {
            return d.data.mouseOverColor;
        });
    };
    var mouseLeaveFn = function() {
        d3.select(this).select("path").transition().duration(500).style("fill", function(d) {
            return d.data.color;
        });
    };
    seperateGroups.on("mouseenter", mouseEnterFn);
    seperateGroups.on("mouseleave", mouseLeaveFn);
    var move = function(d) {
        var x = d3.event.x,
            y = d3.event.y;
        d3.select(this)
            .attr("transform", function(d) {
                return "translate(" + x + ", " + y + ")";
            });
    };
    var drag = d3.drag().on("drag", move);
    d3.select(".tt-tuningbar-container").call(drag);
});
