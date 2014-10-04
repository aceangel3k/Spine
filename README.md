## Spine for Impact ##
This plugin enables spine models to be used in an impact.js project. 

### Why? ###
Current implementations of spine require WebGL/Turbulenz or by using pixi.js. What's the matter with using pixi? It replaces the entire impact.js animation system and has the extra step of using another program to create a sprite atlas. With this, you can create standard models from spine, export a texture atlas and use them directly in your impactjs game. You also gain the ability to use them within the weltmeister editor. This is based off of FlyOver Games' runtime and the standard spine runtime. 

### Demo ###
http://www.atomk.com/spineboy/

### Required ###
- ImpactJS 1.23 or above
- A Spine license
- Google's closure library (for modification)

### Known issues ###
- The animations loop and it's quite difficult to get it to rewind as it should. Maybe someone could figure this out.
- No Deformed Mesh support - would be cool but it would be way over my head to implement
- Not tested in Ejecta. I've tested with Intel's XDK using DirectCanvas without any problems, though.