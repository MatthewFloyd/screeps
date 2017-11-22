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
 
 var spawnManager = {
     
     R: '',
     C: '',
     S: '',
     containers: [],
     /** @param {room} room **/
     run: function(room) {
         
         this.R = Game.rooms[room];
         this.C = this.R.find(FIND_MY_CREEPS);
         this.containers = this.R.find(FIND_STRUCTURES, {
             filter: (s) => {return s.structureType == STRUCTURE_CONTAINER}
         });
         
         
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
         
         let cJobs = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES);
         
         if (harvesters.length < 3)
         {
            var harvestSource = this.R.memory.sources;
            if(this.containers == undefined)
            {
                if(harvestSource == undefined)
                {
                    harvestSource = harvestSource[0];
                }
                else
                {
                    if(harvesters.length % 2 == 0)
                    {
                        harvestSource = harvestSource[0];
                    }
                    else
                    {
                        harvestSource = harvestSource[1];
                    }
                }
            }
            else
            {
                var temp = [];
                for(var s in harvestSource)
                {
                    let a = Game.getObjectById(harvestSource[s]);
                    for(var c in this.containers)
                    {
                        if(this.containers[c].store[RESOURCE_ENERGY] < this.containers[c].storeCapacity && a.pos.isNearTo(this.containers[c]))
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
            }
            var newName = 'Harvester' + Game.time;
            if(spawn.spawnCreep(this.creepParts('harvester'), newName, {memory: {role: 'harvester', s: harvestSource}}) == 0) {
                console.log('Spawning new harvester: ' + newName);
            }
         }
         else if (upgraders.length < 3)
         {
            var newName = 'Upgrader' + Game.time;
            if(spawn.spawnCreep(this.creepParts('upgrader'), newName, {memory: {role: 'upgrader', upgrading: false}}) == 0) {
                console.log('Spawning new upgrader: ' + newName);
            }
         }
         else if(this.containers.length > 0 && shifters.length < this.containers.length * 2)
         {
             this.createCustomCreep('shifter', spawn);
         }
         else if (cJobs.length > 0 && builders.length < 2)
         {
             this.createCustomCreep('builder', spawn);
         }
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
            else {
                console.log("Creep name: " + c.name + " doesn't have a role!");
            }
         }
     },
     
     createCustomCreep: function(creepType, spawn) {
         var newName = creepType + Game.time;
         if(spawn.spawnCreep(this.creepParts(creepType), newName, {memory: {role: creepType, upgrading: false}}) == 0) { // Will want to change setup in the future
            console.log('Spawning new ' + creepType + ': ' + newName);
         }
     },
     
     creepParts: function(creepType) {
         var parts = [];
         switch (creepType) {
             case 'builder':
                 parts =  [WORK,CARRY,CARRY,MOVE,MOVE];
                 break;
             case 'shifter':
                 parts = [CARRY,CARRY,MOVE,MOVE];
                 break;
             case 'scout':
                 parts = [TOUGH,MOVE,ATTACK];
                 return parts; // Don't want to make the best possible, want it to be cheap.
                 break;
             default:
                parts = [WORK,CARRY,MOVE];
         }
         var e = this.R.energyAvailable;
         for(var part in parts)
         {
             if(BODYPART_COST[parts[part]] <= e)
             {
                 parts.push(parts[part]);
                 e -= BODYPART_COST[parts[part]];
             }
         }
         
         return parts;
     }
 }

module.exports = spawnManager;
