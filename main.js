
var setup = require('setup');
var spawnManager = require('spawnManager');
var baseBuilder = require('baseBuilder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    if(!Memory.setup) { // Triggers calc of all rooms that haven't set memory before.
        Memory.setup = {};
        Memory.setup = 1;
        
        for(var room in Game.rooms)
        {
            if(!room.memory) {
                setup.run(Game.rooms[room]);
            }
        }
    }
    
    for(var room in Game.rooms)
    {
        spawnManager.run(room);
        let controller = Game.getObjectById(Game.rooms[room].memory.controller[0]);
        
        if(controller.level > 1 && controller.level != Game.rooms[room].memory.setupLevel)
        {
            baseBuilder.run(room);
            //Game.rooms[room].memory.setupLevel = controller.level;
        }
    }
    
    
}
