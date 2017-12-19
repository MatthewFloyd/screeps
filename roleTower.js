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
            let nearest = tower.pos.findClosestByRange(hostiles);
            tower.attack(nearest);
        }
	    
	}
};

<<<<<<< HEAD
module.exports = roleTower;
=======
module.exports = roleTower;
>>>>>>> 922ec387b83c2bd69ed717b18befd159341f1da8