var _ = require('lodash');
//var Miner = require('../creepTypes/Miner');

class TravelCommander {
    constructor(room, travelers) {
        this.room = room;
        this.travelers = travelers;
        this.handleTravelers();
    }
    handleTravelers() {
        // First case - we are in the room we want to go to!
        // Second case - we are not in the room we want to go to so lets keep going - easy send them memory: home

        for(var c in this.travelers) {
            var creep = this.travelers[c];
            this.goHome(creep);
            //console.log(creep.memory.home + " : " + this.room.name);
            if (creep.memory.home == this.room.name) {
                // In the right room - arrived at destination,
                // turn off interT
                console.log(creep.name + " has arrived in room: " + this.room.print);
                creep.memory.interT = false;
            }
        }
    }
    goHome(creep) {
        var dest = creep.memory.home;
        creep.moveTo(new RoomPosition(25, 25, dest));
    }
}
module.exports = TravelCommander;