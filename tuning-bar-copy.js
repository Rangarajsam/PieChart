var tuningBar = angular.module("tuningBar", []);

tuningBar.directive("tuningBarMenu", ['pageNavigationService', function (pageNavigationService) {
	return {
		restrict: "AE",
		link: function (scope, elem, attr) {
			elem.append("<div class='tuning-bar-close'></div>");
			var onHoverMove = 150;
			var partBeforeHover = 15;
			var winWidthBeforeResize, elemLeftBeforeResize;
			var currentPositions = function () {
				winWidthBeforeResize = window.innerWidth;
				elemLeftBeforeResize = elem.offset().left;
			};
			currentPositions();
			elem.on('mouseenter', function () {
				var windowWidth = window.innerWidth - partBeforeHover;
				var elemLeft = elem.offset().left;
				if (windowWidth === elemLeft) {
					elem.animate({
						left: (windowWidth - onHoverMove) + "px"
					});
				}
				elem.find(".tuning-bar-close").css({
					display: "block"
				});
				elem.css({
					opacity: 1
				});
				currentPositions();
			});
			elem.on('mouseleave', function () {
				var windowWidth = window.innerWidth;
				elem.find(".tuning-bar-close").css("display", "none");
				var elemLeft = elem.offset().left;
				if ((windowWidth - onHoverMove - partBeforeHover) > elemLeft) {
					elem.css({
						opacity: 0.2
					});
				}
				currentPositions();
			});
			elem.find(".tuning-bar-close").on("click", function () {
				var windowWidth = window.innerWidth;
				elem.animate({
					left: (windowWidth - partBeforeHover) + "px",
					top: "50%",
					marginTop: "-95px",
					opacity: 1
				});
				currentPositions();
			});
			window.onresize = function () {
				var elemLeft = elem.offset().left;
				var windowWidth = window.innerWidth;
				console.log(windowWidth);
				if ((winWidthBeforeResize - partBeforeHover) === elemLeftBeforeResize) {
					elem.css({
						left: (windowWidth - partBeforeHover) + "px",
						top: "50%",
						marginTop: "-95px"
					});
				} else if ((winWidthBeforeResize - onHoverMove - partBeforeHover) === elemLeftBeforeResize) {
					elem.css({
						left: (windowWidth - onHoverMove - partBeforeHover) + "px",
						top: "50%",
						marginTop: "-95px"
					});
				}
				currentPositions();
			};



			console.log("tuning bar activated");
			var svgElementAttr = {
				width: 190,
				height: 190
			};
			svgElementAttr.radius = Math.min(svgElementAttr.width, svgElementAttr.height) / 2;
			svgElementAttr.innerRadius = 40;
			var plotTuningBar = function () {

				var container = d3.select("#tuning-bar-menu-container");
				var svgElement = container.append("svg");
				svgElement.attr("class", "tuning-bar-menu-holder");
				svgElement.attr("width", svgElementAttr.width).attr("height", svgElementAttr.height);

				var circle = svgElement.append("g").attr("class", "tt-tuningbar-holder");
				circle.attr("transform", "translate(" + svgElementAttr.width / 2 + "," + svgElementAttr.height / 2 + ")");


				console.log(svgElementAttr.radius);
				d3.json("../../tuningbar/config/tuning-bar-data.json", function (d) {
					var tuningBar = d.tuningBar;
					var pieColors = [];
					tuningBar.forEach(function (data) {
						pieColors.push(data.color);
					});
					var color = d3.scale.ordinal()
						.range(pieColors);
					var arc = d3.svg.arc();
					arc.innerRadius(svgElementAttr.innerRadius).outerRadius(svgElementAttr.radius);

					var pie = d3.layout.pie();
					pie.value(function (d, i) {
						return d.percentage;
					}).sort(null);

					var seperateGroups = circle.selectAll("g").data(pie(tuningBar));
					seperateGroups.enter().append("g");
					seperateGroups.on("click", function (d) {
						pageNavigationService.goToPage(d.data.url);
					});

					var path = seperateGroups.append("path");
					path.attr("d", arc)
						.attr("id", function (d, i) {
							return "bendtext" + i;
						})
						.attr("class", "tuning-menu")
						.attr('fill', function (d, i) {
							return color(d.data.color);
						});


					var bendTxt = seperateGroups.append("text").attr("class", "chartText");
					bendTxt.attr("x", function (d) {
							return d.data.xOffset;
						})
						.attr("dy", 25)
						.append("textPath").attr("xlink:href", function (d, i) {
							return "#bendtext" + i;
						})
						.text(function (d) {
							return d.data.text;
						});

					var innerCircleGroup = circle.append("g").attr("class", "inner-circle");
					var innerCircle = innerCircleGroup.append("circle");
					innerCircle.attr("cx", 0).attr("cy", 0).attr("r", svgElementAttr.innerRadius);

					var innerCircleTxt = innerCircleGroup.append("text");
					innerCircleTxt.attr("x", 0).attr("y", -2).attr("class", "inner-circle-txt").style("fill", "#fff")
						.text("Tuning").append('tspan').attr("x", 0).attr("y", 15).text("Bar");

					var mouseEnterFn = function () {
						d3.select(this).select("path").transition().duration(500).style("fill", function (d) {
							return d.data.mouseOverColor;
						});
					};
					var mouseLeaveFn = function () {
						d3.select(this).select("path").transition().duration(500).style("fill", function (d) {
							return d.data.color;
						});
					};
					seperateGroups.on("mouseenter", mouseEnterFn);
					seperateGroups.on("mouseleave", mouseLeaveFn);
					$("#tuning-bar-menu-container").tinyDraggable({
						handle: '.inner-circle'
					});
					// d3.select(".inner-circle").on("click", function () {
					// 		console.log("clicked");
					// 		reduceSizewhenDragging();
					// 	});
				});
			};
			plotTuningBar();

			var reduceSizewhenDragging = function () {

						svgElementAttr.width= 100;
						svgElementAttr.height= 100;
						svgElementAttr.innerRadius = 25;
						plotTuningBar();

			};
			/*var isDragging = false;
			var isMouseDown = false;
			elem.mousedown(function () {
					isMouseDown = true;
				});
				elem.on("mousemove",function () {
					if (isMouseDown) {
						isDragging = true;
						reduceSizewhenDragging();
					} else {
						isDragging = false;
					}
				})
				.mouseup(function () {
					isDragging = false;
				});*/


		}
	}

}]);
