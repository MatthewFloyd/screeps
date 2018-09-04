"use strict";

var sourceAssign = {

    init: function (room, workPartCount) {
        var sources = room.memory.sources;
        for(var S=0; S < sources.length; S += 2)
        {
            if(sources[S+1] === undefined)
            {
                sources[S+1] = workPartCount;
            }
            else if(sources[S+1] <= (5 - workPartCount))
            {
                // we have space on this source for the new worker
                sources[S+1] += workPartCount;
                return sources[S];
            }
            // Otherwise no space on this source
        }
        return -1; // We didn't find any available source
    },
    check: function (room, workPartCount) {
        var sources = room.memory.sources;
        for(var S=0; S < sources.length; S += 2)
        {
            if(sources[S+1] === undefined)
            {
                // no modification
                return sources[S];
            }
            else if(sources[S+1] <= (5 - workPartCount))
            {
                // we have space on this source for the new worker
                return sources[S];
            }
            // Otherwise no space on this source
        }
        return -1; // We didn't find any available source
    }
};

module.exports = sourceAssign;