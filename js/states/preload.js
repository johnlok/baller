function start() {

    game.load.image('ballerlogo', 'assets/ballerlogo.png');
    game.load.image('startbutton', 'assets/startbutton.png');
    game.load.image('ball', 'assets/ball.png', 400, 400);
    game.load.image('player', 'assets/player.png', 400, 400);
    game.load.image('gameogre', 'assets/gameogre.png', 500, 256);
    game.load.image('select_level', 'assets/select_level.png');
    game.load.image('options', 'assets/options.png');
    game.load.image('getready', 'assets/get_ready.png');
    game.load.image('youwin', 'assets/you_win.png');
    game.load.image('respawn', 'assets/respawn.png');
    game.load.image('red_ball', 'assets/red_ball.png');
    game.load.image('green_ball', 'assets/green_ball.png');
    game.load.image('blue_ball', 'assets/blue_ball.png');
    game.load.image('squishy', 'assets/squishy.png');
    game.load.image('bouncy', 'assets/bouncy.png');
    game.load.image('hardcore', 'assets/hardcore.png');
    game.load.image('set_level', 'assets/set_level.png');
    game.load.image('sense_high', 'assets/sense_high.png');
    game.load.image('sense_medium', 'assets/sense_medium.png');
    game.load.image('sense_low', 'assets/sense_low.png');
    game.load.image('sensitivity', 'assets/sensitivity.png');
    game.load.image('back_button', 'assets/back_button.png');
    game.load.spritesheet('tilt_to_play', 'assets/tilt_spritesheet.png', 580, 656);
    game.load.image('arrows_to_play', 'assets/arrows_to_play.png');
    game.load.start();

}

function loadStart() {

  //bouncing ball animation

    this.isGameLoaded = false;

    this.loadingBall = game.add.sprite(centerx, centery, 'loading');
    this.loadingBall.anchor.setTo(0.5,0.5);
    this.loadingBall.animations.add('bounce');
    this.loadingBall.animations.play('bounce', 9, true);

    this.loadingText = game.add.sprite(centerx - 15, centery + 130, 'loading_text');
    this.loadingText.scale.setTo(0.5, 0.5);
    this.loadingText.anchor.setTo(0.5, 0.5);
    this.loadingText.animations.add('textDotDotDot');
    this.loadingText.animations.play('textDotDotDot', 2, true);
}

function loadComplete() {

    //logo and start button to be faded in after 1 second

    game.time.events.add(1000, (function() {

        this.logo = game.add.sprite(centerx, centery - 50, 'ballerlogo');
        this.logo.anchor.setTo(0.5,0.5);
        this.logo.scale.setTo(0.8,0.8);
        this.logo.alpha = 0;
        game.add.tween(this.logo).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut, true, 1000);

        this.startgame = game.add.sprite(centerx, centery + 200, 'startbutton');
        this.startgame.anchor.setTo(0.5,0.5);
        this.startgame.scale.setTo(0.5,0.5);
        this.startgame.alpha = 0;
        game.add.tween(this.startgame).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut, true, 1000).onComplete.add(function(){
            this.isGameLoaded = true;
            this.logo_animation = game.add.tween(this.logo);
            this.logo_scale = game.add.tween(this.logo.scale);
        }, this);

    }), this);



    //fade out the old loading animation

    game.add.tween(this.loadingBall).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, true, 1000);
    game.add.tween(this.loadingText).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, true, 1000);



}

function Preload() {}

Preload.prototype = {
  preload: function() {
    // load all game assets
    // images, spritesheets, atlases, audio etc..

    //listening for load events

    game.load.onLoadStart.add(loadStart, this);
    game.load.onLoadComplete.add(loadComplete, this);

    start();

  },
  create: function() {

  },

  update: function() {
    //this here refers to preload

    if ((game.input.mousePointer.isDown || game.input.pointer1.isDown) && this.isGameLoaded) {
        this.logo_animation.to({ x: centerx, y: oneThirdHeight }, 1000, Phaser.Easing.Quadratic.InOut, true);
        this.startgame.destroy();
        this.logo_scale.to({x: 0.6, y: 0.6}, 1000, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
        this.game.state.start('main_menu');
    }, this);

    }

  }
};