function LevelMasterState() {}

var playerDifficulty;
var DIFFICULTIES = {
  squishy: 1,
  bouncy: 3,
  hardcore: 10
};

LevelMasterState.prototype = {
  create: function() {
    var levelTitle = game.add.sprite(centerx, oneThirdHeight, 'set_level');
    levelTitle.anchor.setTo(0.5,0.5);
    levelTitle.scale.setTo(0.5,0.5);
    levelTitle.alpha = 0;
    var levelTitleAnimation = game.add.tween(levelTitle).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut, true);

    var levelOptions = [
      {name: 'squishy', yOffset: 120},
      {name: 'bouncy', yOffset: 250},
      {name: 'hardcore', yOffset: 380}
    ];

    var levelSprites = {};


    levelOptions.forEach(
      function(option){
        var sprite = game.add.sprite(levelTitle.position.x, levelTitle.position.y + option.yOffset, option.name);
        sprite.anchor.setTo(0.5, 0.5);
        sprite.scale.setTo(0.4);
        sprite.alpha = 0;
        sprite.inputEnabled = true;
        game.add.tween(sprite).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut, true, 500 );
        levelSprites[option.name] = sprite;
    });


    function selectLevel(level) {
      playerDifficulty = level;
      gamePlayed = false;
      this.game.state.start('level_round');
    }

    levelSprites.squishy.events.onInputDown.add(selectLevel.bind(this, DIFFICULTIES.squishy),this);
    levelSprites.bouncy.events.onInputDown.add(selectLevel.bind(this, DIFFICULTIES.bouncy),this);
    levelSprites.hardcore.events.onInputDown.add(selectLevel.bind(this, DIFFICULTIES.hardcore),this);

    backButton = game.add.sprite(100, game.height - 100, 'back_button');
    backButton.anchor.setTo(0.5,0.5);
    backButton.scale.setTo(0.2,0.2);
    backButton.alpha = 0;
    backButton.inputEnabled = true;
    backButtonAnimation = game.add.tween(backButton).to({alpha: 0.1}, 1000, Phaser.Easing.Quadratic.InOut, true, 2000);

    function backToMenu() {
      this.game.state.start('main_menu');
    }

    backButton.events.onInputDown.add(backToMenu, this);

    // this.game.state.start('level_round');
  }
};

