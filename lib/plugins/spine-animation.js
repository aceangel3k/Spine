/*
	Angel Espiritu Spine non-webgl plugin for impact.
	Modified over Kristoffer Jetmundsen Spriter implementation and based on FlyOver games implementation
*/

ig.module(
	'plugins.spine-animation'
)
.requires(
	'impact.timer',
	'impact.image'
)
.defines(function() { "use strict";

	ig.SpineAnimation = ig.Class.extend({
		timer: null,
		flip: {x: true, y: true},
		pivot: {x: 0, y: 0},
		frame: 0,
		loopCount: 0,
		alpha: 1,
		angle: 0,
		data: 0,
		pose: 0,
		atlas: 0,
		atlasTexture: 0,
		duration: 1,
		scale: 1,
		size: 0,
		animation: 0,
		skinName: 'default',
		stop: false,

		// animation can take an id or name
		init: function( settings ) {
			var url = settings.url,
				atlasString = settings.atlasString,
				skeletonString = settings.skeletonString,
				atlasUrl = settings.atlasUrl,  
				atlasImage = settings.atlasImage, 
				skinName = settings.skinName,
				duration = settings.duration,
				scale = settings.scale, 
				size = settings.size, 
				animation = settings.animation;

			this.data = new spine.data();
			var that = this;
			that.pose = new spine.pose();
			if (settings.stop) {
				that.stop = stop;
			}
			that.skinName = skinName;
	        that.atlasTexture = atlasImage;
			that.size = size;
			that.pivot.x =  size.x/2;
			that.pivot.y = size.y;
			that.timer = new ig.Timer();
			that.duration = duration;
			that.scale = scale;
			that.url = url;
			if( animation ) {
				that.animation = animation;
			}
			//check if a url is provided
			if ( typeof url != 'undefined' ) {

				//load the atlas
				if ( atlasUrl != "" ) {
					that.load_atlas_from_url(that.atlas, 
					atlasUrl, 
					( function ( atlas ) {
						that.atlas = atlas;

						that.load_data_from_url(that, url, 
						( function ( skeleton ) { 

							return function () {
							that.pose = new spine.pose(that.data);
							that.pose.setPlayOnce(that.stop);
								for (var i in that.data.m_animations) { 
									that.pose.setAnim(i); break; 
								}
								that.pose.setAnim(that.animation);
							}
						})(that.data));
					})); 

				} else {
					//load pose only
					that.load_data_from_url(that, url, 
					(function ( skeleton ) { 

						return function () {
						that.pose = new spine.pose(that.data);
						that.pose.setPlayOnce(that.stop);
							for (var i in that.data.m_animations) { 
								that.pose.setAnim(i); break; 
							}
						}
					})(that.data));
				}

			} else {
				//load the atlas from a string. This is useful for frameworks with incomplete XHR *AppMobi XDK cough* or if you have your own cache models
				if ( typeof atlasString != 'undefined' ) {
					//AppMobi.webview.execute('console.log("loading atlas from string")');
					that.loadAtlasFromString(that.atlas, 
					atlasString, 
					(function ( atlas ) {
						that.atlas = atlas;
						that.loadDataFromString(that, skeletonString, 
						(function ( skeleton ) { 

							return function () {
							that.pose = new spine.pose(that.data);
							that.pose.setPlayOnce(that.stop);
								for (var i in that.data.m_animations) { 
									that.pose.setAnim(i); break; 
								}
								that.pose.setAnim(that.animation);
							}
						})(that.data));
					})); 

				} else {
					//load pose only from string
					that.loadDataFromString(that, url, 
					(function ( skeleton ) { 

						return function () {
						that.pose = new spine.pose(that.data);
						that.pose.setPlayOnce(that.stop);
							for (var i in that.data.m_animations) { 
								that.pose.setAnim(i); break; 
							}
						}
					})(that.data));
				}
			}
		},

		loadAtlasFromString: function ( atlas, str, callback ) {
			var atlasText = str;
			atlas = new spine.Atlas(atlasText, {
				load: function ( page, path ) {
				}
			});
			callback(atlas);
		},

		loadDataFromString: function ( parentData, str, callback ) {
			var data = parentData.data,
			skeleton = data.m_skeleton;
			skeleton.files = {};
			skeleton = this.parseData( parentData, str, callback );
			return skeleton;
		},

		load_atlas_from_url: function ( atlas, url, callback ) {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			req.addEventListener('readystatechange', function (e) {
				if (req.readyState != 4) return;
				if (req.status != 200 && req.status != 304) {
					return;
				}

				var atlasText = e.target.responseText;
					atlas = new spine.Atlas(atlasText, {
							load: function (page, path) {
							}
						});
				callback(atlas);
			}, 
			false);
			req.send();
		},

		parseData: function(parentData, responseText, callback) {
			var data = parentData.data, 
			skeleton = data.m_skeleton;

			skeleton.files = {};

			if(typeof responseText === 'object') {
				//it is JSON
				data.load(responseText);
			} else {
				data.load(goog.global.JSON.parse(responseText));
			}

				callback();
				skeleton.current_skin_i = parentData.skinName;

				if(typeof skeleton.skins[skeleton.current_skin_i] === 'undefined')
				{
					console.log("ERROR: Cannot find skin. Did you add in a correct skin name?");
				}
				var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);
				if (skel_skin) for (var slot_i in skel_skin.skin_slots) {
					var skin_slot = skel_skin.skin_slots[slot_i];
					if (!skin_slot) { continue; }
					for (var skin_attachment_i in skin_slot.skin_attachments) {
						var skin_attachment = skin_slot.skin_attachments[skin_attachment_i],
						name = skin_attachment.name || skin_attachment_i,
						file = skeleton.files && skeleton.files[name];

						if (!file) {
							//check if atlas exists
							if (parentData.atlas) {
								//look for current part in atlas
								var skinAttachmentRegion;
								
								loop1:
								for (var b = 0; b < parentData.atlas.regions.length; b++) {
									if (parentData.atlas.regions[b].name == name)
									{
										skinAttachmentRegion = parentData.atlas.regions[b];

										break loop1;
									}
								}
								
								//create new "file"
								file = skeleton.files[name] = {};
								//create atlas settings for draw method.
								file.atlas = {
									x: skinAttachmentRegion.x,
									y: skinAttachmentRegion.y,
									width: skinAttachmentRegion.width,
									height: skinAttachmentRegion.height,
									rotate: skinAttachmentRegion.rotate,
									prerendered: false
									//when true, precalculates the image so that it can be blitted on the draw call. 
									//prerendering to a canvas doesn't work in directCanvas for some reason. Maybe it will at a later date?
									//I haven't tried it in Ejecta, maybe someone would like to enable it and let me know.
								};

								if (file.atlas.prerendered) {
									//do logic here and just add to an offscreen canvas so that we could just blit to the screen later.

									var w = file.atlas.width, 
									h = file.atlas.height, 
									skin_canvas = document.createElement('canvas'),
									skin_ctx = skin_canvas.getContext('2d');

									if (file.atlas.rotate) {
										//Deckard: reverse width/height and rotate. Stop.
										h = file.atlas.width;
										w = file.atlas.height;
										skin_ctx.rotate(90*Math.PI/180);
									}
									skin_canvas.retinaResolutionEnabled = false;
									skin_canvas.width = w;
									skin_canvas.height = h;
									skin_ctx.drawImage(parentData.atlasTexture.data, file.atlas.x, file.atlas.y, w, h,
											0, 0, w, h);
									
									file.atlas.data = skin_canvas;
								} else {
									//defer logic to draw method and not assign an image. We'll use file.atlas to create it							
								}

							} else {
								//atlas doesn't exist, so try to load in individual images
								file = skeleton.files[name] = {};
								file.width = skin_attachment.width || 0;
								file.height = skin_attachment.height || 0;
								file.image = new Image();
								var image = file.image;
								image.addEventListener('load', (function (file) { 
									return function (e) {
										file.width = file.width || e.target.width;
										file.height = file.height || e.target.height;
										e.target.hidden = false;
									}
								})(file), false);
								image.addEventListener('error', function (e) {}, false);

								var base_path = this.url.slice(0, this.url.lastIndexOf('/'));
								image.src = base_path + "/" + name + ".png";
							}
						}
					}
				}
			return skeleton;
		},

		load_data_from_url: function( parentData, url, callback ) {
			var data = parentData.data,
			skeleton = data.m_skeleton,
			that = this,
			req = new XMLHttpRequest();

			skeleton.files = {};

			req.open("GET", url, true);
			req.addEventListener('readystatechange', function (e) {
				if (req.readyState != 4) return;
				if (req.status != 200 && req.status != 304) {
					return;
				}
				skeleton = that.parseData(parentData, e.target.responseText, callback);
			}, false);
			req.send();
			return skeleton;
		},

		rewind: function() {
			this.timer.set(0);
			this.loopCount = 0;
			//this.pose.resetTime();
			return this;
		},
		
		gotoFrame: function( f ) {
			this.timer.set( this.duration * -f+ 0.0001);
			//this.pose.setTime(f- 0.0001);
			this.pose.setTime(f - .0001);
			//console.log(this.pose.getTime());
			//this.update();
		},
		
		
		gotoRandomFrame: function() {
			this.gotoFrame( Math.floor(Math.random() * this.duration));
		},
		
		update : function ()
		{  
			//var frameTotal = Math.floor(this.timer.delta()/this.duration),
			//this.loopCount = Math.floor(frameTotal / (this.pose.getAnimLength()*.1));
			this.loopCount = this.pose.getLoopCount();
			var tick = this.timer.tick(),
			adjustment = 1000,
			anim_time = (tick * adjustment * ig.Timer.timeScale * (1/this.duration));
			//if( this.stop && this.loopCount > 0 ) {
			//	console.log("STOP");
			//	this.gotoFrame(this.pose.getAnimLength());
			//} else {
				if(this.pose !== 0) {
				/*	console.log("delta " + this.timer.delta());
					console.log("tick " + tick);
					console.log("m_time " + this.pose.m_time);
					console.log("anim_time " + anim_time);*/
					this.pose.update(anim_time);
				}
			//}

		},
		/*
		Missing flip.x and 'proper' culling atm
		*/
		draw : function ( targetX, targetY ) {
			// On screen?
			if(
			   targetX > ig.system.width || targetY > ig.system.height
			   || targetX + this.size.x < 0 || targetY + this.size.y < 0 // Need to cull based on size as well
			) {
				return;
			}

			var ctx_2d = ig.system.context;

			if (ctx_2d) {
				ctx_2d.save();

				// 0,0 at center, x right, y up
				ig.system.context.translate(
					ig.system.getDrawPos(targetX + this.pivot.x),
					ig.system.getDrawPos(targetY + this.pivot.y)
				);
				var scaleX = this.flip.x ? -1 : 1,
				    scaleY = this.flip.y ? -1 : 1;
				
				if( this.flip.x || this.flip.y ) {
					ctx_2d.scale( scaleX, scaleY );
				}

				// apply camera
				ctx_2d.scale( this.scale, this.scale);
				if( this.angle !== 0 ) {
					ctx_2d.rotate(this.angle);
				}
				if( !ig.debugMode ) {
					this.draw_pose_2d(this.pose);
				} else {
					this.debug_draw_pose_2d(this.pose);
				}

				ctx_2d.restore();
			}
		},

		draw_pose_2d: function( pose ) {
			var ctx_2d = ig.system.context;

			var data = pose.m_data;
			if (!data) { return; }
			var skeleton = data.m_skeleton;
			if (!skeleton) { return; }

			pose.strike();

			var skel_bones = pose.m_tweened_skel_bones;
			var skel_slots = pose.m_tweened_skel_slots;

			var apply_skel_bone_transform = function (skel_bone) {
				if (skel_bone.parent)
				{
					apply_skel_bone_transform(skel_bones[skel_bone.parent]);
				}
				ctx_2d.translate(skel_bone.x, skel_bone.y);
				ctx_2d.rotate(skel_bone.rotation * Math.PI / 180);
				ctx_2d.scale(skel_bone.scaleX, skel_bone.scaleY);
			}

			var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);

			if (skel_skin) for (var slot_i in skel_slots) {
				var skel_slot = skel_slots[slot_i];
				var skin_attachment_i = skel_slot.attachment;
				if (!skin_attachment_i) { continue; }
				var skin_slot = skel_skin.skin_slots[slot_i];
				if (!skin_slot) { continue; }

				var skel_bone = skel_bones[skel_slot.bone];
				var skin_attachment = skin_slot.skin_attachments[skin_attachment_i];

				ctx_2d.save();

					apply_skel_bone_transform(skel_bone);

					ctx_2d.translate(skin_attachment.x, skin_attachment.y);
					ctx_2d.rotate(skin_attachment.rotation * Math.PI / 180);
					ctx_2d.scale(skin_attachment.scaleX, skin_attachment.scaleY);

					ctx_2d.globalAlpha = skel_slot.color.a;

					var name = skin_attachment.name || skin_attachment_i;

					var file = skeleton.files && skeleton.files[name];

					if (file && file.image && !file.image.hidden) {
						//draw png image
						ctx_2d.scale(1, -1);
						var w = file.width;
						var h = file.height;

						ctx_2d.drawImage(file.image, -w/2, -h/2, w, h);
					} else if (typeof file.atlas === 'object') {
						//draw region from atlas
						ctx_2d.scale(1, -1);

						if(file.atlas.prerendered) {
							//just blit
							ctx_2d.drawImage(file.atlas.data, -file.atlas.width/2, -file.atlas.height/2, file.atlas.width, file.atlas.height);
						} else {
							//calculate from atlas
							var w = file.atlas.width;
							var h = file.atlas.height;

							if (file.atlas.rotate) {
								//reverse width/height and rotate
								h = file.atlas.width;
								w = file.atlas.height;
								ctx_2d.rotate(90*Math.PI/180);
							}
							ctx_2d.drawImage(this.atlasTexture.data, file.atlas.x, file.atlas.y, w, h,
									-w/2, -h/2, w, h);
						}
					} else {
						//there was nothing so draw some boxes in place
						var w = skin_attachment.width;
						var h = skin_attachment.height;
						ctx_2d.fillStyle = 'rgba(127,127,127,0.5)';
						ctx_2d.fillRect(-w/2, -h/2, w, h);

					}

				ctx_2d.restore();
			}
		},

		debug_draw_pose_2d : function (pose)
		{
			var ctx_2d = ig.system.context;

			pose.strike();

			if (pose.m_data && pose.m_data.folder_array)
			{
				// draw objects
				var folder_array = pose.m_data.folder_array;
				var object_array = pose.m_tweened_object_array;
				for (var object_idx = 0, object_len = object_array.length; object_idx < object_len; ++object_idx)
				{
					var object = object_array[object_idx];
					var folder = folder_array[object.folder];
					var file = folder.file_array[object.file];

					ctx_2d.save();

						// apply object transform
						ctx_2d.translate(object.x, object.y);
						ctx_2d.rotate(object.angle * Math.PI / 180);
						ctx_2d.scale(object.scale_x, object.scale_y);

						// image extents
						var ex = 0.5 * file.width;
						var ey = 0.5 * file.height;
						//ctx_2d.scale(ex, ey);

						// local pivot in unit (-1 to +1) coordinates
						var lpx = (object.pivot_x * 2) - 1;
						var lpy = (object.pivot_y * 2) - 1;
						//ctx_2d.translate(-lpx, -lpy);
						ctx_2d.translate(-lpx*ex, -lpy*ey);

						ctx_2d.scale(1, -1); // -y for canvas space

						ctx_2d.fillStyle = 'rgba(127,127,127,0.5)';
						//ctx_2d.fillRect(-1, -1, 2, 2);
						ctx_2d.fillRect(-ex, -ey, 2*ex, 2*ey);

						ctx_2d.beginPath();
						ctx_2d.moveTo(0, 0);
						ctx_2d.lineTo(32, 0);
						ctx_2d.lineWidth = 2;
						ctx_2d.lineCap = 'round';
						ctx_2d.strokeStyle = 'rgba(127,0,0,0.5)';
						ctx_2d.stroke();

						ctx_2d.beginPath();
						ctx_2d.moveTo(0, 0);
						ctx_2d.lineTo(0, -32);
						ctx_2d.lineWidth = 2;
						ctx_2d.lineCap = 'round';
						ctx_2d.strokeStyle = 'rgba(0,127,0,0.5)';
						ctx_2d.stroke();

					ctx_2d.restore();
				}

				// draw bone hierarchy
				var bone_array = pose.m_tweened_bone_array;
				for (var bone_idx = 0, bone_len = bone_array.length; bone_idx < bone_len; ++bone_idx)
				{
					var bone = bone_array[bone_idx];

					var parent_index = bone.parent;
					if (parent_index >= 0)
					{
						var parent_bone = bone_array[parent_index];

						ctx_2d.save();

							ctx_2d.beginPath();
							ctx_2d.moveTo(bone.x, bone.y);
							ctx_2d.lineTo(parent_bone.x, parent_bone.y);
							ctx_2d.lineWidth = 2;
							ctx_2d.lineCap = 'round';
							ctx_2d.strokeStyle = 'grey';
							ctx_2d.stroke();

						ctx_2d.restore();
					}
				}

				// draw bones
				var bone_array = pose.m_tweened_bone_array;
				for (var bone_idx = 0, bone_len = bone_array.length; bone_idx < bone_len; ++bone_idx)
				{
					var bone = bone_array[bone_idx];

					ctx_2d.save();

						// apply bone transform
						ctx_2d.translate(bone.x, bone.y);
						ctx_2d.rotate(bone.angle * Math.PI / 180);

						ctx_2d.beginPath();
						ctx_2d.moveTo(0, 0);
						ctx_2d.lineTo(bone.scale_x * 32, 0);
						ctx_2d.lineWidth = 2;
						ctx_2d.lineCap = 'round';
						ctx_2d.strokeStyle = 'red';
						ctx_2d.stroke();

						ctx_2d.beginPath();
						ctx_2d.moveTo(0, 0);
						ctx_2d.lineTo(0, bone.scale_y * 32);
						ctx_2d.lineWidth = 2;
						ctx_2d.lineCap = 'round';
						ctx_2d.strokeStyle = 'green';
						ctx_2d.stroke();

					ctx_2d.restore();
				}
			}
		}
	});
});