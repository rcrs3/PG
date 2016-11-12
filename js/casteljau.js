var circles = [];
var points = [];
var showPoint = true;
var showPolygon = true;
var showCurve = true;
var evaluations = 100;
var pathsPolygonG = [];
var pathsCurveG = [];
//var paths = [];

stage.on('message:receiveEvaluation', function(data) {
	evaluations = data.data;
	calculateCasteljau();
	getDraw();
})

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

function interpolation(t, p1, p2){
	return new Point(t*p1.x + (1-t)*p2.x, t*p1.y + (1-t)*p2.y);
}

function getCasteljau(){
  var curve = [];
  for (var t = 0; t <= 1; t+=1/evaluations) {
    var aux = [];
    aux = points;
    while (aux.length>1) {
      var len = aux.length;
      var aux2 = [];
      for (var i = 0; i < len-1; i++) {
        var newP = interpolation(t, aux[i], aux[i+1]);
        aux2.push(newP);
      }
      aux = aux2;
    }
    curve.push(aux[0].x);
    curve.push(aux[0].y);
  }
  return new Path(curve).moveTo(0,0)
  						.stroke('blue', 1);
}

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

function calculateCasteljau() {
	pathsCurveG = [];
	if(points.length > 2) {
		var curve = getCasteljau();
		//console.log("oi");
		pathsCurveG.push(curve);
	}
}

stage.on('click', function(e) {
	var delet = false;
	for(var i = 0; i < circles.length; i++) {
		if(e.target == circles[i]) {
			circles.splice(i, 1);
			points.splice(i, 1);
			delet = true;
		}
	}
	if(!delet) {
		circles.push(new Circle(e.x, e.y, 4)
						.addTo(stage)
						.attr('fillColor', 'gray'));
		points.push(new Point(e.x, e.y));
	}
	if(circles.length > 1) {
		var pathsPolygon = [];
		for(var i = 0; i < circles.length-1; i++) {
			pathsPolygon.push(new Path([['moveTo', circles[i].attr('x'), circles[i].attr('y')],
			 					['lineTo', circles[i+1].attr('x'), circles[i+1].attr('y')]
			 					]).stroke('gray', 1));
		}

		pathsPolygonG = pathsPolygon;
		calculateCasteljau();
		getDraw();
	}
});

stage.on('pointerup', function(e) {
	for(var i = 0; i < circles.length; i++) {
		if(e.target == circles[i]) {
			circles[i].x = e.x;
			circles[i].y = e.y;
			points[i].x = e.x;
			points[i].y = e.y;
		}
	}
})