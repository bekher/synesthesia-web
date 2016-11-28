var transformPie = function (songs, id) {

	temp = {}
	data = []

	for (var s in songs) {
		if (temp[s.transform]) {
			temp[s.transform] = temp[s.transform] + 1
		} else {
			temp[s.transform] = 1
		}
	}

	for (var k in temp) {
		if (temp.hasOwnProperty(k)) {
			data.push({
				label: k,
				value: temp[k]
			});
		}
	}

	var svg = d3.select("#" + id)
		.append("svg")
		.append("g")

	svg.append("g")
		.attr("class", id + "-slices");
	svg.append("g")
		.attr("class", id + "-labels");
	svg.append("g")
		.attr("class", id + "-lines");

	var width = 960,
	    height = 450,
		radius = Math.min(width, height) / 2;

	var pie = d3.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var arc = d3.svg.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.4);

	var outerArc = d3.svg.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var key = function(d){ return d.data.label; };

	var color = d3.scaleLinear()
		.domain([0, data.length])
		.range(["#8080ff", "#ff99ff"])
		.interpolate(d3.interpolateRgb);

	function randomData (){
		var labels = color.domain();
		return labels.map(function(label){
			return { label: label, value: Math.random() }
		});
	}

	var change = function(data) {

		/* ------- PIE SLICES -------*/
		var slice = svg.select("." + id + "-slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function(d) { return color(d.data.label); })
			.attr("class", id + "-slice");

		slice		
			.transition().duration(1000)
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			})

		slice.exit()
			.remove();

		/* ------- TEXT LABELS -------*/

		var text = svg.select("." + id +  "-labels").selectAll("text")
			.data(pie(data), key);

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.text(function(d) {
				return d.data.label;
			});
		
		function midAngle(d){
			return d.startAngle + (d.endAngle - d.startAngle)/2;
		}

		text.transition().duration(1000)
			.attrTween("transform", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			});

		text.exit()
			.remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/

		var polyline = svg.select("." + id + "-lines").selectAll("polyline")
			.data(pie(data), key);
		
		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
			.attrTween("points", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};			
			});
		
		polyline.exit()
			.remove();
	};

    change(data);

    return change;
}
