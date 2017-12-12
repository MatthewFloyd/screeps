/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawnManager');
 * mod.thing == 'a thing'; // true
 */
 
 var roleHarvester = require('roleHarvester');
 var roleUpgrader = require('roleUpgrader');
 var roleBuilder = require('roleBuilder');
 var roleShifter = require('roleShifter');
 var roleRepairer = require('roleRepairer');
 var roleScout = require('roleScout');
 
 var spawnManager = {
     
     R: '',
     C: '',
     S: '',
     jobMakers: [],
     /** @param {room} room **/
     run: function(room) {
         
         this.R = Game.rooms[room];
         if(this.R.memory.spawns != undefined)
         {
         this.C = this.R.find(FIND_MY_CREEPS);
         this.jobMakers = this.R.find(FIND_STRUCTURES, {
             filter: (s) => {return s.structureType == STRUCTURE_CONTAINER}
         });
         if(this.jobMakers[0] == undefined)
         {
             this.jobMakers = [];
         }
         var repairJobs = this.jobMakers.sort(function(a, b) {
             return a.hits - b.hits
         });
         /*if(repairJobs.length > 0 && repairJobs[0].hits < (4 * repairJobs[0].hitsMax) / 5)
         {
            repairJobs = repairJobs[0];
         }
         else
         {
             repairJobs = [];
         }*/
         // TODO:
         //     Make creeps as large as able.
         //     Make harvesters not get carry parts when there is at least one container in the room. 
         //     Also, replace missing carry part with a work part and drop down to one move part.         
         //
         
         var spawn = Game.getObjectById(this.R.memory.spawns[0]); // TODO: Work for multiple spawns
         this.S = spawn;
         var harvesters = _.filter(this.C, (creep) => creep.memory.role == 'harvester');
         var upgraders = _.filter(this.C, (creep) => creep.memory.role == 'upgrader');
         var builders = _.filter(this.C, (creep) => creep.memory.role == 'builder');
         var shifters = _.filter(this.C, (creep) => creep.memory.role == 'shifter');
         var repairers = _.filter(this.C, (creep) => creep.memory.role == 'repairer');
         var scouts = _.filter(this.C, (creep) => creep.memory.role == 'scout');
         
         let cJobs = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES);
         
         if(this.S.hits <this.S.hitsMax / 2)
         {
             this.R.controller.activateSafeMode;
             console.log("Safe mode has been activated in room " + this.R.name + "!!!");
         }
         
         
         if (harvesters.length < 4)
         {
            var harvestSource = this.R.memory.sources;
            //if(this.jobMakers.length < 1)
            //{
                if(harvestSource == undefined)
                {
                    harvestSource = harvestSource[0];
                }
                else
                {
                    if(Game.time % 2 == 0)
                    {
                        harvestSource = harvestSource[0];
                    }
                    else
                    {
                        harvestSource = harvestSource[1];
                    }
                }
            //}
            /*else
            {
                var temp = [];
                for(var s in harvestSource)
                {
                    let a = Game.getObjectById(harvestSource[s]);
                    for(var c in this.jobMakers)
                    {
                        if(this.jobMakers[c].store[RESOURCE_ENERGY] < this.jobMakers[c].storeCapacity && a.pos.isNearTo(this.jobMakers[c]))
                        {
                            temp = harvestSource[s];
                        }
                        else
                        {
                            temp = harvestSource[0];
                        }
                    }
                }
                harvestSource = temp;
            }*/
            var newName = 'Harvester' + Game.time % 1000;
            if(spawn.spawnCreep(this.creepParts('harvester'), newName, {memory: {role: 'harvester', s: harvestSource, upgrading: false}}) == 0) {
                console.log('Spawning new harvester: ' + newName + " in room " + this.R.name);
            }
         }
         else if (upgraders.length < 4)
         {
            var newName = 'Upgrader' + Game.time % 1000;
            if(spawn.spawnCreep(this.creepParts('upgrader'), newName, {memory: {role: 'upgrader', upgrading: false}}) == 0) {
                console.log('Spawning new upgrader: ' + newName + " in room " + this.R.name);
            }
         }
         else if(repairers.length < 1)
         {
             this.createCustomCreep('repairer', spawn);
         }
         else if(this.jobMakers.length > 0 && shifters.length < this.jobMakers.length * 2)
         {
             this.createCustomCreep('shifter', spawn);
         }
         else if (cJobs.length > 0 && builders.length < 2)
         {
             this.createCustomCreep('builder', spawn);
         }
         /*if(Memory.danger[0] == undefined && scouts.length < 1)
         {
             this.createCustomCreep('scout', spawn);
         }*/
         for(var name in this.C)
         {
            let c = this.C[name];
            if(c.memory.role == 'harvester') {
                roleHarvester.run(c);
            }
            else if(c.memory.role == 'upgrader') {
                roleUpgrader.run(c);
            }
            else if(c.memory.role == 'builder') {
                roleBuilder.run(c);
            }
            else if(c.memory.role == 'shifter') {
                roleShifter.run(c);
            }
            else if (c.memory.role == 'repairer') {
                roleRepairer.run(c);
            }
            else {
                console.log("Creep name: " + c.name + " doesn't have a role!");
            }
         }
         }
     },
     
     createCustomCreep: function(creepType, spawn) {
         var newName = creepType + Game.time % 1000;
         if(spawn.spawnCreep(this.creepParts(creepType), newName, {memory: {role: creepType, upgrading: false}}) == 0) { // Will want to change setup in the future
            console.log('Spawning new ' + creepType + ': ' + newName + " in room " + this.R.name);
         }
     },
     
     creepParts: function(creepType) {
         var parts = [];
         var exempt = '';
         switch (creepType) {
             case 'builder':
                 parts =  [WORK,CARRY,CARRY,MOVE];
                 break;
             case 'shifter':
                 parts = [CARRY,CARRY,MOVE,MOVE];
                 break;
             case 'scout':
                 parts = [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK];
                 return parts;
                 break;
             case 'repairer':
                 parts = [WORK,CARRY,CARRY,MOVE,MOVE];
                 return parts;
                 break;
             case 'upgrader':
                 parts = [WORK,CARRY,CARRY,MOVE,MOVE];
             default:
                parts = [WORK,CARRY,MOVE,WORK];
         }
         var e = this.R.energyAvailable;
         for(var part in parts)
         {
             e -= BODYPART_COST[parts[part]];
         }
         for(var part in parts)
         {
             if(BODYPART_COST[parts[part]] <= e && parts[part] != exempt)
             {
                 parts.push(parts[part]);
                 e -= BODYPART_COST[parts[part]];
             }
         }
         return parts;
     }
 }

module.exports = spawnManager;
