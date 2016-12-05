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