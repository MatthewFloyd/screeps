/*
 * This is my custom intra-room movement system.
 * Should be able to pass in the creep and its destination room name
 * and expect to arrive in the destination room safetly.
 * 
 * TODO:
 *      Avoid danger in the room
 *      ...
 */

var wanderer = {

    run: function(creep, dest) {
	    var route = Game.map.findRoute(creep.room.name, dest); // Gives a bunch of exits on path.
	    if(route[0])
	    {
    	    var currDest = route[0].room;
    	    if(creep.room.name != currDest && !(creep.pos.x == 0 || creep.pos.x == 49
                                             || creep.pos.y == 0 || creep.pos.y == 49))
    	    {
    	        var dest = new RoomPosition(25, 25, currDest);
    	        creep.moveTo(dest);
    	    }
    	    else
    	    {
    	        let toCenter = false;
    	        if(creep.pos.x == 25 && creep.pos.y == 25)
    	        {
    	            toCenter = true;
    	        }
    	        else
    	        {
    	            creep.moveTo(25, 25);
    	        }
    	        if(toCenter)
    	        {
    	            creep.move(route[0].exit);
    	        }
    	    }
    	    return false;
	    }
	    else
	    {
	        return true;
	    }
	}
};

module.exports = wanderer;