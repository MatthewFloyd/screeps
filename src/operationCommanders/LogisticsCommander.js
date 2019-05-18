var _ = require('lodash');
var Shifter = require('../creepTypes/Shifter');
var Builder = require('../creepTypes/Builder');
var Queen = require('../creepTypes/Queen');

class LogisticsCommander {
    constructor(room, emptyExtensions, containers, cSites, repairSites, myTowers, controllerLink, wallandRamp) {
        this.room = room;
        this.buildPower = 0;
        this.builders = _.filter(room.creeps, {memory: {role: 'builder', interT: false}});
        this.repairers = _.filter(room.creeps, {memory: {role: 'repairer', interT: false}});
        this.shifters = _.filter(room.creeps, {memory: {role: 'shifter', interT: false}});
        this.upgraders = _.filter(room.creeps, {memory: {role: 'upgrader', interT: false}});
        this.queens = _.filter(room.creeps, {memory: {role: 'queen', interT: false}});
        this.emptyExtensions = emptyExtensions;
        this.containers = containers;
        this.cSites = cSites;
        this.repairSites = repairSites;
        this.myTowers = myTowers;
        this.controllerLink = controllerLink;
        this.wallandRamp = wallandRamp;
        this.refillTowers = _.filter(this.myTowers, c => c.energy < c.energyCapacity);
        if(this.room.my) {
            this.calcBuildPower();
            this.roomPlanner(this.room.controller.level);
            if(this.builders.length > 0) { this.runBuilders(); }
            if(this.repairers.length > 0) { this.runRepairers(); }
            if(this.shifters.length > 0) { this.runShifters(); }
            if(this.upgraders.length > 0) { this.runUpgraders(); }
            if(this.queens.length > 0) { this.runQueens(); }
        }
    }
    calcBuildPower() {
        this.buildPower = this.builders.length;
    }
    runUpgraders() {
        for(var c in this.upgraders) {
            var creep = this.upgraders[c];
            var link = this.controllerLink;
            const controller = this.room.controller;
            const total = creep.carry[RESOURCE_ENERGY];

            if(creep.memory.gathering) {
                if(total === creep.carryCapacity) {
                    creep.memory.gathering = false;
                }
                if(link) {
                    if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link);
                    }
                }
                else {
                    // We are pre link phase so retrieve from storage
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }
                }
            }
            else {
                if(total == 0) {
                    creep.memory.gathering = true;
                }
                if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        }
    }

    runBuilders() {

        for(var c in this.builders) {
            var creep = this.builders[c];
            var source = Game.getObjectById(creep.memory.source);
            const total = creep.carry[RESOURCE_ENERGY];
            this.cSites = _.sortBy(this.cSites, c => creep.pos.getRangeTo(c));
            this.wallandRamp = _.sortBy(this.wallandRamp, c => creep.pos.getRangeTo(c));
            //console.log(this.cSites.length);
            Builder.run(creep, source, total, this.cSites, this.wallandRamp);

        }
    }
    runShifters() {

        for(var c in this.shifters) {
            var creep = this.shifters[c];
            const total = creep.carry[RESOURCE_ENERGY];

            Shifter.run(creep, this.containers, total, this.refillTowers);
        }
    }
    runQueens() {

        for(var c in this.queens) {
            var creep = this.queens[c];
            const total = creep.carry[RESOURCE_ENERGY];

            Queen.run(creep, this.emptyExtensions, total, this.refillTowers);
        }
    }
    runRepairers() {
        //this.repairSites = _.sortBy(this.repairSites, c => c.hits);
        for(var c in this.repairers) {
            var creep = this.repairers[c];
            var source = Game.getObjectById(creep.memory.source);
            const controller = this.room.controller;
            const total = creep.carry[RESOURCE_ENERGY];

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

                if(this.repairSites.length > 0 &&
                    this.repairSites[this.repairSites.length-1].hits < this.repairSites[this.repairSites.length-1].hitsMax) {
                    if(creep.repair(this.repairSites[this.repairSites.length-1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(this.repairSites[this.repairSites.length-1]);
                    }
                }
            }
        }
    }

    roomPlanner(roomLvl) {
        if(!this.room.memory.planning) {
            this.room.memory.planning = 0;
        }
        if(roomLvl == 1) {
            // do nothing as we are too low level to be useful
            return 0;
        }
        else if(roomLvl == 2) {
            // lets make a path between each source and the controller and put
            // construction sites on it then spawn some builders until there are no more construction sites

            // First: get the paths
            // Second: place the construction sites
            // Third: builders should autospawn when it sees construction sites
            if(this.room.memory.planning < roomLvl) {
                let paths = [];
                let options = this.room.memory.sourceIds;
                for (var option in options) {
                    var source = Game.getObjectById(options[option]);
                    var myPath = this.room.findPath(source.pos, this.room.controller.pos);
                    paths.push(myPath);
                }
                var clear = true;
                var cSiteCount = 0;
                for(var a in paths) {
                    var pathData = paths[a];
                    for(var b in pathData) {
                        console.log(pathData[b].x + " " + pathData[b].y);

                        if(this.room.createConstructionSite(pathData[b].x, pathData[b].y, STRUCTURE_ROAD
                                , { ignoreCreeps: true, ignoreRoads: true }) === OK) {
                            cSiteCount += 1;
                            console.log("Added construction site: " + b);
                        }
                        if(cSiteCount < pathData.length) { // Missed some construction sites
                            console.log("Didn't finish construction sites yet!");
                            clear = false;
                        }
                    }
                }
                if(clear) { // all done
                    this.room.memory.planning = roomLvl;
                }
            }
        }
    }
}
module.exports = LogisticsCommander;