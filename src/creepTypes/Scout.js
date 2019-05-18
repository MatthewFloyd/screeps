var _ = require('lodash');
//var Miner = require('../creepTypes/Miner');
module.exports = {

    run: function(creep, hostileStruct, total) {
        // can assume we are in the correct room and interT is false and home is this room
        /*if(hostileStruct.length > 0) {
            var H = _.sortBy(hostileStruct, c => creep.pos.getRangeTo(c));
            //console.log(H[0]);
            //if(creep.attack(H[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(H[0]);
            //}
        }
        else if(creep.room.controller) {
            // a controller exists
            //console.log(creep.room.controller.sign);
            if(creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            else {
                var newDest = this.pickNewDest();
                creep.memory.home = newDest;
                creep.memory.interT = true;
            }
        }*/
        var cSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if(cSites.length <= -1) {
            var newDest = this.pickNewDest();
            creep.memory.home = newDest;
            creep.memory.interT = true;
        }
        //console.log(cSites[0]);
        //cSites = _.sortBy(this.cSites, c => creep.pos.getRangeTo(c));
        if(creep.memory.gathering) {
            if(total === creep.carryCapacity) {
                creep.memory.gathering = false;
            }
            const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            //var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if(target) {
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
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
            else if(!creep.room.storage) {
                if (creep.room.controller) {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    },
    pickNewDest() {
        // pick new room

        // temp for testing
        return 'W6N1';
    },
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
};

/*
this.cSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);
this.cSites = _.sortBy(this.cSites, c => creep.pos.getRangeTo(c));
if((this.repairSites.length > 0) &&
                this.repairSites[0].hits < (3*this.repairSites[0].hitsMax / 4)) {
                if(creep.repair(this.repairSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(this.repairSites[0]);
                }
            }
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
        }
    }

if(creep.room.controller) {
            // a controller exists
            //console.log(creep.room.controller.sign);
            if(creep.room.controller.sign == undefined || creep.room.controller.sign.username !== creep.owner.username) {
                if(creep.signController(creep.room.controller, "Territory of " + creep.owner.username) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
 */