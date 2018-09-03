"use strict";

var spawner;
var Room;
var spawnRequest = {

    run: function(room, creepType)
    {
        Room = room;
        var S = Object.keys(room.memory.spawns)[0];
        spawner = Game.getObjectById(S);
        if(spawner !== undefined)
        {
            // we have a spawner
            switch(creepType)
            {
                case "harvester":
                    this.harvesterSpawn(this.calcParts(room, creepType));
                    break;
                case "upgrader":

                    break;
                default:
                    // generic builder: used at level 1 or in case of emergency
            }
        }
    },
    harvesterSpawn: function(creepParts)
    {
        if(!spawner.spawning) // Not already spawning something
        {//{memory: {role: 'harvester', s: harvestSource, upgrading: false}}
            var Rnum = Game.time % 100;
            spawner.spawnCreep(creepParts, 'Harvester' + Rnum, {
                memory: {
                    // TODO seperate module with source assigner
                }
            })
        }
    },
    calcParts: function(room, creepType)
    {
        // TODO: change other than this basic one
        return [WORK, CARRY, MOVE];
    }
};


module.exports = spawnRequest;