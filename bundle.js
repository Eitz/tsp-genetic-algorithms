(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const GA = require('./algorithm/GA');
const City = require('./algorithm/City');
const Population = require('./algorithm/Population');
const RouteManager = require('./algorithm/RouteManager');

const Point = require('./Point');

let points, population;
let POPULATION_SIZE, MUTATION_RATE;

class App {

	static init() {
		points = [];
		population = [];		
		POPULATION_SIZE = 100;
		MUTATION_RATE = 0.05;		
	}

	static reset() {
		App.init();
	}

	static addPoint(x, y) {
		points.push(new Point(x, y));
	}

	static get points() {
		return points;
	}

	static initAlgorithm() {
		population = [];
		RouteManager.init();
		for (let p of App.points) {
			RouteManager.addCity(new City(p.x, p.y));
		}
		population = new Population(points.length * 2, true);
	}

	static iterateAlgorithm() {
		population = GA.evolvePopulation(population);
		let fittest = population.getFittest();
		return { route: fittest, distance: fittest.getDistance(), numberOfCities: RouteManager.numberOfCities() };
	}
}

App.init();

module.exports = App;
},{"./Point":2,"./algorithm/City":4,"./algorithm/GA":6,"./algorithm/Population":7,"./algorithm/RouteManager":9}],2:[function(require,module,exports){
'use strict';

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

module.exports = Point;
},{}],3:[function(require,module,exports){
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
},{"./App":1}],4:[function(require,module,exports){
'use strict';

class City {
    /**
		 * Constructs a city at chosen x, y location or at a random place
		 * @param {Number} x
		 * @param {Number} y
		 */
    constructor(x, y){
			this.x = x || Math.floor((Math.random()*200));
			this.y = y || Math.floor((Math.random()*200));
    }
		/**
		 * Gets the distance to given city
		 * @param {City} city
		 */
    distanceTo(city){
			let xDistance = Math.abs(this.x - city.x);
			let yDistance = Math.abs(this.y - city.y);
			let distance = Math.sqrt( (xDistance*xDistance) + (yDistance*yDistance) );
			return distance;
    }
		/**
		 * Stringify: `${this.x}, ${this.y}`
		 */
    toString(){
        return `${this.x}, ${this.y}`;
    }
}

module.exports = City;
},{}],5:[function(require,module,exports){
'use strict';

class Functions {
	static shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
    }
    return array;
	}
}

