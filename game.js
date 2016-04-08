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
        game.load.spritesheet('character', 'assets/character.png', 23.25, 41);
        game.load.spritesheet('mosquito_right', 'assets/mosquito_right.png', 80, 53);
        game.load.spritesheet('mosquito_left', 'assets/mosquit_left.png', 80, 51);
        game.load.spritesheet('fly_right', 'assets/fly_right.png', 64, 59);
        game.load.spritesheet('fly_left', 'assets/fly_left.png', 64, 67);
        //game.load.image('background', "assets/background.png");
        //game.load.image('cloud', 'assets/cloud.png');
        game.load.image('platform', 'assets/platform.png');
        game.load.image('first_level', "assets/first_level.jpg");
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

    function create() {

        //background = game.add.backgroundImage(0, 0, 2560, 1080);
        //game.add.sprite(0, 0, 'background');
        game.add.sprite(0, 0, 'first_level');

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

