var Platformer = Platformer || {};

Platformer.Health = function (game_state, position, properties) {
    "use strict";
    Phaser.Text.call(this, game_state.game, position.x, position.y, properties.text);
    
    this.game_state = game_state;
    
    this.game_state.groups[properties.group].add(this);
    
    this.fixedToCamera = true;
};

Platformer.Health.prototype = Object.create(Phaser.Text.prototype);
Platformer.Health.prototype.constructor = Platformer.Health;

Platformer.Health.prototype.update = function () {
    "use strict";
    // update text to player current score
    this.text = "Health: " + this.game_state.prefabs.player.health;
};
