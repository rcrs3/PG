var circles = [];
var points = [];
var showPoint = true;
var showPolygon = true;
var showCurve = true;
//var paths = [];

stage.on('message:receivePointBox', function(data) {
	showPoint = data.data;
	getDraw();
})

stage.on('message:receivePolygonBox', function(data) {
	showPolygon = data.data;
	getDraw();
})

stage.on('message:receiveCurveBox', function(data) {
	showCurve = data.data;
	getDraw();
})

function getCasteljau(r, i, t) {
	if(r == 0) return points[i];
	
	var p1; var p2;
	p1 = getCasteljau(r-1, i, t);
	p2 = getCasteljau(r-1, i+1, t);
	return new Point(((1-t)*p1.x) + (t*p2.x), ((1-t)*p1.y) + (t*p2.y));
}

function casteljau() {
	var p = [];
	for(var t = 0; t <= 1; t += 0.01) {
		var aux = getCasteljau(points.length-1, 0, t);
		p.push(aux.x);
		p.push(aux.y);
	}
	return new Path(p)
				.moveTo(0,0)
				.stroke('blue', 1);
}
var pathsPolygonG = [];
var pathsCurveG = [];

function getDraw() {
	var stageObjects = [];
	if(showCurve) {
		pathsCurveG.forEach(function(curve) {
			stageObjects.push(curve);
		});
	}
	if(showPoint) {
		circles.forEach(function(c) {
			stageObjects.push(c);
		});
	}
	if(showPolygon) {
		pathsPolygonG.forEach(function(poly) {
			stageObjects.push(poly);
		})
	}
	stage.children(stageObjects);
}

stage.on('click', function(e) {
	circles.push(new Circle(e.x, e.y, 4)
					.addTo(stage)
					.attr('fillColor', 'gray'));
	points.push(new Point(e.x, e.y));
	
	if(circles.length > 1) {
		var pathsPolygon = [];
		var pathsCurve = [];
		for(var i = 0; i < circles.length-1; i++) {
			pathsPolygon.push(new Path([['moveTo', circles[i].attr('x'), circles[i].attr('y')],
			 					['lineTo', circles[i+1].attr('x'), circles[i+1].attr('y')]
			 					]).stroke('gray', 1));
		}

		if(points.length > 2) {
			var curve = casteljau();
			//console.log("oi");
			pathsCurve.push(curve);
		}
		pathsPolygonG = pathsPolygon;
		pathsCurveG = pathsCurve;
		getDraw();
	}
});