module.exports = Functions;
},{}],6:[function(require,module,exports){
'use strict';

const Population = require('./Population');
const Route = require('./Route');

class GA {

	/* GA parameters */
	static get mutationRate() { return 0.010; }
	static get tournamentSize() { return 5; }
	static get elitism() { return true; }

	/**
	 * Evolves a population over one generation
	 * @param {Population} pop
	 * @returns {Population}
	 */
	static evolvePopulation(pop) {
		let newPopulation = new Population(pop.populationSize(), false);

		// Keep our best individual if elitism is enabled
		let elitismOffset = 0;
		if (GA.elitism) {
			newPopulation.saveRoute(0, pop.getFittest());
			elitismOffset = 1;
		}

		// Crossover population
		// Loop over the new population's size and create individuals from current population
		for (let i = elitismOffset; i < newPopulation.populationSize(); i++) {
			// Select parents
			let parent1 = GA.rouletteSelection(pop);
			let parent2 = GA.rouletteSelection(pop);
			// Crossover parents
			let child = GA.crossover(parent1, parent2);
			// Add child to new population
			newPopulation.saveRoute(i, child);
		}

		// Mutate the new population a bit to add some new genetic material
		for (let i = elitismOffset; i < newPopulation.populationSize(); i++) {
			GA.mutate(newPopulation.getRoute(i));
		}

		return newPopulation;
	}

	/**
	 * Applies crossover to a set of parents and creates offspring
	 * @param {Route} parent1
	 * @param {Route} parent2
	 * @returns {Route} child
	 **/
	static crossover(parent1, parent2) {
		// Create new child route
		let child = new Route();

		// Get start and end sub route positions for parent1's route
		let startPos = Math.floor(Math.random() * parent1.routeSize());
		let endPos = Math.floor(Math.random() * parent1.routeSize());

		// Loop and add the sub route from parent1 to our child
		for (let i = 0; i < child.routeSize(); i++) {
			// If our start position is less than the end position
			if (startPos < endPos && i > startPos && i < endPos) {
				child.setCity(i, parent1.getCity(i));
			} // If our start position is larger
			else if (startPos > endPos) {
				if (!(i < startPos && i > endPos)) {
					child.setCity(i, parent1.getCity(i));
				}
			}
		}

		// Loop through parent2's city route
		for (let i = 0; i < parent2.routeSize(); i++) {
			// If child doesn't have the city add it
			if (!child.containsCity(parent2.getCity(i))) {
				// Loop to find a spare position in the child's route
				for (let j = 0; j < child.routeSize(); j++) {
					// Spare position found, add city
					if (child.getCity(j) == null) {
						child.setCity(j, parent2.getCity(i));
						break;
					}
				}
			}
		}
		return child;
	}

	/** 
	 * Mutate a route using swap mutation
	 * @param {Route} route
	 * @returns {undefined}
	*/
	static mutate(route) {
		// Loop through route cities
		for (let routePos1 = 0; routePos1 < route.routeSize(); routePos1++) {
			// Apply mutation rate
			if (Math.random() < GA.mutationRate) {
				// Get a second random position in the route
				let routePos2 = Math.floor(route.routeSize() * Math.random());

				// Get the cities at target position in route
				let city1 = route.getCity(routePos1);
				let city2 = route.getCity(routePos2);

				// Swap them around
				route.setCity(routePos2, city1);
				route.setCity(routePos1, city2);
			}
		}
	}

	// Selects candidate route for crossover
	/**
	 * @param {Population} pop
	 * @returns {Route}
	 */
	static tournamentSelection(pop) {
		// Create a tournament population
		let tournament = new Population(GA.tournamentSize, false);
		// For each place in the tournament get a random candidate route and
		// add it
		for (let i = 0; i < GA.tournamentSize; i++) {
			let randomIdx = Math.floor(Math.random() * pop.populationSize());
			tournament.saveRoute(i, pop.getRoute(randomIdx));
		}
		// Get the fittest route
		let fittest = tournament.getFittest();
		return fittest;
	}

	// Selects candidate route for crossover
	/**
	 * @param {Population} pop
	 * @returns {Route}
	 */
	static rouletteSelection(pop) {
		let sumOfFitness = 0;

		for (let i=0; i < pop.populationSize(); i++)
			sumOfFitness += pop.getRoute(i).getFitness();

		let rouletteNumber = Math.random() * sumOfFitness;
		
		let winnerSum = 0;
		for (let i=0; i<pop.populationSize(); i++) {
			winnerSum += pop.getRoute(i).getFitness();
			if (winnerSum > rouletteNumber) {
				return pop.getRoute(i);
			}
		}
		throw `Can't find candidate in the roullete: winnerSum: ${winnerSum}, sumOfFitness: ${sumOfFitness}, rouletteNumber: ${rouletteNumber}`;
	}
}

module.exports = GA;
},{"./Population":7,"./Route":8}],7:[function(require,module,exports){
'use strict';

const Route = require('./Route');

class Population {

	// Construct a population
	constructor(populationSize, initialise) {
		// Holds population of routes
		this.routes = new Array(populationSize);
		// If we need to initialise a population of routes do so
		if (initialise) {
			// Loop and create individuals
			for (let i = 0; i < this.populationSize(); i++) {
				let newRoute = new Route();
				newRoute.generateRandomIndividual();
				this.saveRoute(i, newRoute);
			}
		}
	}

	// Saves a route
	saveRoute(index, route) {
		this.routes[index] = route;
 		// this.routes.sort((a, b) => b.getFitness() - a.getFitness() );
	}

	// Gets a route from population
	getRoute(index) {
		return this.routes[index];
	}

	// Gets the best route in the population
	getFittest() {
		let fittest = this.routes[0];
		// Loop through individuals to find fittest
		for (let i = 1; i < this.populationSize(); i++) {
			if (fittest.getFitness() <= this.getRoute(i).getFitness()) {
				fittest = this.getRoute(i);
			}
		}
		return fittest;
	}

	// Gets population size
	populationSize() {
		return this.routes.length;
	}
}

module.exports = Population;
},{"./Route":8}],8:[function(require,module,exports){
'use strict';

const RouteManager = require('./RouteManager');
const Functions = require('./Functions');

class Route {
	// Constructs a blank route
	constructor(route) {
		// Cache
		this.fitness = 0;
		this.distance = 0;

		if (route) {
			this.route = route;
		} else {
			// Holds our route of cities
			this.route = [];
			// prepare
			for (let i = 0; i < RouteManager.numberOfCities(); i++) {
				this.route.push(undefined);
			}
		}
	}

	// Creates a random individual
	generateRandomIndividual() {
		// Loop through all our destination cities and add them to our route
		for (let cityIndex = 0; cityIndex < RouteManager.numberOfCities(); cityIndex++) {
			this.setCity(cityIndex, RouteManager.getCity(cityIndex));
		}
		// Randomly reorder the route
		this.route = Functions.shuffleArray(this.route);
	}

	// Gets a city from the route
	getCity(routeIndex) {
		return this.route[routeIndex];
	}

	// Sets a city in a certain position within a route
	setCity(routeIndex, city) {
		this.route[routeIndex] = city;
		// If the routes been altered we need to reset the fitness and distance
		this.fitness = 0;
		this.distance = 0;
	}

	// Gets the routes fitness
	getFitness() {
		if (this.fitness == 0) {
			this.fitness = 1 / this.getDistance();
		}
		return this.fitness;
	}

	// Gets the total distance of the route
	getDistance() {
		if (this.distance == 0) {
			let routeDistance = 0;
			// Loop through our route's cities
			for (let cityIndex = 0; cityIndex < this.routeSize(); cityIndex++) {
				// Get city we're travelling from
				let fromCity = this.getCity(cityIndex);
				// City we're travelling to
				let destinationCity;
				// Check we're not on our route's last city, if we are set our 
				// route's final destination city to our starting city
				if (cityIndex + 1 < this.routeSize())
					destinationCity = this.getCity(cityIndex + 1);
				else
					destinationCity = this.getCity(0);

				// Get the distance between the two cities
				routeDistance += fromCity.distanceTo(destinationCity);
			}
			this.distance = routeDistance;
		}
		return this.distance;
	}

	// Get number of cities on our route
	routeSize() {
		return this.route.length;
	}

	// Check if the route contains a city
	containsCity(city) {
		return this.route.indexOf(city) != -1;
	}

	toString() {
		let geneString = "|";
		for (let i = 0; i < this.routeSize(); i++) {
			geneString += this.getCity(i) + "|";
		}
		return geneString;
	}
}

module.exports = Route;
},{"./Functions":5,"./RouteManager":9}],9:[function(require,module,exports){
'use strict';

let destinationCities = [];

class RouteManager {

	static init() {
		destinationCities = [];
	}

	// Holds our cities
	static get destinationCities() {
		return destinationCities;
	}

	// Adds a destination city
	static addCity(city) {
		destinationCities.push(city);
	}

	// Get a city
	static getCity(index) {
		return destinationCities[index];
	}

	// Get the number of destination cities
	static numberOfCities() {
		return destinationCities.length;
	}
}

module.exports = RouteManager;
},{}]},{},[3]);
