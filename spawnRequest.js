"use strict";

var sourceAssign = require('sourceAssign');

var spawner;
var Room;
var spawnRequest = {

    run: function(room, creepType)
    {
        Room = room;
        var S = room.memory.spawns[0];
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
                // generic small creep used for emergency or super low level
                    this.genericSpawn(this.caclParts(room, creepType));
                    break;
                // generic builder: used at level 1 or in case of emergency
            }
        }
        return false;
    },
    genericSpawn: function(creepParts)
    {
        if(!spawner.spawning) // Not already spawning something
        {//{memory: {role: 'harvester', s: harvestSource, upgrading: false}}
            var Rnum = Game.time % 100;
            if(sourceAssign.check(Room, creepParts.length) !== -1) {
                var Sid = sourceAssign.check(Room, creepParts.length);
                var source = Game.getObjectById(Sid);
                var sourcePos = source.pos;
                var travelDest = sourcePos.x + " " + sourcePos.y + " " + source.room.name;
                if(spawner.spawnCreep(creepParts, 'Gen' + Rnum, {
                    memory: {
                        home: Room.id,
                        role: 'generic'
                        sourceId: Sid,
                        travel: true,
                        travelDest: travelDest
                    }
                }) === 0) // good spawn
                {
                    return true;
                }
            }
        }
    },
    harvesterSpawn: function(creepParts)
    {
        if(!spawner.spawning) // Not already spawning something
        {//{memory: {role: 'harvester', s: harvestSource, upgrading: false}}
            var Rnum = Game.time % 100;
            if(sourceAssign.check(Room, creepParts.length) !== -1) {
                var Sid = sourceAssign.check(Room, creepParts.length);
                var source = Game.getObjectById(Sid);
                var sourcePos = source.pos;
                var travelDest = sourcePos.x + " " + sourcePos.y + " " + source.room.name;
                if(spawner.spawnCreep(creepParts, 'Harvester' + Rnum, {
                    memory: {
                        home: Room.id,
                        role: 'harvester'
                        sourceId: Sid,
                        travel: true,
                        travelDest: travelDest
                    }
                }) === 0) // good spawn
                {
                    return true;
                }
            }
        }
    },
    calcParts: function(room, creepType)
    {
        // TODO: change other than this basic one
        return [WORK, CARRY, MOVE];
    }
};


module.exports = spawnRequest;
