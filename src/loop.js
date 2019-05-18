'use strict';

var _ = require('lodash');
require('./prototypes/Room');
const Overseer = require('./Overseer');

module.exports.loop = () =>
{

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            //console.log(Memory.creeps[name]);
            /*if(Memory.creeps[name].role === "harvester") {
                let S = Game.getObjectById(Memory.creeps[name].sourceId);
                console.log(Memory.creeps[name].role);
                console.log(Memory.creeps[name].name);
                console.log(Memory.creeps[name].sourceId);
                if(S.minerCount <= 0) { S.minerCount = 0; }
                else { S.minerCount -= 1; }
            }*/
            delete Memory.creeps[name];
        }
    }

    for(var room in Game.rooms) {
        let R = Game.rooms[room];
        //console.log(R.sources);
        let OS = new Overseer(R);


        /*var homeLink = R.spawns[0].pos.findInRange(FIND_MY_STRUCTURES, 4);
        homeLink = homeLink.filter((s) => s.structureType === STRUCTURE_LINK);
        var controllerLink = R.controller.pos.findInRange(FIND_MY_STRUCTURES, 2);
        controllerLink = controllerLink.filter((s) => s.structureType === STRUCTURE_LINK);

        console.log(homeLink);*/
    }
}
