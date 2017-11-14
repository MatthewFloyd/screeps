var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            //console.log(source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => {
                        return ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity);
                    }
            });
            
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => {
                            return (s.structureType == STRUCTURE_CONTAINER);
                        }
                });
                if(container) {
                    if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }
	}
};

module.exports = roleHarvester;

/* code change to use containers

    TODO:
        1: assign containers to individual harvesters in memory
        2: use that to place position for harvester with many work parts 1 move and 0 carry
        3: harvester drops energy on container and builder moves that energy to the nearest extension/spawn
        
for(var roomName in Game.rooms) {
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
}
    
*/
/*

        
        
        
        if(creep.memory.container) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.container));
            }
        }
        else {
            creep.memory.container = {};
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER)
                    }
            });
            
            
            if(containers.length) {
                for (var c in containers)
                {
                    var container = containers[c];
                    
                    creep.memory.container = containers[0].id;
                }
            }
            
            else {
                console.log("something went wrong with harvester/container assignment");
            }
        }
*/