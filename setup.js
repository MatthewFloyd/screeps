/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('setup');
 * mod.thing == 'a thing'; // true
 */
 
 var setup = {
     
     /** @param {room} room **/
     run: function(room) {
         
         let c = room.controller;
         
         Memory.rooms = {};
         Memory.rooms[room.name];
         room.memory.setupLevel = {};
         room.memory.spawns = {};
         room.memory.sources = {};
         room.memory.controller = {};
         room.memory.minerals = {};
         room.memory.queue = {};
         
         
         let spawns = room.find(FIND_MY_STRUCTURES, {
             filter: (s) => {return (s.structureType == STRUCTURE_SPAWN)}
         });
         if(spawns.length > 0) {
             for(var z = 0; z < spawns.length; z++) {
                 let ID = spawns[z].id;
                 room.memory.spawns[z] = ID;
             }
         }
         
         let sources = room.find(FIND_SOURCES);
         for(var x = 0; x < sources.length; x++) {
             let ID = sources[x].id;
             room.memory.sources[x] = ID;
         }
         
         if(c) {
            room.memory.controller[0] = c.id;
         }
         
         let m = room.find(FIND_MINERALS);
         
         if(m.length > 0) {
             for(var y = 0; y < m.length; y++) {
                 let ID = m[y].id;
                 room.memory.minerals[y] = ID;
             }
         }
         room.memory.setupLevel = 1;
     }
 }

module.exports = setup;