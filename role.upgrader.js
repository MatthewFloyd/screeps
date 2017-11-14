var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var source = Game.spawns['Spawn1'];
        creep.memory.Eharvest = false;
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.memory.Eharvest = false;
	        creep.say('⚡ upgrade');
	    }
	    
	    if(creep.memory.Eharvest == true) {
	        if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.Eharvest == false;
                creep.memory.upgrading = true;
            }
            else {
    	        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                
                if(Game.time % 5 == 0) {
                    creep.say('🔄Eharvest');
                }
            }
	    }

	    else if(creep.memory.upgrading) {
	        if(creep.ticksToLive < 20) {
	            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(Game.spawns['Spawn1']);
	            }
	        }
	        //console.log(creep.upgradeController(creep.room.controller));
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            //var sources = creep.room.find(FIND_SOURCES);
            
            /*var sourceUpdated = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => {return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)}});
            var target = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => {return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)}});
            var highestContainer = source;
            */
            var extensions = source.room.find(FIND_STRUCTURES, {filter: (s) => {return (s.structureType === STRUCTURE_EXTENSION && s.energy == s.energyCapacity)}});
            var containers = source.room.find(FIND_STRUCTURES, {filter: (s) => {return (s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)}});
            
            //console.log(creep.memory.Eharvest);
            if(!source.memory.wantToSpawn) {
                if(containers.length > 0) {
                    if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)  {
                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else if(extensions.length > 0) {
                    if(creep.withdraw(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)  {
                        creep.moveTo(extensions[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else if(source.energy > 200) {
                    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)  {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else {
                    creep.memory.Eharvest = true;
                    creep.memory.upgrading = false;
                }
            }
            else {
                creep.memory.Eharvest = true;
                creep.memory.upgrading = false;
            }
        }
	}
};

module.exports = roleUpgrader;

/*if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(storage);
}

var sources = creep.room.findNearest(Game.SOURCES) 
*/