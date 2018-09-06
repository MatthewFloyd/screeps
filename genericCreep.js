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
                if(total === 0)// no energy, go back to source
                {
                    const newTravelDest = source.pos.x + " " + source.pos.y +  " " + creep.room.name;
                    creep.memory.travelDest = newTravelDest;
                    creep.memory.travel = true;
                    creep.moveTo(source.pos);
                }
                var spawn = creep.room.memory.spawns[0]; // update later
                var spawn = Game.getObjectById(spawn);
                // check for case at spawn and full energy
                if(creep.pos.isNearTo(spawn)) // at spawn
                {
                    if(creep.transfer(spawn, RESOURCE_ENERGY) !== 0)
                    {
                        console.log(creep.name + " transfer to spawn problem!");
                    }
                }
                else if(creep.pos.isNearTo(creep.room.controller)) // at controller
                {
                    if(creep.upgradeController(creep.room.controller) !== 0)
                    {
                        console.log(creep.name + " upgrade controller error!");
                    }
                }
            }
        }
        else // we have full energy
        {
            // set new destination and start travel
            
            // check spawn to see if energy needed, otherwise upgrade controller
            console.log(creep.room);
            var spawn = creep.room.memory.spawns[0]; // update later
            var spawn = Game.getObjectById(spawn);
            // check for case at spawn and full energy
            if(creep.pos.isNearTo(spawn)) // at spawn
            {
                if(creep.transfer(spawn, RESOURCE_ENERGY) !== 0)
                {
                    console.log(creep.name + " transfer to spawn problem!");
                }
            }
            else if(creep.pos.isNearTo(creep.room.controller)) // at controller
            {
                if(creep.upgradeController(creep.room.controller) !== 0)
                {
                    console.log(creep.name + " upgrade controller error!");
                }
            }
            if(spawn.energy < (spawn.energyCapacity - creep.carryCapacity)) // is it worth it?
            {
                const newTravelDest = spawn.pos.x + " " + spawn.pos.y +  " " + creep.room.name;
                creep.memory.travelDest = newTravelDest;
                creep.memory.travel = true;
                creep.moveTo(spawn.pos);
            }
            else
            {
                const newTravelDest = creep.room.controller.pos.x + " " + creep.room.controller.pos.y +  " " + creep.room.name;
                creep.memory.travelDest = newTravelDest;
                creep.memory.travel = true;
                creep.moveTo(creep.room.controller.pos);
            }
        }
    }
};

module.exports = genericCreep;
