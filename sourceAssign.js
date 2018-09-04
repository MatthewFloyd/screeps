"use strict";

var sourceAssign = {

    init: function (room, workPartCount) {
        var sources = room.memory.sources;
        for(var S in sources)
        {
            if(S.harvesterPartCount === undefined)
            {
                S.harvesterPartCount = workPartCount;
            }
            else if(S.harvesterPartCount <= (5 - workPartCount))
            {
                // we have space on this source for the new worker
                S.harvesterPartCount += workPartCount;
                return S;
            }
            // Otherwise no space on this source
        }
        return -1; // We didn't find any available source
    },
    check: function (room, workPartCount) {
        var hasSpace = false;
        for(var S in room.memory.sources)
        {
            if(S.harvesterPartCount <= (5 - workPartCount))
            {
                hasSpace = true;
                break;
            }
        }
        return hasSpace;
    }
};

module.exports = sourceAssign;