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