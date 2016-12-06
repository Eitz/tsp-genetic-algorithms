const App = require('./App');

let CANVAS_WIDTH, CANVAS_HEIGHT;

let intervalID;
let iterations = 0;

let canvas;
let lastRouteDistance;

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
			App.reset();
			canvas.getContext("2d").clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			document.getElementById('distance-start').innerHTML = '?';
			document.getElementById('distance-best').innerHTML = '?';
			document.getElementById('iteration').innerHTML = 0;
			document.getElementById('cities').innerHTML = 0;
			document.getElementById('add-5-point').disabled = false;
			document.getElementById('add-point').disabled = false;
			document.getElementById('start').disabled = true;
		}

		document.getElementById('add-5-point').onclick = function (ev) {
			for (let i = 0; i < 5; i++)
				UI.addPoint();
			document.getElementById('start').disabled = false;
		}

		document.getElementById('add-point').onclick = function (ev) {
			UI.addPoint();
			document.getElementById('start').disabled = false;
		}

		document.getElementById('start').onclick = function (ev) {
			document.getElementById('add-5-point').disabled = true;
			document.getElementById('add-point').disabled = true;
			console.log("start");
			if (iterations == 0)
				console.log(App.initAlgorithm());
			intervalID = setInterval(function() {
				iterations++;
				UI.draw(App.iterateAlgorithm(), iterations);
			}, 10);
		}

		document.getElementById('stop').onclick = function (ev) {
			console.log("stop"); 
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
		if (result.route.getDistance() != lastRouteDistance) {
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
			document.getElementById('distance-start').innerHTML = result.route.getDistance();
		else 
			document.getElementById('distance-best').innerHTML = result.route.getDistance();
		document.getElementById('iteration').innerHTML = iterations;
		lastRouteDistance = result.route;
	}
}

UI.init();
for (let i = 0; i < 10; i++)
	UI.addPoint();