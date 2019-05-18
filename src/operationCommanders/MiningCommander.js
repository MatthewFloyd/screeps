var _ = require('lodash');
var Miner = require('../creepTypes/Miner');

class MiningCommander {
    constructor(room) {
        this.room = room;
        this.miningPowerNeeded = 0;
        this.room = room;
        this.miners = _.filter(this.room.creeps, {memory: {role: 'harvester'}});
        this.calcMiningPower();
        this.runMiners();
    }
    calcMiningPower() {
        var total = 0;
        _.forEach(this.miners, miner => {
            total += miner.getActiveBodyparts(WORK);
        });
        this.miningPowerNeeded = 15 - total;
        // (this.room.sources.length * 5)
        return this.miningPowerNeeded;

    }
    runMiners() {
        for(var c in this.miners) {
            var creep = this.miners[c];
            var source = Game.getObjectById(creep.memory.source);
            const controller = this.room.controller;
            const total = creep.carry[RESOURCE_ENERGY];

            Miner.run(creep, source, controller, total);
        }
    }
}
module.exports = MiningCommander;