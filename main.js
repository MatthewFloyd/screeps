"use strict";

var setup = require('setup');
var spawnRequest = require('spawnRequest');
var genericCreep = require('genericCreep');

module.exports.loop = function () {

    // Delete old creeps
    for(var name in Memory.creeps)
    {
        if(!Game.creeps[name]) { // check existence
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(var room in Game.rooms)
    {
        if(!Game.rooms[room].memory)
        {
            Game.rooms[room] = [];
        }
        // Check memory object is proper
        if(Game.rooms[room].memory.setup === (undefined && Game.rooms[room].memory.setup === null))
        {
            // undefined memory
            if(Game.rooms[room].controller === undefined)
            {
                // room has no controller
                setup.run(Game.rooms[room], -1);
                Game.rooms[room].memory.setup = 0;
            }
            else
            {
                setup.run(Game.rooms[room], 1);
            }
        }
        else if(Game.rooms[room].memory.setup < Game.rooms[room].controller.level)
        {
            // room has controller and setup is under level
            if(Game.rooms[room].my) // check run setup and make sure I own it.
            {
                var finished = setup.run(Game.rooms[room], Game.rooms[room].controller.level);
                if(finished)
                {
                    Game.rooms[room].memory.setup = Game.rooms[room].controller.level;
                }
            }
        }
        //setup.run(Game.rooms[room], 1); // temp

        if(Game.rooms[room].memory.setup >= 0 && Game.rooms[room].controller.my) // check the queue for spawn requests
        {
            // temp delete later but this is to get started
            if(Game.creeps.length < 1 || (!Game.creeps.length))
            {
                if(Game.rooms[room].controller.my && Game.rooms[room].memory.spawnqueue.length === 0)
                {
                    Game.rooms[room].memory.spawnqueue.push("harvester");
                }
            }
            // We have at least a basic setup and we control the room
            var queue = Game.rooms[room].memory.spawnqueue;
            // check queue for spawn requests
            if(queue.length && Game.creeps.length < 5) // temp fix until queuepop bug is fixed
            {   // TODO: refactor for multiple spawns
                var valid = spawnRequest.run(Game.rooms[room], queue[0]);
                if(valid)
                {
                    queue.pop(); // take the top request off the queue
                }
            }
        }
    }

    // finally run all the creeps that we own
    for(var creep in Game.creeps)
    {
        if(!Game.creeps[creep].spawning) // not spawning so do stuff
        {
            if(Game.creeps[creep].memory.travel)
            { // if it's going somewhere just moveTo that roomPosition after checking if it made it
                var XYR = Game.creeps[creep].memory.travelDest.split(" "); // [0] = x, [1] = y, [2] = room
                const pos = new RoomPosition(XYR[0], XYR[1], XYR[2]);
                if(Game.creeps[creep].pos.isNearTo(pos)) // we are at the destination
                {
                    Game.creeps[creep].memory.travel = false;
                }
                else // not there yet
                {
                    Game.creeps[creep].moveTo(pos);
                }
            }
            else
            {
                genericCreep.run(Game.creeps[creep]);
            }

            if(Game.creeps[creep].ticksToLive <= 1)// going to die: do clean up before memory death
            {
                if(Game.creeps[creep].memory.sourceId) // check if it was harvesting
                {
                    var workCount = 0;
                    for(var part in Game.creeps[creep].body)
                    {
                        if(part.type === WORK)
                        {
                            workCount += 1;
                        }
                    }
                    Game.creeps[creep].room.memory.sources[Game.creeps[creep].memory.sourceId + 1] -= workCount;
                }
            }
        }
    }
};
