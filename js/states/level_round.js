function LevelRoundState() {}

var playerLives, playerBall, smallerEnemies, largerEnemies, enemiesCollisionGroup, playerCollisionGroup, gameOverScreen;

var playerScale = 0.1;
var gamePlayed = false;
var winScreenDisplayed;

//accelerometer controls

var ax = 0, ay = 0,
vx = 0, vy = 0;

window.ondevicemotion = function(e) {

  ax = e.accelerationIncludingGravity.x * inputSensitivity; //acceleration along x axis
  ay = e.accelerationIncludingGravity.y * inputSensitivity; //acceleration along y axis

  //TODO: make tilt increase logarithimacally

  vx = vx + ax;
  vy = vy + ay;

};


function createPlayer() {
    playerBall = game.add.sprite(centerx, centery, 'player');

    if (!gamePlayed) {
        playerBall.scale.setTo(1, 1);

        var getReadyScreen = game.add.sprite(centerx, centery + 50, 'getready');
        getReadyScreen.scale.setTo(0.5,0.5);
        var getReadyAnimation = game.add.tween(getReadyScreen);
        getReadyAnimation.to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0, 7, false);
        game.time.events.add(5000, (function() {
            gamePlayed = true;
        }), this);
    }

    else {
        playerBall.scale.setTo(playerScale, playerScale);
    }

    game.physics.p2.enable(playerBall);

    // //adding invicibility to the ball for 4 seconds
    playerBall.invincible = true;

    var invincibleAnimation = game.add.tween(playerBall);
    invincibleAnimation.to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0, 7, false).to({alpha: 1}, 500);

    game.time.events.add(4000, (function() {
        playerBall.invincible = false;
    }), this);

    //setting the collision group for the player
    playerBall.body.setCollisionGroup(playerCollisionGroup);
    playerBall.body.collides(enemiesCollisionGroup, hitEnemy, this);
}


function createSmallerEnemies() {
    for (var x = 1; x < 18; x++) {
        var enemySpriteColors = ['blue_ball', 'red_ball', 'green_ball'];
        var enemy = smallerEnemies.create(game.world.randomX, game.world.randomY, game.rnd.pick(enemySpriteColors));
        var smallerEnemy = game.rnd.realInRange(0.015, playerScale);

        //making enemies smaller than current player size
        enemy.scale.setTo(smallerEnemy, smallerEnemy);
        game.physics.p2.enable(enemy, false);

        //initiating enemy velocity.

        var randv = game.rnd.realInRange(-300, 300);
        var randv2 = game.rnd.realInRange(-300, 300);
        enemy.body.velocity.x = randv;
        enemy.body.velocity.y = randv2;

        //setting the collision group and having it collide with the player.
        enemy.body.setCollisionGroup(enemiesCollisionGroup);
        enemy.body.collides([enemiesCollisionGroup, playerCollisionGroup]);
    }
}

function createLargerEnemies() {
    for (var x = 1; x < 4; x++) {
        var enemy = largerEnemies.create(game.world.randomX, game.world.randomY, 'ball');
        var largerEnemy = game.rnd.realInRange(playerScale, playerScale * 1.5);
        enemy.scale.setTo(largerEnemy, largerEnemy);
        game.physics.p2.enable(enemy, false);

         //initiating enemy velocity.

        var randv = game.rnd.realInRange(-300, 300);
        var randv2 = game.rnd.realInRange(-300, 300);

        enemy.body.velocity.x = randv;
        enemy.body.velocity.y = randv2;


        //setting the collision group and having it collide with the player.
        enemy.body.setCollisionGroup(enemiesCollisionGroup);
        enemy.body.collides([enemiesCollisionGroup, playerCollisionGroup]);

    }
}

function moveLargerTowardPlayer (enemy) {
    accelerateToObject(enemy, playerBall, playerDifficulty * 75);
}

function moveSmallerTowardPlayer (enemy) {
    accelerateToObject(enemy, playerBall, 50);
}

