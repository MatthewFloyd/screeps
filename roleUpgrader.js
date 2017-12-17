/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleUpgrader');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
	    if(creep.memory.upgrading) {
	        let controller = Game.getObjectById(creep.room.memory.controller[0]);
	        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE)
	        {
	            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffaa00'}});
	        }
	        if(creep.carry.energy == 0)
	        {
	            creep.memory.upgrading = false;
	        }
        }
        else {
            let spawn = Game.getObjectById(creep.room.memory.spawns[0]);
	        let harvestSource = Game.getObjectById(creep.room.memory.sources[1]); // TODO fix this
	        var storagePoint = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0});
	        
	        if(storagePoint)
	        {
	            
	            var nearest = creep.pos.findClosestByRange(storagePoint);
                if(creep.withdraw(nearest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(nearest);
                }
	        }
	        else if(spawn.energy < 250)
	        {
	            var resourcePoints = [];
	            if(creep.room.memory.extensions)
                {
                    for(var e in creep.room.memory.extensions)
                    {
                        let a = Game.getObjectById(creep.room.memory.extensions[e]);
                        if(a.energy > 0)
                        {
                            resourcePoints.push(a);
                        }
                    }
                }
                if(resourcePoints.length > 0)
                {
                    if(creep.withdraw(resourcePoints[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(resourcePoints[0]);
                    }
                }
                else
                {
                    
                    if(storagePoint.length > 0)
                    {
                        
                    }
                    else
                    {
                        if(creep.harvest(harvestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(harvestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
	        }
	        else
	        {
                if(creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                
            }
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.upgrading = true;
            }
        }
	}
};

module.exports = roleUpgrader;