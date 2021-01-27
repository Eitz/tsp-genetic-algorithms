'use strict';

const GA = require('./algorithm/GA');
const City = require('./algorithm/City');
const Population = require('./algorithm/Population');
const RouteManager = require('./algorithm/RouteManager');

const Point = require('./Point');

class App {

	static reset() {
		points = [];
		population = [];
	}

	static addPoint(x, y) {
		App.points.push(new Point(x, y));
	}

	static initAlgorithm() {
		App.population = [];
		RouteManager.init();
		for (let p of App.points) {
			RouteManager.addCity(new City(p.x, p.y));
		}
		App.population = new Population(points.length * 2, true);
	}

	static iterateAlgorithm() {
		App.population = GA.evolvePopulation(population);
		const fittest = population.getFittest();
		return { route: fittest, distance: fittest.getDistance(), numberOfCities: RouteManager.numberOfCities() };
	}
}

App.points = [];
App.population = [];

module.exports = App;