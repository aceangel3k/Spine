## Spine for Impact ##
This plugin enables Spine animations (www.esotericsoftware.com) to be used in an Impact.js (www.impactjs.com) project. 

### Why? ###
Current implementations of spine require WebGL/Turbulenz or by using Pixi.js. What's the matter with using Pixi? It replaces the entire Impact.js animation system and has the extra step of using another program to create a sprite atlas. With this, you can create standard models from Spine, export a texture atlas and use them directly in your Impact game. You also gain the ability to use them within the Weltmeister editor. This is based off of FlyOver Games' runtime and the standard spine runtime. 

### Demo ###
http://www.atomk.com/spineboy/
(Controls WASD + Z || Direction Keys + Z || Touch controls via mobile browser)

### Required ###
- ImpactJS 1.23 or above
- A Spine license

### Optional ###
- Google's closure library for modification

### Known issues ###
- The animations loop and it's quite difficult to get it to rewind as it should. Maybe someone could figure this out.
- No Free Form Deformation (FFD) Mesh support - would be cool but it would be way over my head to implement.
- Not tested in Ejecta. I've tested with Intel's XDK using DirectCanvas without any problems.