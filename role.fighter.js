var roleFighter = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            if(Game.time % 5 == 0) {
                creep.say('KILL!!');
                console.log("We are under attack!");
            }
        } 
    }
};

module.exports = roleFighter;