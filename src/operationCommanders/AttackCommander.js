var _ = require('lodash');
//var Miner = require('../creepTypes/Miner');

class AttackCommander {
    constructor(room, attackSquad) {
        this.room = room;
        this.squad = attackSquad; // Squad of 3 members
        this.handleSquad();
    }
    handleSquad() {
        // Above all else, heal self if injured
        // First we need to wait for the whole squad to be here in one spot and ready to go but don't mess up if we are
        // attacking and we lose a squad member
        if(this.room.name !== this.squad[0].memory.attackRoom) {
            if(this.squad[0].memory.attacking === false) {
                // Not in attack room
                // Not everyone is here and in position
                // 26,24 26,25 26,26
                console.log("Not in attack room, forming up");
                var s1Pos = new RoomPosition(26, 26, this.squad[0].memory.home);
                var s2Pos = new RoomPosition(25, 26, this.squad[0].memory.home);
                var s3Pos = new RoomPosition(24, 26, this.squad[0].memory.home);
                if (!this.squad[0].pos.isNearTo(s1Pos)) {
                    this.squad[0].moveTo(s1Pos);
                }
                if (this.squad.length > 1) {
                    if (!this.squad[1].pos.isNearTo(s2Pos)) {
                        this.squad[1].moveTo(s2Pos);
                    }
                }
                if (this.squad.length > 2) {
                    if (!this.squad[2].pos.isNearTo(s3Pos)) {
                        this.squad[2].moveTo(s2Pos);
                    }
                }
                if (this.squad.length > 2 && this.squad[0].pos.isNearTo(s1Pos) && this.squad[1].pos.isNearTo(s2Pos) &&
                    this.squad[2].pos.isNearTo(s3Pos)) {
                    // ready and in position
                    // travel to target room and set memory params
                    // memory: {role: 'attackSquad', attacking: false, attackRoom: 'W7N3' home: this.room.name, interT: false}
                    for (var a in this.squad) {
                        var squadMember = this.squad[a];
                        squadMember.memory.attacking = true;
                        squadMember.memory.home = squadMember.memory.attackRoom;
                        squadMember.memory.interT = true;
                        console.log("We formed up and are moving to attack room");
                    }
                }
            }
        }
        else {
            var valhalla = false;
            for(var y in this.squad) {
                // What if someone dies
                var maybeDying = this.squad[y];
                if(maybeDying.hits <= 200) {
                    // Probs going to die
                    valhalla = true;
                }
            }
            if(valhalla === true) {
                // adjust memory in the rest of the squad to make one last heroic charge forValhalla
                for(var z in this.squad) {
                    var lastStanders = this.squad[z];
                    lastStanders.memory.forValhalla = true;
                }
            }
            // We are in the target room
            if(this.squad.length < 3) {
                if(this.squad[0].memory.forValhalla === false) {
                    console.log("We are in attack room and waiting for whole squad");
                    // Don't have the full squad here
                    // Move out of the way so squad dosen't get stuck on edge then heal self
                    var center = new RoomPosition(25, 25, this.squad[0].memory.attackRoom);
                    for (var a in this.squad) {
                        var sMember = this.squad[a];
                        sMember.moveTo(center);
                        if (sMember.hits < sMember.hitsMax) {
                            // heal yourself
                            sMember.heal(sMember);
                        }
                    }
                }
                else {
                    // We have lost a brother! Last charge
                    for(var s in this.squad) {
                        var lastDude = this.squad[s];
                        const target = lastDude.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                        if(target) {
                            if(lastDude.pos.isNearTo(target)) {
                               lastDude.dismantle(target);
                            }
                            else {
                                lastDude.moveTo(target);
                            }
                        }
                        if(lastDude.hits < lastDude.hitsMax) {
                            lastDude.heal(lastDude);
                        }
                    }
                }
            }
            else {
                console.log("Squad is all here");
                // The squad is all here
                // First - heal eachother to full and move together
                var headDude = this.squad[0];
                const target = headDude.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                if(headDude.hits === headDude.hitsMax) {
                    // We fine so go try and attack buildings
                    //console.log("Test run complete");
                    console.log(target + " : is return of target");
                    if(target) {
                        if(headDude.dismantle(target) === ERR_NOT_IN_RANGE) {
                            headDude.moveTo(target);
                        }
                    }
                }
                for(var x = 0; x < this.squad.length; x++) {
                    // get closer
                    var subDude = this.squad[x];
                    if(subDude === headDude) {
                        // I am headDude
                        if(headDude.hits < headDude.hitsMax) { // attempt to heal self
                            // heal headDude
                            subDude.heal(headDude);
                        }
                    }
                    else {
                        if (!subDude.pos.isNearTo(headDude)) {
                            subDude.moveTo(headDude);
                        }
                        if (headDude.hits < (3* headDude.hitsMax / 4)) { // attempt to heal as you got in range
                            // heal headDude
                            subDude.heal(headDude);
                        }
                        else {
                            if(target) {
                                if(subDude.dismantle(target) === ERR_NOT_IN_RANGE) {
                                    subDude.moveTo(target);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
module.exports = AttackCommander;