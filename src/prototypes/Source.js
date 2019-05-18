var _ = require('lodash');

// Debug functions ----------------------------------------------------------------------------------------------------

Object.defineProperty(Source.prototype, 'print', {
    get() {
        return '<a href="#!/room/' + Game.shard.name + '/' + this.name + '">' + this.name + '</a>';
    },
    configurable: true
});

// Source functions -----------------------------------------------------------------------------------------------------

Object.defineProperty(Source.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.mySourcesMemory)) {
            Memory.mySourcesMemory = {};
        }
        if(!_.isObject(Memory.mySourcesMemory)) {
            return undefined;
        }
        return Memory.mySourcesMemory[this.id] =
            Memory.mySourcesMemory[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.mySourcesMemory)) {
            Memory.mySourcesMemory = {};
        }
        if(!_.isObject(Memory.mySourcesMemory)) {
            throw new Error('Could not set source memory');
        }
        Memory.mySourcesMemory[this.id] = value;
    }
});

Object.defineProperty(Source.prototype, 'freeSpaceCount', {
    get: function () {
        if (this._freeSpaceCount == undefined) {
            if (this.memory.freeSpaceCount == undefined) {
                let freeSpaceCount = 0;
                [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
                    [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
                    if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
                freeSpaceCount++;
            }, this);
            }, this);
                this.memory.freeSpaceCount = freeSpaceCount;
            }
            this._freeSpaceCount = this.memory.freeSpaceCount;
        }
        return this._freeSpaceCount;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'minerCount', {
   get: function () {
       if(!this._miners) {
           if(!this.memory.miners) {
               let temp = _.filter(this.room.creeps, {memory: {role: 'harvester', sourceId: this.id, interT: false}});
               this.memory.miners = temp.length;
           }
           this._miners = this.memory.miners;
       }
       return this._miners;
   },
    enumerable: false,
    configurable: true
});