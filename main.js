"use strict";

var setup = require('setup');
var spawnRequest = require('spawnRequest');

module.exports.loop = function () {

    // Delete old creeps
    for(var name in Memory.creeps)
    {
        if(!Game.creeps[name]) {
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

        if(room.memory.setup >= 0 && room.controller.my)
        {
            // We have at least a basic setup and we control the room
            var queue = room.memory.spawnqueue;
            // check queue for spawn requests
            if(queue.length)
            {   // TODO: refactor for multiple spawns
                spawnRequest(room, queue[0]);
            }
        }
    }
};
