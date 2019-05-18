'use_strict';
var _ = require('lodash');
const MiningCommander = require('./operationCommanders/MiningCommander');
const LogisticsCommander = require('./operationCommanders/LogisticsCommander');
const TravelCommander = require('./operationCommanders/TravelCommander');
const SpawnManager = require('./operationCommanders/SpawnManager');
const AttackCommander = require('./operationCommanders/AttackCommander');
var Tower = require('./Tower');
var Scout = require('./creepTypes/Scout');

class Overseer {
    constructor(room) {
        this.room = room;
        this.allStructs = this.room.find(FIND_STRUCTURES);
        this.myStructs = this.room.find(FIND_MY_STRUCTURES);
        this.cSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);
        // repairSites broken
        this.repairSites = this.allStructs.filter(s => s.hits < s.hitsMax &&
                                        (s.structureType !== STRUCTURE_WALL || s.structureType !== STRUCTURE_RAMPART));
        this.wallandRamp = this.allStructs.filter(s => s.hits < 10000 &&
                                        (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART));
        this.containers = this.allStructs.filter(s => s.structureType === STRUCTURE_CONTAINER);
        this.emptyExtensions = [];
        this.myTowers = this.myStructs.filter(s => s.structureType === STRUCTURE_TOWER);
        this.travelers = _.filter(this.room.creeps, (c) => c.memory.interT === true);
        this.scouts = _.filter(room.creeps, {memory: {role: 'scout', interT: false}});
        this.attackSquad = _.filter(room.creeps, {memory: {role: 'attackSquad', interT: false}});
        if(this.room.my) {
            this.emptyExtensions = this.myStructs.filter(s => s.structureType === STRUCTURE_EXTENSION &&
                s.energy < s.energyCapacity);
        }
        this.homeLink = this.findHomeLink();
        this.controllerLink = this.findControllerLink();
        //console.log(this.homeLink + " is the homeLink");
        //console.log(this.controllerLink + " is the controllerLink");
        this.initCommanders();
    }
    initCommanders() {
        //console.log(this.homeLink + " room: " + this.room.print);
        //console.log(this.homeLink.energyCapacity);
        if(this.homeLink !== undefined) {
            if (this.homeLink.energy < this.homeLink.energyCapacity) {
                this.emptyExtensions.push(this.homeLink);
            }
            else if (this.homeLink.cooldown === 0 && this.controllerLink.energy === 0) {
                this.homeLink.transferEnergy(this.controllerLink);
            }
        }

        let MC = new MiningCommander(this.room);
        let SM = new SpawnManager(this.room);
        let LC = new LogisticsCommander(this.room, this.emptyExtensions, this.containers,
                                        this.cSites, this.repairSites, this.myTowers, this.controllerLink,
                                        this.wallandRamp);
        if(this.travelers.length > 0) {
            let TC = new TravelCommander(this.room, this.travelers);
        }
        if(this.attackSquad.length > 0) {
            let AC = new AttackCommander(this.room, this.attackSquad);
        }

        //console.log(this.repairSites);
        //if(this.room.hostiles.length <= 0) {
            // peacetime tower controls
            if(this.myTowers.length > 0) {
                for (var y in this.myTowers) {
                    Tower.run(this.myTowers[y], this.repairSites);
                }
            }
        //}
        //else {
            // wartime tower controls
        //}
        if(this.scouts.length > 0) {
            var hostileStruct = this.room.find(FIND_HOSTILE_STRUCTURES);

            for(var c in this.scouts) {
                var creep = this.scouts[c];
                const total = creep.carry[RESOURCE_ENERGY];
                Scout.run(creep, hostileStruct, total);
            }
        }

        // Decide what is most needed to spawn this tick
        if(this.room.my && this.room.spawns.length > 0) {
            var spawn1 = this.room.spawns[0];
            if(!spawn1.Spawning) {
                // can spawn something this tick
                var harvesterWorkNeeded = MC.miningPowerNeeded; // Mining power needed
                var buildWorkNeeded = 0;
                for(var x in this.cSites) {
                    buildWorkNeeded += this.cSites[x].progressTotal;
                }
                buildWorkNeeded = Math.ceil((buildWorkNeeded / 3000) - LC.buildPower); // Building power needed
                if(buildWorkNeeded > 8) { buildWorkNeeded = 8; }
                if(buildWorkNeeded > 1 && !this.room.storage) { buildWorkNeeded = 1; }
                if(LC.builders.length > 3) { buildWorkNeeded = 0; }
                var shifterPowerNeeded = 0;
                if(this.room.storage) {
                    if(this.room.storage.store[RESOURCE_ENERGY] > 0) {
                        shifterPowerNeeded += 1;
                    }
                }
                if(this.room.storage && this.containers.length > 0) {
                    shifterPowerNeeded += this.containers.length;
                    //if(shifterPowerNeeded > 1) { shifterPowerNeeded--; }

                }
                shifterPowerNeeded -= LC.shifters.length;
                var UrgentRepair = this.repairSites.filter(s => s.hits < (3*s.hitsMax / 4));

                var repairPowerNeeded = 0;
                if(UrgentRepair.length > 0) {
                    repairPowerNeeded += 1;
                }
                repairPowerNeeded -= LC.repairers.length;
                var upgradersNeeded = 0;
                if(this.room.storage) {
                    upgradersNeeded = 2;
                }
                if(this.room.controller.level === 8) {
                    upgradersNeeded = 1;
                }
                if(this.room.storage) {
                    if(this.room.storage.store[RESOURCE_ENERGY] > this.room.storage.storeCapacity / 3 &&
                        this.room.controller.level < 8) {
                        upgradersNeeded += 6;
                    }
                }
                upgradersNeeded -= LC.upgraders.length;
                var queensNeeded = 1;
                if(this.room.controller.level >= 7) {
                    queensNeeded += 1;
                }
                queensNeeded -= LC.queens.length;
                /*
                console.log(MC.miners.length + " miner length");
                console.log(shifterPowerNeeded + " shifter power needed");
                console.log(buildWorkNeeded + " builder power needed");
                console.log(harvesterWorkNeeded + " harvester power needed");
                console.log(repairPowerNeeded + " repair power needed");
                */
                /*if(this.room.name === 'W8N3') {
                    SM.spawnNewCreep(spawn1, 'attackSquad', -1); // the kill jaden button
                }*/
                //SM.spawnNewCreep(spawn1, 'scout', 5);


                // Decisions...
                /*
                if(this.room.name === 'W6N1') {
                    console.log(MC.miners.length);
                }*/

                if(MC.miners.length < 2) {
                    // spawn a miner spawnNewCreep(spawn, type, amountNeeded)
                    SM.spawnNewCreep(spawn1, 'harvester', 1);
                }
                else if(queensNeeded > 0 && this.room.storage) {
                    SM.spawnNewCreep(spawn1, 'queen', queensNeeded);
                }
                else if(LC.shifters.length < 1 && this.room.storage) {
                    SM.spawnNewCreep(spawn1, 'shifter', 1);
                }
                else if(this.room.hostiles.length <= 0) {
                    if(shifterPowerNeeded > 0) {
                        // spawn a shifter
                        SM.spawnNewCreep(spawn1, 'shifter', shifterPowerNeeded);
                    }
                    else if(upgradersNeeded > 0) {
                        SM.spawnNewCreep(spawn1, 'upgrader', -1);
                    }
                    else if(buildWorkNeeded > 0) {
                        // spawn a builder
                        SM.spawnNewCreep(spawn1, 'builder', buildWorkNeeded);
                    }
                    else if(repairPowerNeeded > 0) {
                        // spawn a repairer
                        SM.spawnNewCreep(spawn1, 'repairer', repairPowerNeeded);
                    }
                    else if(harvesterWorkNeeded > 0) {
                        // spawn a miner
                        SM.spawnNewCreep(spawn1, 'harvester', harvesterWorkNeeded);
                    }
                }
                else {
                    /*
                    // We have bad guys in the room!
                    // Decide if it is a player or Invader
                    var playerHostiles = this.room.hostiles;
                    playerHostiles = playerHostiles.filter((c) => c.owner.username !== "Invader");
                    // make defenders

                    var scaryParts = 0;
                    for(var x in playerHostiles) {
                        scaryParts += playerHostiles[x].getActiveBodyparts(ATTACK);
                        scaryParts += playerHostiles[x].getActiveBodyparts(HEAL);
                        scaryParts += playerHostiles[x].getActiveBodyparts(WORK);
                    }
                    scaryParts /= 5;
                    scaryParts -= DC.defenders.length;
                    SM.spawnNewCreep(spawn1, 'defender', scaryParts);
                     */
                }
            }
        }
    }
    findHomeLink() { // return home link

        if(this.room.spawns.length > 0) {
            var homeLink = this.room.spawns[0].pos.findInRange(FIND_MY_STRUCTURES, 5);
            homeLink = homeLink.filter((s) => s.structureType === STRUCTURE_LINK);
            if (homeLink.length > 0) {
                return homeLink[0];
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }
    findControllerLink() { // return controller link
        var controllerLink = this.room.controller.pos.findInRange(FIND_MY_STRUCTURES, 2);
        controllerLink = controllerLink.filter((s) => s.structureType === STRUCTURE_LINK);
        if(controllerLink.length > 0) {
            return controllerLink[0];
        }
        else {
            return undefined;
        }
    }
}
module.exports = Overseer;