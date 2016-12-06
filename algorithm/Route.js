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