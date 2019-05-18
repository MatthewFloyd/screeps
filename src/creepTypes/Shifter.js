var _ = require('lodash');

module.exports = {

    /*
        Should only be used at LVL 3 when a storage is available
        {role: 'shifter', gathering: true, gatherFrom: this.room.storage.id, home: this.room.name}
     */
    run: function(creep, containers, total, refillTowers) {
        if(creep.memory.gathering) {
            if(total === creep.carryCapacity) {
                creep.memory.gathering = false;
            }
            if(containers.length > 0) {
                var C = _.sortBy(containers, c => c.store[RESOURCE_ENERGY]);
                if (C[C.length - 1].store[RESOURCE_ENERGY] > 0) {
                    if (creep.withdraw(C[C.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(C[C.length - 1]);
                    }
                }
            }
            else {
                var energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 4);
                if(energy.length) {
                    if(creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy[0]);
                    }
                }
            }
        }
        else {
            if(total == 0) {
                creep.memory.gathering = true;
            }
            // Look for storage to put in energy
            const storageSpace = _.sum(creep.room.storage.store);
            if(storageSpace < creep.room.storage.storeCapacity) {
                if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
    }
};