var roleTower = {
    
    /** @param {Tower} tower **/
    run: function(tower) {
        const attackTarget = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 12);
        const repairTargets = tower.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
            });
        const healTargets = tower.room.find(FIND_MY_CREEPS, {
        filter: object => object.hits < object.hitsMax
        });
        
        if(healTargets.length > 0) {
            for(let i = 0; i < healTargets.length; i++) {
                tower.heal(healTargets[i]);
            }
        }
        else if(attackTarget.length > 0) {
            tower.attack(attackTarget);
        } 
        else if(repairTargets.length > 0) {
            for(let i = 0; i < repairTargets.length; i++) {
                tower.repair(repairTargets[i]);
            }
        }
    }
};

module.exports = roleTower;