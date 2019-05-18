var _ = require('lodash');

module.exports = {

    run: function(creep, source, total, cSites, wallandRamp) {
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
            if(cSites[0]) {
                if (creep.build(cSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(cSites[0]);
                }
            }
            else if(wallandRamp[0]) {
                if(creep.repair(wallandRamp[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(wallandRamp[0]);
                }
            }
        }
    }
};