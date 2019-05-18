var _ = require('lodash');

module.exports = {

    run: function(creep, source, controller, total) {
        if(creep.memory.gathering) {
            if(total === creep.carryCapacity) {
                creep.memory.gathering = false;
            }
            if(source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
        else {
            if(total == 0) {
                creep.memory.gathering = true;
            }
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            containers = _.filter(containers, (c) => c.store[RESOURCE_ENERGY] < c.storeCapacity);
            if(containers.length > 0) {
                var C = creep.pos.findClosestByRange(containers);
                if (creep.transfer(C, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(C);
                }
            }
            else {
                // if no container space to put energy in
                if(!creep.room.storage) {
                    if (controller) {
                        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller);
                        }
                    }
                }
                else if(creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.storeCapacity / 32) {
                    if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }
                }
                else {
                    if (controller) {
                        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller);
                        }
                    }
                }
            }
        }
    }

};