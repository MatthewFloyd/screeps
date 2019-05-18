var _ = require('lodash');

class SpawnManager {
    constructor(room) {
        this.room = room;

    }
    decideSource() {
        let options = this.room.memory.sourceIds;
        let choice = options[0];
        if(options.length > 1 && Game.time % 2 == 0) {
            choice = options[1];
        }

        return choice;
    }
    addPart(currentBody, type, amount) {
        for(var i = 0; i < amount; i++) {
            currentBody.push(type);
        }
        return currentBody;
    }
    decideBody(type, sigPartAmount) { // returns final creep body
        var body = [];
        switch(type) {
            case 'slowWork':
                var pattern = [WORK, CARRY];
                body = this.addPart(body, WORK, sigPartAmount);
                body = this.addPart(body, CARRY, 2);
                body = this.addPart(body, MOVE, 1);
                break;
            case 'fastWork': // ie builders etc.
                var pattern = [WORK, CARRY];
                body = this.addPart(body, WORK, sigPartAmount);
                body = this.addPart(body, CARRY, sigPartAmount);
                body = this.addPart(body, MOVE, body.length / 2);
                break;
            case 'shifter':
                var pattern = [CARRY];
                body = this.addPart(pattern, CARRY, sigPartAmount);
                body = this.addPart(body, MOVE, body.length / 2);
                break;
            case 'attacker': // 10 tough, 10 work, 10 heal, 20 move = 4,100 energy each / squad of 3 is 12,300 - should beat 2 towers at max range
                body = this.addPart(body, TOUGH, 10);
                body = this.addPart(body, MOVE, 10);
                body = this.addPart(body, WORK, 10);
                body = this.addPart(body, MOVE, 10);
                body = this.addPart(body, HEAL, 10);
                break;
            default:
                break;
        }
        return body;
    }
    spawnNewCreep(spawn, type, amountNeeded) {
        let sourceId = this.decideSource();

        switch(type) {
            case 'harvester':
                var amt = amountNeeded;
                if(amountNeeded > 6) { amt = 6; }
                var body = this.decideBody('slowWork', amt);
                if(spawn.spawnCreep(body, "Harvester" + Game.time%100, {
                        memory: {role: 'harvester', gathering: true, source: sourceId, home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            case 'builder':
                var amt = amountNeeded;
                if(amountNeeded > 5) { amt = 5; }
                var body = this.decideBody('fastWork', amt);
                if(spawn.spawnCreep(body, "Builder" + Game.time%100, {
                        memory: {role: 'builder', gathering: true, source: sourceId, home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            case 'repairer':
                if(spawn.spawnCreep([WORK, CARRY, MOVE], "Repairer" + Game.time%100, {
                        memory: {role: 'repairer', gathering: true, source: sourceId, home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            case 'shifter':
                var body = this.decideBody('shifter', (amountNeeded * 2) + 1);
                if(spawn.spawnCreep(body, "Shifter" + Game.time%100, {
                        memory: {role: 'shifter', gathering: true, home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            case 'queen':
                var body = this.decideBody('shifter', (amountNeeded * 2) + 1);
                if(spawn.spawnCreep(body, "Queen" + Game.time%100, {
                        memory: {role: 'queen', gathering: true, home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            case 'upgrader':
                var body = [];
                if(this.room.controller.level <= 4) {
                    body = this.decideBody('fastWork', 2);
                }
                else {
                    body = this.decideBody('slowWork', 5);
                }
                if(spawn.spawnCreep(body, "Upgrader" + Game.time%100, {
                        memory: {role: 'upgrader', gathering: true, home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            case 'scout':
                //var body = this.decideBody('wtf', -1);
                var amt = amountNeeded;
                if(amountNeeded > 5) { amt = 5; }
                var body = this.decideBody('fastWork', amt);
                if(spawn.spawnCreep(body, "Scout" + Game.time%100, {
                        memory: {role: 'scout', gathering: true, home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            case 'attackSquad':
                var body = this.decideBody('attacker', -1); // 10 tough 10 work 10 heal 20 move
                if(spawn.spawnCreep(body, "Attacker" + Game.time%100, {                                 //W8N2 for test run
                        memory: {role: 'attackSquad', forValhalla: false, attacking: false, attackRoom: 'W7N3', home: this.room.name, interT: false}
                    }) === 0)
                {
                    console.log("Spawning new " + type + " in room: " + this.room.print);
                };
                break;
            default:
                break;
        }

    }

}
module.exports = SpawnManager;