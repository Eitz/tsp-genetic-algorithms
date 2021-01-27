'use strict';

const Population = require('./Population');
const Route = require('./Route');

const MUTATION_RATE = 0.05;
const TOURNAMENT_SIZE = 5;
const USE_ELITISM = true;

class GA {

	/* GA parameters */
	static get mutationRate() { return MUTATION_RATE; }
	static get tournamentSize() { return TOURNAMENT_SIZE; }
	static get elitism() { return USE_ELITISM; }

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

		for (let i = 0; i < pop.populationSize(); i++)
			sumOfFitness += pop.getRoute(i).getFitness();

		let rouletteNumber = Math.random() * sumOfFitness;

		let winnerSum = 0;
		for (let i = 0; i < pop.populationSize(); i++) {
			winnerSum += pop.getRoute(i).getFitness();
			if (winnerSum > rouletteNumber) {
				return pop.getRoute(i);
			}
		}
		throw `Can't find candidate in the roullete: winnerSum: ${winnerSum}, sumOfFitness: ${sumOfFitness}, rouletteNumber: ${rouletteNumber}`;
	}
}

module.exports = GA;