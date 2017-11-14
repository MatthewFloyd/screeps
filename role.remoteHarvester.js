var roleRemoteHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.carry.energy == 0 && creep.room.name == 'E17N5') {//E18N5 37 37
	    
            var dest = new RoomPosition(26, 16, 'E17N4');
            creep.moveTo(dest);
        }
        else if (creep.carry.energy < creep.carryCapacity && creep.room.name == 'E17N4') {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else if (creep.carry.energy == creep.carryCapacity && creep.room.name == 'E17N4') {
            var home = new RoomPosition(10, 48, 'E17N5');
            creep.moveTo(home);
        }
        else if (creep.carry.energy > 0 && creep.room.name == 'E17N5') {
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleRemoteHarvester;

/*
    TODO:
        Creep needs to travel to different room
        Once in the room, find the closest souce and move to that
        Mine the resource until full
        Move back to home room
        Once back in the home room, fill nearest nonfull extensions and spawn
*/