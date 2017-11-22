/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleRepairer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
	    if(creep.memory.upgrading) {
	        var R = creep.room.find(FIND_STRUCTURES, {
	            filter: (s) => {return s.hits < s.hitsMax}
	        });
	        if(creep.repair(R[0]) == ERR_NOT_IN_RANGE)
	        {
	            creep.moveTo(R[0]);
	        }
	        if(creep.carry.energy == 0)
	        {
	            creep.memory.upgrading = false;
	        }
        }
        else {
            let resourcePoints = [];
            for(var spawn in creep.room.memory.spawns)
            {
                let s = Game.getObjectById(creep.room.memory.spawns[spawn]);
                if(s.energy >= 250)
                {
                    resourcePoints.push(s);
                }
            }
            if(creep.room.memory.extensions)
            {
                for(var e in creep.room.memory.extensions)
                {
                    let a = Game.getObjectById(creep.room.memory.extensions[e]);
                    resourcePoints.push(a);
                }
            }
            resourcePoints.sort(function(a, b) {return b.energy - a.energy});
            if(creep.withdraw(resourcePoints[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(resourcePoints[0]);
            }
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.upgrading = true;
            }
        }
	}
};
