ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	//'impact.debug.debug',
	'game.entities.spineboy',
	'game.levels.level',
	'plugins.touch-button'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	gravity: 80,
	bgImage: new ig.Image( 'media/monog.png' ),
	buttons: null,
	buttonImage: new ig.Image( 'media/touch-buttons.png' ),
	init: function() {
		// Initialize your game here; bind keys etc.
		this.initKeys();
		this.loadLevel(LevelLevel);
		ig.game.spawnEntity(EntitySpineboy, ig.system.width/2, ig.system.height/2);
		ig.debugMode = false;
		
	},

	initKeys: function(){
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.MOUSE1, 'leftClick' );
		ig.input.bind( ig.KEY.SPACE, 'gas' );
		ig.input.bind( ig.KEY.Z, 'shoot' );
		ig.input.bind( ig.KEY.P, 'pause' );
		ig.input.bind( ig.KEY.M, 'mute' );
		ig.input.bind( ig.KEY.C, 'clear' );
		ig.input.bind( ig.KEY.F, 'firepower' );
		ig.input.bind( ig.KEY.G, 'resources' );

		if( ig.ua.mobile ) {
            this.buttons = new ig.TouchButtonCollection([
                new ig.TouchButton( 'left', {left: 0, bottom: 0}, 128, 128, this.buttonImage, 0),
                new ig.TouchButton( 'right', {left: 128, bottom: 0}, 128, 128, this.buttonImage, 1),
                new ig.TouchButton( 'shoot', {right: 128, bottom: 0}, 128, 128, this.buttonImage, 2),
                new ig.TouchButton( 'up', {right: 0, bottom: 96}, 128, 128, this.buttonImage, 3)
            ]);
             this.buttons.align();
        }
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();		
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.bgImage.draw( 0, -400 );
	    for( var i = 0; i < this.entities.length; i++ ) {
        	this.entities[i].draw();
    	}
        // Draw all touch buttons - if we have any
        if( this.buttons ) {
            this.buttons.draw(); 
        }
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 1024, 600, 1 );

});
