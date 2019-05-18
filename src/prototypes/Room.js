var _ = require('lodash');

// Debug functions ----------------------------------------------------------------------------------------------------

Object.defineProperty(Room.prototype, 'print', {
    get() {
        return '<a href="#!/room/' + Game.shard.name + '/' + this.name + '">' + this.name + '</a>';
    },
    configurable: true
});

// Room functions -----------------------------------------------------------------------------------------------------

// get spawn
Object.defineProperty(Room.prototype, 'spawns', {
   get: function () {
       // If we dont have the value stored locally
       if(!this._spawn) {
           if(!this.memory.spawn) {
               this.memory.spawn = this.find(FIND_MY_SPAWNS).map(spawn => spawn.id);
           }
           this._spawn = this.memory.spawn.map(id => Game.getObjectById(id));
       }
       return this._spawn;
   },
    set: function (newValue) {
        this.memory.spawn = newValue.map(spawn => spawn.id);
        this._spawn = newValue;
    },
    enumerable: false,
    configurable: true,
});

// get the sources in the room
Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
        // If we dont have the value stored locally
        if (!this._sources) {
            // If we dont have the value stored in memory
            if (!this.memory.sourceIds) {
                // Find the sources and store their id's in memory,
                // NOT the full objects
                this.memory.sourceIds = this.find(FIND_SOURCES)
                    .map(source => source.id);
            }
            // Get the source objects from the id's in memory and store them locally
            this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
        }
        // return the locally stored value
        return this._sources;
    },
    set: function(newValue) {
        // when storing in memory you will want to change the setter
        // to set the memory value as well as the local value
        this.memory.sources = newValue.map(source => source.id);
        this._sources = newValue;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'my', {
    get() {
        return this.controller && this.controller.my;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'owner', {
    get() {
        return this.controller && this.controller.owner ? this.controller.owner.username : undefined;
    },
    configurable: true,
});

// Creeps physically in the room
Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) {
            this._creeps = this.find(FIND_MY_CREEPS);
        }
        return this._creeps;
    },
    configurable: true,
});

// Enemies
Object.defineProperty(Room.prototype, 'hostiles', {
    get() {
        if (!this._hostiles) {
            this._hostiles = this.find(FIND_HOSTILE_CREEPS);
        }
        return this._hostiles;
    },
    configurable: true,
});

// NPC enemies
/*
Object.defineProperty(Room.prototype, 'invaders', {
    get() {
        if (!this._invaders) {
            this._invaders = _.filter(this.hostiles, (creep: Creep) => creep.owner.username == 'Invader');
        }
        return this._invaders;
    },
    configurable: true,
});
*/

// Construction Sites
Object.defineProperty(Room.prototype, 'constructionSites', {
    get() {
        if (!this._constructionSites) {
            this._constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);
        }
        return this._constructionSites;
    },
    configurable: true,
});