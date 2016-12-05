'use strict';

let destinationCities = [];

class RouteManager {

    // Holds our cities
    static get destinationCities() {
			return destinationCities;
		}

    // Adds a destination city
    static addCity(city) {
			destinationCities.push(city);
    }
    
    // Get a city
    static getCity(index){
			return destinationCities[index];
    }
    
    // Get the number of destination cities
    static numberOfCities(){
			return destinationCities.length;
    }
}

module.exports = RouteManager;