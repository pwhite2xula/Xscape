(function(Phaser) {

    var game = new Phaser.Game(
            550, 309, // The width and height of the game in pixels
            Phaser.AUTO, // The type of graphic rendering to use 
            // (AUTO tells Phaser to detect if WebGL is supported.
            //  If not, it will default to Canvas.)
            'phaser', // The parent element of the game
            {
                preload: preload, // The preloading function
                create: create, // The creation function
                update: update   // The update (game-loop) function
            }
    );

    function preload() {
        game.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('character', 'assets/sprite/character.png', 23.25, 41);
        game.load.spritesheet('mosquito_right', 'assets/creature/mosquito_right.png', 80, 53);
        game.load.spritesheet('mosquito_left', 'assets/creature/mosquito_left.png', 80, 51);
        game.load.spritesheet('fly_right', 'assets/creature/fly_right.png', 64, 59);
        game.load.spritesheet('fly_left', 'assets/creature/fly_left.png', 64, 67);
        game.load.spritesheet('coin', 'assets/item/coin.png');
        game.load.image('background', "assets/background.png");
        //game.load.image('cloud', 'assets/cloud.png');
        //game.load.image('platform', 'assets/maps/platform.png');
        //game.load.image('first_level', "assets/maps/first_level.jpg");
        game.load.image('ground1', 'assets/tiles/ground_1.png');
        game.load.image('ground2', 'assets/tiles/ground_2.png');
        game.load.image('tiles', 'assets/tiles/tiles.png');
    }

    var background;
    var player;
    var mosquito;
    var fly;
    var facing = "right";
    var hozMove = 160;
    var runMove = 240;
    var vertMove = -220;
    var jumpTimer = 2.6;
    var flyMove = 30;
    var mosMove = 60;
    var map;
    var coins;
    var layer;
    var text;

    function create() {

        background = game.add.backgroundImage(0, 0, 2560, 1080);
        text = game.add.text(0,0,"25", style);
        text.anchor.set(0.5);
        //game.add.sprite(0, 0, 'background');
        
        /*
        map = game.add.tilemap('map');
        
        map.addTilesetImage('ground1');
        map.addTilesetImage('ground2');
        map.addTilesetImage('tiles');
        
        map.setCollisionBetween(1, 12);
        layer = map.createLayer('Object Layer 1');
        
        layer.resizeWorld();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        coins = game.add.group();
        coins.enableBody = true;
        
        map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, coins);
        
        coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
        coins.callAll('animations.play', 'animations', 'spin');
        */
        
        //  This adjusts the collision body size.
        player.body.setSize(32, 32, 0, 0);
        
        //
        //game.add.sprite(0, 0, 'first_level');

        game.time.desiredFps = 30;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //player = game.add.sprite(2 * 48, 6 * 48, 'character');
        // create Tile Set the change the first and second paremter for that
        mosquito = game.add.sprite(90, 400, 'mosquito_right');
        //fly = game.add.sprite(83, 100, 'fly_right');
        
        player = game.add.sprite(32, 52, 'character'); //need a tile set first

        // try different physics methods, default is ARCADE, second arg
        game.physics.enable(player);
        game.physics.enable(mosquito);
        //game.physics.enable(fly);
        
        player.body.collideWorldBounds = true;
        mosquito.body.collideWorldBounds = true;
        //fly.body.collideWorldBounds = true;

        // Set the amount of gravity to apply to the physics body of the 'player' sprite
        player.body.gravity.y = 275;
        //mosquito.body.gravity.y = 32;
        //fly.body.gravity.y = 50;

        //PLATFORMS - X: 800-1000 Y: 0-2560 on background photo
        // on first_level figure it out on Friday with Tiled

        
        player.events.onInputDown.add(moveMosquito, mosquito);
        //game.add.tween(fly).from();

    }
    
    function moveMosquito() {
        if (this.x === 90) {
            game.add.tween(mosquito).to( { x: '+90'}, 100, Phaser.Easing.Linear.None, true);
        }
        else if (this.x === 180) {
            game.add.tween(mosquito).to( { x: '-90'}, 100, Phaser.Easing.Liner.None, true);
        }
    }
    
    function moveFly() {
        
    }

    function update() {

        // Reset the x (horizontal) velocity
        player.body.velocity.x = 0;
        mosquito.body.velocity.x = mosMove;
        //fly.body.velocity.x = flyMove;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            player.body.velocity.x = -hozMove;

            if (facing !== "left")
            {
                facing = "left";
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            player.body.velocity.x = hozMove;

            if (facing !== "right")
            {
                facing = "right";
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.A))
        {
            player.body.velocity.x = -runMove;
            if (facing !== "left")
            {
                facing = "left";
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
        {
            player.body.velocity.x = runMove;
            if (facing !== "right")
            {
                facing = "right";
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)  && player.body.onFloor() && game.time.now > jumpTimer)
        {
            // Set the 'player' sprite's y velocity to a negative number
            //  (vertMove is -90) and thus have it move up on the screen.
            player.body.velocity.y = vertMove;
            // Add 650 and the current time together and set that value to 'jumpTimer'
            // (The 'jumpTimer' is how long in milliseconds between jumps.
            //   Here, that is 650 ms.)
            jumpTimer = game.time.now + 650;
        }
        
        if (Phaser.Keyboard.SPACEBAR.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }

    }

}(Phaser));

