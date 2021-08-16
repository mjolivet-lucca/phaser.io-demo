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

let isDrawing;
let graphics;
let path;
const game = new Phaser.Game(config);

function preload(){}

function init() {
  isDrawing = false;
}

function create() {
  graphics = this.add.graphics();
  graphics.lineStyle(4, 0x00aa00);
}

function update() {
  if(!this.input.activePointer.isDown && isDrawing) {
    isDrawing = false;
  } else if(this.input.activePointer.isDown) {
    if(!isDrawing) {
      let x = this.input.activePointer.position.x - 2;
      let y = this.input.activePointer.position.y - 2;
      path = new Phaser.Curves.Path(x, y);
      isDrawing = true;
    } else {
      let x = this.input.activePointer.position.x - 2;
      let y = this.input.activePointer.position.y - 2;
      path.lineTo(x, y);
    }
    path.draw(graphics);
  }
}

