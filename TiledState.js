var Platformer = Platformer || {};

Platformer.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "player": Platformer.Player.prototype.constructor,
        "ground_enemy": Platformer.GroundEnemy.prototype.constructor,
        "flying_enemy": Platformer.FlyingEnemy.prototype.constructor,
        "running_enemy": Platformer.RunningEnemy.prototype.constructor,
        "goal": Platformer.Goal.prototype.constructor,
        "score": Platformer.Score.prototype.constructor,
        "health": Platformer.Health.prototype.constructor,
        "health_item": Platformer.HealthItem.prototype.constructor,
        "fireballs": Platformer.Fireball.prototype.constructor,
        "fireball_item": Platformer.FireballItem.prototype.constructor,
    };
};

Platformer.TiledState.prototype = Object.create(Phaser.State.prototype);
Platformer.TiledState.prototype.constructor = Platformer.TiledState;

Platformer.TiledState.prototype.init = function (level_data) {
    "use strict";
    var tileset_index;
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
    
    
    // create map and set tileset
    this.map = this.game.add.tilemap(level_data.map.key);
    tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
};

Platformer.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;
    
    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setCollision(collision_tiles, true, layer.name);
        }
    }, this);
    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    this.prefabs = {};
    
    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }
    
    this.init_hud();
    
    this.game.camera.follow(this.prefabs.player);
};

Platformer.TiledState.prototype.create_object = function (object) {
    "use strict";
    var object_y, position, prefab;
    // tiled coordinates starts in the bottom left corner
    object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2)
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(object.type)) {
        prefab = new this.prefab_classes[object.type](this, position, object.properties);
    }
    this.prefabs[object.name] = prefab;
};


Platformer.TiledState.prototype.game_over = function () { 
    "use strict";
    localStorage.clear();
    this.game.state.start("BootState", true, false, "assets/levels/level1.json");
};

Platformer.TiledState.prototype.init_hud = function () {
    "use strict";
    var score_position, score, health_position, health;
    score_position = new Phaser.Point(20, 20);
    score = new Platformer.Score(this, score_position, {"text": "Score: 0", "group": "hud", "fill": 800000 });
    this.prefabs["score"] = score;
    health_position = new Phaser.Point(20, 50);
    health = new Platformer.Health(this, health_position, {"text": "Health: 0", "group": "hud"});
    this.prefabs["health"] = health;
    
};
