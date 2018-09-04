"use strict";

var setup = require('setup');
var spawnRequest = require('spawnRequest');

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
        // Check memory object is proper
        if(room.memory.setup === (undefined && room.memory.setup === null))
        {
            // undefined memory
            if(room.controller === undefined)
            {
                // room has no controller
                setup.run(room, -1);
                room.memory.setup = 0;
            }
            else
            {
                setup.run(room, 1);
            }
        }
        else if(room.memory.setup < room.controller.level)
        {
            // room has controller and setup is under level
            var finished = setup.run(room, room.controller.level);
            if(finished)
            {
                room.memory.setup = room.controller.level;
            }
        }

        if(room.memory.setup >= 0 && room.controller.my) // check the queue for spawn requests
        {
            // We have at least a basic setup and we control the room
            var queue = room.memory.spawnqueue;
            // check queue for spawn requests
            if(queue.length)
            {   // TODO: refactor for multiple spawns
                var valid = spawnRequest(room, queue[0]);
                if(valid)
                {
                    queue.pop(); // take the top request off the queue
                }
            }
        }
    }
    // temp delete later but this is to get started
    if(Game.creeps.length < 1 || (!Game.creeps.length))
    {
        // have no creeps so add a spawn request.
        for(var room in Game.rooms)
        {
            if(room.controller.my)
            {
                room.memory.spawnqueue.push("harvester");
            }
        }
    }

    // finally run all the creeps that we own
    for(var creep in Game.creeps)
    {
        if(!creep.spawning) // not spawning so do stuff
        {
            if(creep.memory.travel)
            { // if it's going somewhere just moveTo that roomPosition after checking if it made it
                var XYR = creep.memory.travelDest.split(" "); // [0] = x, [1] = y, [2] = room
                const pos = new RoomPosition(XYR[0], XYR[1], XYR[2]);
                if(creep.pos.isNearTo(pos)) // we are at the destination
                {
                    creep.memory.travel = false;
                    console.log("Holy shit the test worked!");
                }
                else // not there yet
                {
                    creep.moveTo(pos);
                }
            }

            if(ticksToLive <= 1)// going to die: do clean up before memory death
            {
                if(creep.memory.sourceId) // check if it was harvesting
                {
                    var workCount = 0;
                    for(var part in creep.body)
                    {
                        if(part.type === WORK)
                        {
                            workCount += 1;
                        }
                    }
                    creep.room.memory.sources[creep.memory.sourceId].harvesterPartCount -= workCount;
                }
            }
        }
    }
};
