"use strict";

var setup = {

    run: function(room, setupLvL)
    {
        if(setupLvL <= 1)
        {
            // room doesn't have a controller or just doing basic find
            // find sources and mineral
            const sources = room.find(FIND_SOURCES);
            const mineral = room.find(FIND_MINERALS);
            const spawns = room.find(STRUCTURE_SPAWN);

            if(sources.length)
            {
                room.memory.sources = [];
                for(var s in sources)
                {
                    room.memory.sources.push(sources[s].id);
                }
                if(room.memory.sources.length)
                {
                    for(var c in room.memory.sources)
                    {
                        sources[c].harvesterPartCount = 0;
                    }
                }
            }
            if(mineral.length)
            {
                room.memory.mineral = [];
                for(var m in mineral)
                {
                    room.memory.mineral.push(mineral[m].id);
                }
            }
            if(setupLvL >= 0) // has a controller
            {
                if(room.controller.my)
                {
                    room.memory.spawnqueue = [];
                    room.memory.spawns = [];
                    if(spawns)
                    {
                        for(var S in spawns)
                        {
                            room.memory.spawns.push(S.id);
                        }
                    }
                }
                room.memory.setup = 1;
            }
            return true;
        }
        else
        {
            // have sources and mineral already
            return true; // TODO: controller level functionality
        }
    }
};


module.exports = setup;
