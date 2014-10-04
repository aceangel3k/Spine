ig.module(
	'game.entities.spineboy'
)
.requires(
	'impact.entity',
	'plugins.spine-animation'
)
.defines(function(){

	EntitySpineboy = ig.Entity.extend({
		atlas: new ig.Image( 'media/spineboy/export/spineboy.png' ),
		size: {x: 64, y:64},
		offset: {x: 0, y: 0},
		maxVel: {x: 400, y: 1000},
		zIndex: 100,
		gravityFactor: 10,
		speed: 600,
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.PASSIVE,
		init: function( x, y, settings ) {
			// Add the animations
			this.addSpineAnim( 'run', 'media/spineboy/export/spineboy.json' ,'media/spineboy/export/spineboy.atlas',this.atlas,'default', 1, 0.5, this.size, 'run',false );
			this.addSpineAnim( 'idle', 'media/spineboy/export/spineboy.json' ,'media/spineboy/export/spineboy.atlas',this.atlas,'default', 1, 0.5, this.size, 'idle',false );
			this.addSpineAnim( 'jump', 'media/spineboy/export/spineboy.json' ,'media/spineboy/export/spineboy.atlas',this.atlas,'default', 1, 0.5, this.size, 'jump',false );
			this.addSpineAnim( 'fall', 'media/spineboy/export/spineboy.json' ,'media/spineboy/export/spineboy.atlas',this.atlas,'default', 1, 0.5, this.size, 'fall',false );
			this.addSpineAnim( 'shoot', 'media/spineboy/export/spineboy.json' ,'media/spineboy/export/spineboy.atlas',this.atlas,'default', 1, 0.5, this.size, 'shoot',false );
            this.parent( x, y, settings );
		},
		addSpineAnim: function( name,url,atlasUrl,atlasImage,skinName,duration,scale,size,animation,loop ) {
			var settings = { 
                name: name,
                url: url, 
                atlasUrl: atlasUrl, 
                atlasImage: atlasImage, 
                skinName: skinName, 
                duration: duration, 
                scale: scale,
                size: size, 
                animation: animation,
                stop:loop },
            a=new ig.SpineAnimation( settings );
			this.anims[name]=a;
			if(!this.currentAnim)
			{
				this.currentAnim=a;
			}
			return a;
		},
        addSpineAnimString: function( name, skeleton, atlas,atlasImage,skinName,duration,scale,size,animation ) {
            var settings = { 
                name: name,
                skeletonString: skeleton, 
                atlasString: atlas, 
                atlasImage: atlasImage, 
                skinName: skinName, 
                duration: duration, 
                scale: scale,
                size: size, 
                animation: animation },
            a=new ig.SpineAnimation( settings );
            this.anims[name]=a;
            if(!this.currentAnim)
            {
                this.currentAnim=a;
            }
            return a;
        },

        draw: function() {
            this.parent();
        },
    
		update: function() {
			if(ig.input.state('right') && this.standing){
				this.vel.x = this.speed;
				this.currentAnim =  this.anims.run;
				this.flip = false;
			} else if (ig.input.state('left') && this.standing){
				this.vel.x = -this.speed;
				this.currentAnim =  this.anims.run;
				this.flip = true;
			} else if (this.vel.y > 0){
				this.currentAnim = this.anims.fall.rewind();
			} else if (this.vel.y < 0){
				this.currentAnim = this.anims.jump.rewind();
			} else if (ig.input.state('shoot')){
				this.currentAnim = this.anims.shoot;
			} else {
				this.currentAnim = this.anims.idle;
				this.vel.x = 0;
			}
			if(ig.input.pressed('up')){
				this.vel.y = -this.speed/2;
				//this.accel.y = 0;
			}
			this.currentAnim.flip.x = this.flip;
			// move!
			this.parent();	
		}
	});
});
