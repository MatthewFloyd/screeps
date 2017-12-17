/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleHarvester');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /*
        let cSiteAtPos = creep.pos.lookFor(LOOK_STRUCTURES, 
                            {filter: (s) => s.structureType == STRUCTURE_ROAD});
        if(cSiteAtPos == "")
        {
            creep.pos.createConstructionSite(STRUCTURE_ROAD);
        }
        */
	    if(creep.memory.upgrading == false) {
            let harvestSource = Game.getObjectById(creep.memory.s);
            if(creep.harvest(harvestSource) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(harvestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.upgrading = true;
            }
        }
        else {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity
            });
            if(container == undefined)
            {
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
                //console.log(resourcePoints[0] + " " + resourcePoints[0].energy);
                if(creep.transfer(resourcePoints[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(resourcePoints[0]);
                }
            }
            else
            {
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(container);
                }
            }
            if(creep.carry.energy == 0)
            {
                creep.memory.upgrading = false;
            }
            
        }
	}
};

module.exports = roleHarvester;