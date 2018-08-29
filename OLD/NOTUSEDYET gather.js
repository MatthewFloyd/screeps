/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('NOTUSEDYET gather');
 * mod.thing == 'a thing'; // true
 */

var gather = {

    // Memory states: role, harvestSource, home, toggle
    run: function(creep, resource) {
        if(creep.memory.toggle == false) // new creep starts out toggle as false
        {
            if(creep.harvest(resource) != OK)
            {
                creep.moveTo(resource);
            }
            if(_.sum(creep.carry) == creep.carryCapacity)
            {
                creep.memory.toggle = true;
            }
        }
        else
        {
            
        }
	},
	
	findStorage: function() { // returns a storage structure position
	    let S = creep.room.memory.storageLocation; // location of the storage
	    if(S)
	    {
	        return new RoomPosition(S.x, S.y, S.roomName);
	    }
	    return ERR_NOT_FOUND;
	},
	
	getExtensions: function() { // ret
};

module.exports = gather;
