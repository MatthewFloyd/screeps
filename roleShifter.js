/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleShifter');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
	    if(creep.memory.upgrading) {
	        let resourcePoints = [];
            for(var spawn in creep.room.memory.spawns)
            {
                let s = Game.getObjectById(creep.room.memory.spawns[spawn]);
                if(s.energy < s.energyCapacity)
                {
                    resourcePoints.push(s);
                }
            }
            if(creep.room.memory.extensions)
            {
                for(var e in creep.room.memory.extensions)
                {
                    let a = Game.getObjectById(creep.room.memory.extensions[e]);
                    if(a.energy < a.energyCapacity)
                    {
                        resourcePoints.push(a);
                    }
                }
            }
            resourcePoints.sort(function(a, b) {return a.energy - b.energy});
            if(creep.transfer(resourcePoints[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(resourcePoints[0]);
            }
	        if(creep.carry.energy == 0)
	        {
	            creep.memory.upgrading = false;
	        }
        }
        else {
            let containers = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)
            });
            containers.sort(function(a, b) {return b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]});
            if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(containers[0]);
            }
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.upgrading = true;
            }
        }
	}
};