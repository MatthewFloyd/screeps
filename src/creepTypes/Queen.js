var _ = require('lodash');

module.exports = {

    /*
        Should only be used at LVL 3 when a storage is available
        {role: 'queen', gathering: true, home: this.room.name}
     */
    run: function(creep, extensions, total, refillTowers) {
        if(creep.memory.gathering) {
            if(total === creep.carryCapacity) {
                creep.memory.gathering = false;
            }
            /*if(creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.storeCapacity / 8) {
                creep.memory.gatherFrom = 'container';
            }*/
            else if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        else {
            if(total == 0) {
                creep.memory.gathering = true;
            }
            if(extensions.length > 0) {
                var E = _.sortBy(extensions, c => creep.pos.getRangeTo(c));
                if (creep.transfer(E[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(E[0]);
                }
            }
            else if(creep.room.spawns[0].energy < creep.room.spawns[0].energyCapacity) {
                if (creep.transfer(creep.room.spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.spawns[0]);
                }
            }
            else if(refillTowers.length > 0 && refillTowers[0].energy < refillTowers[0].energyCapacity) {
                if(creep.transfer(refillTowers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(refillTowers[0]);
                }
                /*else if(creep.transfer(refillTowers[0], RESOURCE_ENERGY) !== OK) {
                    creep.memory.gatherFrom = 'container';
                }*/
            }
        }
    }
};