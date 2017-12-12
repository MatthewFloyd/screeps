/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleBuilder');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require('roleHarvester');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
	    if(creep.memory.upgrading) {
	        let cSites = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
	        if(cSites) {
	            if(creep.build(cSites) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(cSites);
	            }
	        }
	        else
	        {
	            roleHarvester.run(creep);
	        }
	        if(creep.carry.energy == 0)
	        {
	            creep.memory.upgrading = false;
	        }
	    }
	    else
	    {
	        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)
            });
            if(container == undefined)
            {
                let resourcePoints = [];
                for(var spawn in creep.room.memory.spawns)
                {
                    let s = Game.getObjectById(creep.room.memory.spawns[spawn]);
                    if(s.energy > 250)
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
            }
            else
            {
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(container);
                }
            }
            
            if(creep.carry.energy == creep.carryCapacity)
	        {
	            creep.memory.upgrading = true;
	        }
	    }
	}
};

module.exports = roleBuilder;
