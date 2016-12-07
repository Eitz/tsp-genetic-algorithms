const App = require('./App');

let CANVAS_WIDTH, CANVAS_HEIGHT;

let intervalID;
let iterations = 0;

let canvas;
let lastRouteDistance;
let iterationsWithoutImprovement = 0;

class UI {
	static init() {

		canvas = document.getElementsByTagName('canvas')[0];

		CANVAS_WIDTH = canvas.width;
		CANVAS_HEIGHT = canvas.height;

		document.getElementById('reset').onclick = function (ev) {
			console.log("reset");
			if (intervalID)
				clearInterval(intervalID);
			iterations = 0;
			iterationsWithoutImprovement = 0;
			App.reset();
			canvas.getContext("2d").clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			document.getElementById('distance-start').innerHTML = '?';
			document.getElementById('distance-best').innerHTML = '?';
			document.getElementById('iteration').innerHTML = 0;
			document.getElementById('cities').innerHTML = 0;
			document.getElementById('add-5-point').disabled = false;
			document.getElementById('add-point').disabled = false;
			document.getElementById('start').disabled = true;
			document.getElementById('start-limited').disabled = true;
			document.getElementById('stop').disabled = true;
		}

		document.getElementById('add-5-point').onclick = function (ev) {
			for (let i = 0; i < 5; i++)
				UI.addPoint();
			document.getElementById('start').disabled = false;
			document.getElementById('start-limited').disabled = false;
		}

		document.getElementById('add-point').onclick = function (ev) {
			UI.addPoint();
			document.getElementById('start').disabled = false;
			document.getElementById('start-limited').disabled = false;
		}

		document.getElementById('start').onclick = function (ev) {
			document.getElementById('add-5-point').disabled = true;
			document.getElementById('add-point').disabled = true;
			document.getElementById('start').disabled = true;
			document.getElementById('start-limited').disabled = true;
			document.getElementById('stop').disabled = false;
			if (iterations == 0)
				console.log(App.initAlgorithm());
			intervalID = setInterval(function() {
				iterations++;
				UI.draw(App.iterateAlgorithm(), iterations);
			}, 30);
		}

		document.getElementById('start-limited').onclick = function (ev) {
			document.getElementById('add-5-point').disabled = true;
			document.getElementById('add-point').disabled = true;
			document.getElementById('start').disabled = true;
			document.getElementById('start-limited').disabled = true;
			document.getElementById('stop').disabled = false;
			if (iterations == 0)
				console.log(App.initAlgorithm());
			intervalID = setInterval(function() {
				iterations++;
				let result = App.iterateAlgorithm(); 
				if (Number(result.route.getDistance().toFixed(3)) == lastRouteDistance) {
					iterationsWithoutImprovement++;
				} else {
					iterationsWithoutImprovement = 0;
				}
				UI.draw(result, iterations);
				if (iterationsWithoutImprovement >= 300 || iterations >= 1000) {
					clearInterval(intervalID);
					document.getElementById('start').disabled = false;
				}
			}, 10);
		}

		document.getElementById('stop').onclick = function (ev) {
			console.log("stop"); 
			document.getElementById('start').disabled = false;
			if (intervalID)
				clearInterval(intervalID)
		}
	}

	static addPoint() {
		let x = Math.floor(Math.random() * CANVAS_WIDTH);
		let y = Math.floor(Math.random() * CANVAS_HEIGHT);
		App.addPoint(x, y);
		canvas.getContext("2d").fillRect(x, y, 4, 4);
		document.getElementById('cities').innerHTML = App.points.length;
	}

	static draw(result, iterations) {
		if (result.route.getDistance().toFixed(3) != lastRouteDistance) {
			let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			for (let i = 0; i < result.route.routeSize(); i++) {
				let city = result.route.getCity(i);
				ctx.fillRect(city.x, city.y, 4, 4);
				let last_city;
				if (i == 0) {
					last_city = result.route.getCity(result.route.routeSize()-1);
				}
				else {
					last_city = result.route.getCity(i-1);
				}
				ctx.beginPath();
				ctx.moveTo(city.x +2,city.y+2);
				ctx.lineTo(last_city.x+2,last_city.y+2);
				ctx.stroke();
			}	
		}
		if (iterations == 1)
			document.getElementById('distance-start').innerHTML = result.route.getDistance().toFixed(3)
		else 
			document.getElementById('distance-best').innerHTML = result.route.getDistance().toFixed(3)
		document.getElementById('iteration').innerHTML = iterations;
		lastRouteDistance = Number(result.route.getDistance().toFixed(3));
	}
}

UI.init();
for (let i = 0; i < 10; i++)
	UI.addPoint();