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

let test;
let isDrawing;
let graphics;
let path;
let statusText;
let timerText;
let pathText;
let timerEvent;
const game = new Phaser.Game(config);
this.itemsTexts = [];
this.itemsList = [];

function preload(){
  this.load.image('test_image', 'assets/test.png');
  this.load.json('test_shape', 'assets/test.json');
  this.load.image('background', 'assets/background.jpg');
  this.load.image('item', 'assets/potion.png');
}

function init() {
  isDrawing = false;
}

function addItem(x, y) {
  const image = this.matter.add.image(x, y, 'item');
  image.depth = 3;

  const itemStyle = {
    font: '40px Calibri',
    fill: '#1f1f2f',
    stroke: '#ffff00',
    strokeThickness: 5
  };
  const itemText = this.add.text(x, y, '+5000!', itemStyle);
  itemText.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
  itemText.depth = 3;
  itemText.setVisible(false);

  this.itemsTexts.push(itemText);
  this.itemsList.push(image);
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

  this.itemsList = [];
  this.itemsTexts = [];

  addItem.call(this, 290, 150);
  addItem.call(this, 480, 150);
  addItem.call(this, 400, 480);

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

    let i = 0;
    if (!!this.itemsList && this.itemsList.length > 0) {
      for (const item of this.itemsList) {
        if (item.visible && isDrawing && this.matter.containsPoint(item, x, y)) {
          this.itemsTexts[i].setVisible(true);
          this.tweens.add({
            targets: this.itemsTexts[i],
            alpha: 0,
            duration: 1500,
            ease: 'Power2'
          });
          item.setVisible(false);
        }
        i++;
      }
    }

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

