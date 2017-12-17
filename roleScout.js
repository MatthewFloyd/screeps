/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleScout');
 * mod.thing == 'a thing'; // true
 */

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
	        let arrived = wanderer.run(creep, 'W2N5');
	        if(arrived)
	        {
	            console.log("We have arrived!");
	            creep.memory.upgrading = true;
	        }
	        else
	        {
	            console.log("We are still on the way!")
	        }
        }
        else { // at destination
            // kill anything that moves
            // store in memory if tower exists
            // stop spawning if tower exists
            var hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS); // Nearest enemy
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            });
            if(hostiles)
            {
                if(creep.attack(hostiles) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(hostiles);
                }
            }
            else
            {
                creep.memory.upgrading = false;
                /*
                var hostileBuildings = creep.room.find(FIND_STRUCTURES);
                var nearest = creep.pos.findClosestByRange(hostileBuildings);
                if(creep.attack(nearest) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(nearest);
                }*/
            }
            if(towers.length > 0)
            {
                console.log("stop! he has a tower and this dosen't work anymore!");
                Memory.danger = creep.room.name;
            }
        }
	}
};
/*
if (creep.carry.energy == 0 && creep.room.name == 'E17N5') {//E18N5 37 37
	    
    var dest = new RoomPosition(26, 16, 'E17N4');
    creep.moveTo(dest);
}
else if (creep.carry.energy < creep.carryCapacity && creep.room.name == 'E17N4') {
    var sources = creep.room.find(FIND_SOURCES_ACTIVE);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}
else if (creep.carry.energy == creep.carryCapacity && creep.room.name == 'E17N4') {
    var home = new RoomPosition(10, 48, 'E17N5');
    creep.moveTo(home);
}
else if (creep.carry.energy > 0 && creep.room.name == 'E17N5') {
    var targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.energy < structure.energyCapacity;
            }
    });
    if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}
*/