'use strict';

const GA = require('./GA');
const City = require('./City');
const Population = require('./Population');
const RouteManager = require('./RouteManager');

execute();

function execute() {

  // Create and add our cities
	RouteManager.addCity(new City(60, 200));
	RouteManager.addCity(new City(180, 200));
	RouteManager.addCity(new City(80, 180));
	RouteManager.addCity(new City(140, 180));
	RouteManager.addCity(new City(20, 160));
	RouteManager.addCity(new City(100, 160));
	RouteManager.addCity(new City(200, 160));
	RouteManager.addCity(new City(140, 140));
	RouteManager.addCity(new City(40, 120));
	RouteManager.addCity(new City(100, 120));
	RouteManager.addCity(new City(180, 100));
	RouteManager.addCity(new City(60, 80));
	RouteManager.addCity(new City(120, 80));
	RouteManager.addCity(new City(180, 60));
	RouteManager.addCity(new City(20, 40));
	RouteManager.addCity(new City(100, 40));
	RouteManager.addCity(new City(200, 40));
	RouteManager.addCity(new City(20, 20));
	RouteManager.addCity(new City(60, 20));
	RouteManager.addCity(new City(160, 20));

  // Initialize population
	let pop = new Population(50, true);
	console.log("Initial distance: " + pop.getFittest().getDistance());

	// Evolve population for 100 generations
	pop = GA.evolvePopulation(pop);
	for (let i = 0; i < 100; i++) {
		console.log(`Progress: ${pop.getFittest().getDistance()}`)
		pop = GA.evolvePopulation(pop);
	}

	// Print final results
	console.log("Finished");
	console.log("Final distance: " + pop.getFittest().getDistance().toString());
	console.log("Solution:");
	console.log(pop.getFittest().toString());
}
