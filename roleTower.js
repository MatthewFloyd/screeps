/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleTower');
 * mod.thing == 'a thing'; // true
 */

var roleTower = {

    run: function(tower) {
        var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0)
        {
            let nearest = hostiles.filter(function(creep) {
                return ((tower.pos.x - creep.pos.x) + (tower.pos.y - creep.pos.y) <= 20)
            });
            //console.log(nearest[0].pos.x - tower.pos.x + " " + nearest[0].pos.y - tower.pos.y);
            if(nearest.length > 0)
            {
                tower.attack(nearest[0]);
            }
        }
        if(tower.hits < (tower.hitsMax / 4))
        {
            tower.room.controller.activateSafeMode();
        }
	    
	}
};

module.exports = roleTower;
