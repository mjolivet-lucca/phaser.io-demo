var config = {
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  parent: 'game-container',
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: {
        x: 0,
        y: 0
      }
    }
  },
  scene: {
    preload: preload,
    init: init,
    create: create,
    update: update
  }
}

var game = new Phaser.Game(config);

function preload(){}

function init() {}

function create() {}

function update() {}

