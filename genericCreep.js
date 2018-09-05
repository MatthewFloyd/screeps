'use strict';

var genericCreep = {
    run: function(creep)
    {
        const total = _.sum(creep.carry);
        if(total < creep.carryCapacity) // we don't have full energy so decide if we are at source or not
        {
            // get source from creep memory
            var source = creep.memory.sourceId;
            var source = Game.getObjectById(source);
            if(creep.pos.isNearTo(source)) // at the source
            {
                if(creep.harvest(source) !== 0)
                {
                    console.log(creep.memory.role + " has an error harvesting source!");
                }
            }
            else // not at source
            {
                
            }
        }
        else // we have full energy
        {
            // set new destination and start travel
            
            // check spawn to see if energy needed, otherwise upgrade controller
            var spawn = creep.room.memory.spawns[0]; // update later
            var spawn = Game.getObjectById(spawn);
            // check for case at spawn and full energy
            if(creep.pos.isNearTo(spawn)) // at spawn
            {
                // TODO
            }
            if(spawn.energy < (spawn.energyCapacity - creep.carryCapacity)) // is it worth it?
            {
                const newTravelDest = spawn.pos.x + " " + spawn.pos.y + creep.room.name;
                creep.memory.traveDest = newTravelDest;
                creep.memory.travel = true;
            }
        }
    }
};

module.exports = genericCreep;
