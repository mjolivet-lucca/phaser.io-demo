var config = {
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  parent: 'game-container',
  physics: {
    default: 'matter',
    matter: {
      debug: true,
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

let test;
let isDrawing;
let graphics;
let path;
let statusText;
let timerText;
let pathText;
let timerEvent;
const game = new Phaser.Game(config);

function preload(){
  this.load.image('test_image', 'assets/test.png');
  this.load.json('test_shape', 'assets/test.json');
  this.load.image('background', 'assets/background.jpg');
}

function init() {
  isDrawing = false;
}

function create() {

  this.cameras.main.fadeIn(1000, 0, 0, 0);

  this.add
      .image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(
        this.sys.game.config.width,
        this.sys.game.config.height
      );

  graphics = this.add.graphics();
  graphics.lineStyle(4, 0x00aa00);
  graphics.depth = 2;

  this.matter.world.disableGravity();
  let shapes = this.cache.json.get('test_shape');

  test = this.matter.add.image(400, 360, 'test_image', null, { shape: shapes.test  });
  test.depth = 1;

  const infoStyle = {
    font: '20px Calibri',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3
  };

  statusText = this.add.text(32, 32, 'pas commencé', infoStyle);
  timerText = this.add.text(512, 32, '', infoStyle);
  pathText = this.add.text(512, 64, '', infoStyle);

  timerEvent = this.time.addEvent({ delay: 4000 });
  timerEvent.paused = true;
}

function update() {
  const timeUpdate = timerEvent.getRemainingSeconds();
  const output = timeUpdate.toLocaleString(
      'en-US',
      {
        minimumIntegerDigits: 1,
        useGrouping: false
      });
  timerText.setText('Temps : ' + output);

  if(!this.input.activePointer.isDown && isDrawing) {
    isDrawing = false;
    statusText.setText('pas de dessin en cours');
    timerEvent.paused = true;
  } else if(this.input.activePointer.isDown) {
    let x = this.input.activePointer.position.x - 2;
    let y = this.input.activePointer.position.y - 2;
    if(!isDrawing) {
      if (path) {
        path.destroy();
        graphics.destroy();
        graphics = this.add.graphics();
        graphics.lineStyle(4, 0x00aa00);
        graphics.depth = 3;
        timerEvent.destroy();
        timerEvent = this.time.addEvent({ delay: 4000 });
      }

      path = new Phaser.Curves.Path(x, y);
      isDrawing = true;
      timerEvent.paused = false;
      statusText.setText('nouveau');
    } else {
      path.lineTo(x, y);
      if(this.matter.containsPoint(test, x, y)){
        statusText.setText('dans la forme');
      }else{
        statusText.setText('en dehors de la forme');
      }
    }
    path.draw(graphics);
    const pathLength = path.getLength() ?? 0;
    pathText.setText(
        pathLength.toLocaleString(
            'en-US',
            {
              minimumIntegerDigits: 2,
              useGrouping: false
            }));
  }
}

