/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('baseBuilder');
 * mod.thing == 'a thing'; // true
 */

var spawnManager = require('spawnManager');

var baseBuilder = {
     
     R: '',
     C: '',
     X: 0,
     Y: 0,
     S: '',
     
     /** @param {room} room **/
     run: function(room) {
         
         this.R = Game.rooms[room];
         this.C = this.R.find(FIND_MY_CREEPS);
         let spawn = Game.getObjectById(this.R.memory.spawns[0]); // Eventually modify for multiple spawns
         this.S = spawn;
         this.X = spawn.pos.x;
         this.Y = spawn.pos.y;
         
         let controller = Game.getObjectById(this.R.memory.controller[0]);
         this.visual(controller.level);
         if(this.build(controller.level) == true)
         {
             this.R.memory.setupLevel = controller.level;
             console.log("Base building at room: " + this.R.name + " for level: " + controller.level + " is complete!");
         }
     },
     
     build: function(controllerLevel) {
         
         let maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controllerLevel];
         let extensions = this.R.find(FIND_MY_STRUCTURES, {
             filter: (s) => {
                 return (s.structureType == STRUCTURE_EXTENSION)
             }
         });
         var extensionLocations = this.getExtensionLocations(controllerLevel);
         var roadLocations = this.getRoadLocations(controllerLevel);
         //var towerLocations = this.getTowerLocations(controllerLevel);
         
         // Build stuff
         if (extensions.length < maxExtensions)
         {
             if(extensionLocations != 0)
             {
                  for(var x = 0; x < extensionLocations.length; x++)
                  {
                      if(this.addConstructionSite(STRUCTURE_EXTENSION, extensionLocations[x][0], extensionLocations[x][1]) == false)
                      {
                          continue;
                      }
                  }
             }
             if(roadLocations != 0)
             {
                  for(var y = 0; y < roadLocations.length; y++)
                  {
                      if(this.addConstructionSite(STRUCTURE_ROAD, roadLocations[y][0], roadLocations[y][1]) == false)
                      {
                          continue;
                      }
                  }
             }
             return false;
         }
         else
         {
             if(!this.R.memory.extensions)
             {
                 this.R.memory.extensions = {};
             }
             for(var e in extensions)
             {
                 this.R.memory.extensions[e] = extensions[e].id;
             }
             
             return true;
         }
     },
     
     addConstructionSite: function(siteType, posX, posY) {
         const lookS = this.R.lookForAt(LOOK_STRUCTURES, posX, posY);
         const lookC = this.R.lookForAt(LOOK_CONSTRUCTION_SITES, posX, posY);
         
         if(lookS[0] != undefined || lookC[0] != undefined)
         {
             // Structure already built
             return true;
         }
         else
         {
             
             this.R.createConstructionSite(posX, posY, siteType);
             return false;
         }
     },
     
     getExtensionLocations: function(controllerLevel) {
         if(controllerLevel == 2)
         {
             return [[this.X, this.Y + 2],
                    [this.X + 2, this.Y],
                    [this.X - 2, this.Y],
                    [this.X, this.Y - 2],
                    [this.X + 2, this.Y - 2]]
         }
         else if(controllerLevel == 3)
         {
             return [[this.X + 1, this.Y - 3],
                    [this.X + 3, this.Y - 1],
                    [this.X + 3, this.Y + 1],
                    [this.X + 2, this.Y + 2],
                    [this.X + 1, this.Y + 3]]
         }
          else {
               return 0;
          }
     },
     
     getRoadLocations: function(controllerLevel) {
         if(controllerLevel == 2)
         {
             return [[this.X - 2, this.Y - 1],
                    [this.X - 1, this.Y - 1],
                    [this.X, this.Y - 1],
                    [this.X + 1, this.Y - 1],
                    [this.X + 2, this.Y - 1],
                    
                    [this.X - 2, this.Y + 1],
                    [this.X - 1, this.Y + 1],
                    [this.X, this.Y + 1],
                    [this.X + 1, this.Y + 1],
                    [this.X + 2, this.Y + 1],
                    
                    [this.X - 1, this.Y - 2],
                    [this.X - 1, this.Y - 1],
                    [this.X - 1, this.Y],
                    [this.X - 1, this.Y + 1],
                    [this.X - 1, this.Y + 2],
                    
                    [this.X + 1, this.Y - 2],
                    [this.X + 1, this.Y - 1],
                    [this.X + 1, this.Y],
                    [this.X + 1, this.Y + 1],
                    [this.X + 1, this.Y + 2]]
         }
          else {
               return 0;
          }
     },
     
     getTowerLocations: function(controllerLevel) {
         if(controllerLevel == 3)
         {
             return [[this.X + 3, this.Y]]
         }
          else
          {
               return 0;
          }
     },
     
     visual: function(controllerLevel) {
         // Debugging room visuals
         if(controllerLevel >= 2)
         {
             // Extension placement
             this.R.visual.circle(this.X, this.Y + 2);
             this.R.visual.circle(this.X + 2, this.Y);
             this.R.visual.circle(this.X - 2, this.Y);
             this.R.visual.circle(this.X, this.Y - 2);
             this.R.visual.circle(this.X + 2, this.Y - 2);
             
             // Road placement
             this.R.visual.line(this.X - 2, this.Y - 1, this.X + 2, this.Y - 1);
             this.R.visual.line(this.X - 2, this.Y + 1, this.X + 2, this.Y + 1);
             this.R.visual.line(this.X - 1, this.Y - 2, this.X - 1, this.Y + 2);
             this.R.visual.line(this.X + 1, this.Y - 2, this.X + 1, this.Y + 2);
         }
         if(controllerLevel >= 2)
         {
             this.R.visual.circle(this.X - 2, this.Y - 2);
             this.R.visual.circle(this.X - 2, this.Y + 2);
             this.R.visual.circle(this.X + 2, this.Y + 2);
             this.R.visual.circle(this.X + 4, this.Y - 2);
             this.R.visual.circle(this.X + 4, this.Y);
         }
     }
 }

module.exports = baseBuilder;
