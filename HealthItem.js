var Platformer = Platformer || {};

Platformer.HealthItem = function (game_state, position, properties) {
    "use strict";
    Platformer.Item.call(this, game_state, position, properties);
};

Platformer.HealthItem.prototype = Object.create(Platformer.Item.prototype);
Platformer.HealthItem.prototype.constructor = Platformer.HealthItem;

Platformer.HealthItem.prototype.collect_item = function (item, player) {
    "use strict";
    Platformer.Item.prototype.collect_item.call(this);
    player.health += 1;
};
