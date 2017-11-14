//var roleHarvester = require('role.harvester');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.transferStuff) {
            if(creep.carry.energy == 0) {
                creep.memory.transferStuff = false;
            }
            else {
                // check building
                var cSites = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                if(cSites) {
                    //cSites.sort(function(a, b) {return a.progress - b.progress});
                    if(creep.build(cSites) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(cSites);
                    }
                }
                else {
                    // check spawn and extension levels
                    var containers = creep.room.find(FIND_STRUCTURES, {
                                        filter: (s) => {
                                            return ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity);
                                        }
                    });
                    if(containers.length > 0) {
                        if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0]);
                        }
                    }
                }
            }
        }
        else {
            // We have no energy so get some
            if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.transferStuff = true;
            }
            else {
                var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(droppedEnergy) {
                    if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy);
                    }
                }
                else {
                    // builder's resource
                    var resourceNode = Game.getObjectById('59f1a42e82100e1594f3c9b1');
                    if(resourceNode) {
                        if(creep.harvest(resourceNode) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(resourceNode);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;

/*
    TODO:
        Build available construction sites
        Move energy from containers to extensions/spawn
        Keep tower full of energy -- harvesters are taking care of this for now until I change it
        Build roads when needed
*/

/*
    Example code:
     var cSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return (structure.const;
                    }
            });
*/