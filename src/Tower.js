var _ = require('lodash');

module.exports = {

    run: function(tower, repairTargets) {
        // Operations in peacetime
        if(tower.room.hostiles.length <= 0) {
            if (tower.energy > (3 * tower.energyCapacity / 4) && repairTargets.length > 0 &&
                repairTargets[repairTargets.length - 1].hits < repairTargets[repairTargets.length - 1].hitsMax) {
                tower.repair(repairTargets[repairTargets.length - 1]);
            }
        }
        else {
            //var invaders = _.filter(this.room.hostiles, c => c.owner.username == 'Invader');
            var closest = _.sortBy(tower.room.hostiles, c => tower.pos.getRangeTo(c));
            tower.attack(closest[0]);
        }
    }

};