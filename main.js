
var setup = require('setup');
var spawnManager = require('spawnManager');
var baseBuilder = require('baseBuilder');
var roleTower = require('roleTower');
var roleScout = require('roleScout');
var roleClaimer = require('roleClaimer');

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
            //console.log(room);
            setup.run(Game.rooms[room]);
            
         //console.log(Game.rooms[room].name + " " + Game.rooms[room].memory.spawns[0]);
        }
    }
    
    // set attack room
    if(Memory.target[0] == undefined)
    {
        Memory.target = 'W2N5';
    }
    
    
    for(var c in Game.creeps)
    {
        
        if(Game.creeps[c].memory.role == 'scout')
        {
            roleScout.run(Game.creeps[c]);
        }
        else if(Game.creeps[c].memory.role == 'claimer')
        {
            roleClaimer.run(Game.creeps[c]);
        }
    }
    
    for(var room in Memory.rooms)
    {
        let R = Game.rooms[room];
        
        
        
        if(R.memory.spawns[0] != undefined)
        {
            spawnManager.run(room);
            let towers = R.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
            if(towers.length > 0)
            {
                for(var tower in towers)
                {
                    roleTower.run(towers[tower]);
                }
            }
            if(R.memory.controller != undefined) {
            let controller = Game.getObjectById(Game.rooms[room].memory.controller[0]);
            if(!room.memory)
            {
                setup.run(Game.rooms[room]);
            }
            if(controller.level > 1 && controller.level != Game.rooms[room].memory.setupLevel)
            {
                setup.run(Game.rooms[room]);
                baseBuilder.run(room);
                //Game.rooms[room].memory.setupLevel = controller.level;
            }}
        }
    }
    
    
}
