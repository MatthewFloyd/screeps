var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFighter = require('role.fighter'); // Emergency create fighter by:  Game.spawns['Spawn1'].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK], 'Fighter' + Game.time, {memory: {role: 'fighter'}});
var roleTower = require('role.tower');
var roleRemoteHarvester = require('role.remoteHarvester');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    /*for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        if(!room.memory.containers) {
            room.memory.containers = {};
            var containers = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER)
                    }
            });
            for(var i in containers) {
                var container = containers[i];
                container.memory = room.memory.containers[container.id] = {};
                container.memory.harvester = 0;
            }
        }
    }*/
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var fighters = _.filter(Game.creeps, (creep) => creep.memory.role == 'fighter');
    var remoteHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarvester');
    
    var availableEnergy = Game.rooms['E17N5'].energyAvailable;
    if(Game.time % 120 == 0) {
        console.log('Room: ' + Memory.rooms[0]);
        console.log('--- Creep Count ---');
        console.log('Harvesters: ' + harvesters.length);
        console.log('Upgraders: ' + upgraders.length);
        console.log('Builders: ' + builders.length);
        console.log('Fighters: ' + fighters.length);
        console.log('Remote Harvesters: ' + remoteHarvesters.length);
        console.log("Available room energy: " + availableEnergy);
        console.log('\n');
    }
    
    var spawn = Game.spawns['Spawn1'];
    var energySpots = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)
    var energyTotal = 0;
    for(var y = 0; y < energySpots.length; y++) {
        energyTotal += energySpots[y].energy;
    }
    
    creepParts = [WORK,CARRY,MOVE];
    if(spawn.hits < (spawn.hitsMax / 2)) {
        Game.rooms['E17N5'].controller.activateSafeMode();
    }
    //console.log(creepParts.length);
    
    var attackers = spawn.room.find(FIND_HOSTILE_CREEPS, 
        { filter: (creep) => { return creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK) > 0; } });

    if(availableEnergy >= 550) {
        creepParts = [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
    }
    else {
        creepParts = [WORK,CARRY,MOVE];
    }

    if(harvesters.length < 3) {
        var newName = 'Harvester' + Game.time;
        spawn.memory.wantToSpawn = true;
        if(Game.spawns['Spawn1'].spawnCreep(creepParts, newName, {memory: {role: 'harvester'}}) == 0) {
                console.log('Spawning new harvester: ' + newName);
        }
    }
    
    else if(attackers.length > 0 && fighters.length < 2) {
        // We have hostiles in the room!
        var newName = 'Fighter' + Game.time;
        spawn.memory.wantToSpawn = true;
        if(Game.spawns['Spawn1'].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK], newName, {memory: {role: 'fighter'}}) == 0) {
                console.log('Spawning new fighter: ' + newName);
        }
    }
    else if(builders.length < 2) {
        var newName = 'Builder' + Game.time;
        spawn.memory.wantToSpawn = true;
        if(Game.spawns['Spawn1'].spawnCreep(creepParts, newName, {memory: {role: 'builder', transferStuff: false}}) == 0) {
                console.log('Spawning new builder: ' + newName);
        }
    }
    else if(upgraders.length < 4) {
        var newName = 'Upgrader' + Game.time;
        spawn.memory.wantToSpawn = true;
        if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}}) == 0) {
                console.log('Spawning new upgrader: ' + newName);
        }
    }
    
    
    else if(availableEnergy >= 700 && remoteHarvesters.length < 2) {
        var newName = 'RemoteHarvester' + Game.time;
        spawn.memory.wantToSpawn = true;
        if(Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'remoteHarvester'}}) == 0) {
                console.log('Spawning new remoteHarvester: ' + newName);
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
        spawn.memory.wantToSpawn = false;
    }
    
    if(spawn.memory.wantToSpawn == true && Game.time % 10 == 0) {
        console.log("Spawn is trying to spawn a creep.");
    }
    
    //Tower code
    if(spawn.memory.towers.length > 0) {
        //We have a tower at least
        for(var z = 0; z < spawn.memory.towers.length; z++) {
            let tower = Game.getObjectById(spawn.memory.towers[z]);
            roleTower.run(tower);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'fighter') {
            roleFighter.run(creep);
        }
        if(creep.memory.role == 'remoteHarvester') {
            roleRemoteHarvester.run(creep);
        }
    }
}