function accelerateToObject(obj1, obj2, speed) {
    if (typeof speed === 'undefined') { speed = 60; }
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry balls (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
    obj1.body.force.y = Math.sin(angle) * speed;
}

function restartGame() {
  game.state.start('level_round');
}


function levelUp(playerBall) {
  var newSize = playerBall.sprite.scale.x * 1.022;
  playerBall.sprite.scale.x = newSize;
  playerBall.sprite.scale.y = newSize;
  playerScale = newSize;
  game.add.tween(playerBall.sprite.scale).to({x:newSize * 1.2, y:newSize * 1.2}, 25,Phaser.Easing.Linear.None, true, 0, 0, true);
}

function hitEnemy(playerBall, enemy) {
    //  body1 is the playerBall (as it's the body that owns the callback)
    //  body2 is the body it impacted with, the enemy balls
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:

    if (playerBall.sprite.invincible) {
        return;
    }

    else if (enemy.sprite.scale.x > playerBall.sprite.scale.x) {


        if (playerLives.countLiving() !== 0) {
            game.add.tween(playerBall.sprite.scale).to({ x: 0, y: 0}, 100, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {
                playerBall.sprite.kill();
                    if (!playerBall.sprite.hasCollided) {
                        playerBall.sprite.hasCollided = true;
                        playerLives.next().kill();

                        if (playerLives.countDead() === 1) {
                            var respawnMessage = game.add.sprite(centerx, centery + 50, 'respawn');
                            respawnMessage.scale.setTo(0.25,0.25);
                            var respawnMessageAnimation = game.add.tween(respawnMessage);
                            respawnMessageAnimation.to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0, 7, false);
                        }


                        game.time.events.add(2000, (function() {
                            createPlayer();
                        }), this);
                    }
            }, this);
        }

        if (playerLives.countLiving() === 0) {
            if (!playerBall.sprite.hasCollided) {
                playerBall.sprite.hasCollided = true;
                game.add.tween(playerBall.sprite.scale).to({ x: 0, y: 0}, 100, Phaser.Easing.Quadratic.InOut, true, 0);
                var gameOverScreen = game.add.sprite(centerx, centery, 'gameogre');
                gameOverScreen.anchor.setTo(0.5,0.5);
                gameOverScreen.inputEnabled = true;
                gameOverScreen.events.onInputDown.add(restartGame, this);
                }
        }

      }

    else {
        game.add.tween(enemy.sprite.scale).to({ x: 0, y: 0}, 75, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function(){
        enemy.sprite.kill();
            if (!enemy.sprite.hasCollided) {
                levelUp(playerBall);
                enemy.sprite.hasCollided = true;
            }
        }, this);



    }

}

function createLives() {
    playerLives = game.add.group();
    var firstLifeIconX = game.width - 50;
    for (var i = 0; i < 2; i++) {
        var lifeIcons = playerLives.create(firstLifeIconX - (60 * i), 50, 'player');
        lifeIcons.scale.setTo(0.1,0.1);
        lifeIcons.anchor.setTo(0.5, 0.5);
        lifeIcons.alpha = 0.6;
    }

}

LevelRoundState.prototype = {

  preload: function() {
    // This function will be executed at the beginning

  },


  create: function() {


    // starting the P2JS system
    game.physics.startSystem(Phaser.Physics.P2JS);

    // starting collision events
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.95;

    //creating a collision group for player and enemies

    playerCollisionGroup = game.physics.p2.createCollisionGroup();

    enemiesCollisionGroup = game.physics.p2.createCollisionGroup();

    game.physics.p2.updateBoundsCollisionGroup();


    smallerEnemies = game.add.group();
    largerEnemies = game.add.group();

    //setting initial playerscale and winScreenDisplayed

    winScreenDisplayed = false;
    playerScale = 0.1;

    createPlayer();

    createLives();

    //adding a delay to creating enemies.

    game.time.events.add(4000, (function() {
        createSmallerEnemies();
        createLargerEnemies();

        this.update = function() {
                        // This function is called 60 times per second
            // It contains the game's logic

            ballMovement(playerBall, ax, ay, inputSensitivity, cursors);

            //larger enemies move faster towards you.

            largerEnemies.forEachAlive(moveLargerTowardPlayer, this);
            smallerEnemies.forEachAlive(moveSmallerTowardPlayer, this);

            //checking for the game win condition

            if (smallerEnemies.countLiving() === 0 && largerEnemies.countLiving() === 0) {
                if (!winScreenDisplayed) {
                    winScreenDisplayed = true;
                    var winScreen = game.add.sprite(centerx, centery, 'youwin');
                    winScreen.scale.setTo(0.5,0.5);
                    winScreen.anchor.setTo(0.5,0.5);
                }
            }
        };
    }), this);

    //this could be a prefab
    backButton = game.add.sprite(100, game.height - 100, 'back_button');
    backButton.anchor.setTo(0.5,0.5);
    backButton.scale.setTo(0.2,0.2);
    backButton.alpha = 0;
    backButton.inputEnabled = true;
    backButtonAnimation = game.add.tween(backButton).to({alpha: 0.1}, 1000, Phaser.Easing.Quadratic.InOut, true, 2000);

    function backToDifficulty() {
      this.game.state.start('level_master');
    }

    backButton.events.onInputDown.add(backToDifficulty, this);

  },

  update: function() {
    // This function is called 60 times per second
    // It contains the game's logic

    ballMovement(playerBall, ax, ay, inputSensitivity, cursors);

    //larger enemies move faster towards you.

    largerEnemies.forEachAlive(moveLargerTowardPlayer, this);
    smallerEnemies.forEachAlive(moveSmallerTowardPlayer, this);

    //checking for the game win condition

    if (smallerEnemies.countLiving() === 0 && largerEnemies.countLiving() === 0 && gamePlayed) {
        if (!winScreenDisplayed) {
            winScreenDisplayed = true;
            var winScreen = game.add.sprite(centerx, centery, 'youwin');
            winScreen.scale.setTo(0.5,0.5);
            winScreen.anchor.setTo(0.5,0.5);
        }
    }


  }
};