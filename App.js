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