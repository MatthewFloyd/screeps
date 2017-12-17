
wanderer = require('wanderer');

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
        for(var room in Game.rooms)
        {
            if(Game.rooms[room].memory == undefined)
            {
                delete Memory.setup;
            }
        }
	    if(!creep.memory.upgrading) { // In transit
	        let arrived = wanderer.run(creep, 'W2N7');
	        if(arrived)
	        {
	            //console.log("We have arrived!");
	            var sources = creep.room.find(FIND_SOURCES);
                var nearest = creep.pos.findClosestByRange(sources);
                if(creep.harvest(nearest) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(nearest);
                }
                if(creep.carry.energy == creep.carryCapacity)
                {
	            creep.memory.upgrading = true;
                }
	        }
	        else
	        {
	            console.log("We are still on the way!")
	        }
        }
        else { // at destination 11 41
            /*var c = creep.room.controller;
            if(creep.claimController(c) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(c);
            }*/
            creep.room.createConstructionSite(11, 41, STRUCTURE_SPAWN);
            var s = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(s.length > 0 && creep.carry.energy > 0)
            {
                if(creep.build(s[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(s[0]);
                }
            }
            else
            {
                creep.memory.upgrading = false;
            }
        }
	}
};