var shapes;
var testshapes;
var background;
var frameCounter;
var obstacles;
var cursors;
var jackA;
var jackB;
var WASD;
var player2;

var GameScene = new Phaser.Class({

	Extends: Phaser.Scene,
	initialize:

		function GameScene() {
			Phaser.Scene.call(this, { key: 'gameScene' });
		},

	init: function() {
		frameCounter = 0;
	},

	create: function () {
		

		cursors = this.input.keyboard.createCursorKeys();
		WASD = this.input.keyboard.addKeys('W,A,S,D,TAB');
		this.anims.create(
			{
				key: 'level_background',
				frames: [
					{ key: 'bg1' },
					{ key: 'bg2' },
					{ key: 'bg3' },
					{ key: 'bg4' },
					{ key: 'bg5' },
					{ key: 'bg6' },
					{ key: 'bg7' },
					{ key: 'bg8' },
				],
				frameRate: 10,
				repeat: -1
			});

		this.anims.create({
			key: 'jump',
			frameRate: 10,
			frames: this.anims.generateFrameNames('testsheet', {
				prefix: 'bjack_',
				suffix: '.png',
				start: 21,
				end: 29,
				zeroPad: 2
			})
		});

		this.anims.create({
			key: 'run',
			frameRate: 10,
			frames: this.anims.generateFrameNames('testsheet', {
				prefix: 'bjack_',
				suffix: '.png',
				start: 1,
				end: 5,
				zeroPad: 2
			})
		});

		this.anims.create({
			key: 'idle',
			frameRate: 10,
			frames: this.anims.generateFrameNames('testsheet', {
				prefix: 'bjack_',
				suffix: '.png',
				start: 5,
				end: 8,
				zeroPad: 2
			})
		});

		this.matter.world.setBounds(0, -100, 1200, 770, 64, true, true, false, true);
		background = this.add.sprite(600, 360, 'bg1').play('level_background');

		player2 = new Player(this, 600, 520, 'testsheet', 'bjack_06.png');

		shapes = this.cache.json.get('ashapes');
		testshapes = this.cache.json.get('testshapes');

		obstacles = this.add.group({
			key: 'obstacles',
			maxSize: 2, //Only 3 spawned?
			//setXY: { x: Phaser.Math.Between(0, 1200), y: -50 }
			//classType: Phaser.Physics.Matter.Image(this.world, 0, 0, null, null, {}),
			createCallback: function (obstacle) {
				obstacle.setName('Obstacle ' + this.getLength());
				//console.log(obstacle.name);
			}
		});

		
		//this.matter.add.sprite(300, -20, 'asheet', 'ball', { shape: shapes.ball })
		jackB = this.matter.add.sprite(100, 620, 'testsheet', 'bjack_06.png');
		jackB.body.gameObject.name = "P1";
		jackA = this.matter.add.sprite(1100, 620, 'testsheet', 'bjack_06.png').setFlipX(true);
		//console.log(jackA);
		//console.log(jackB.body);
		jackA.body.gameObject.name = "P2";

		jackA.on('animationcomplete', function (animation, frame) {
			if (animation.key === 'jump') {
				console.log("He jumpth");
			}
			else if (animation.key === 'run') {
				console.log("Run anim compelte");
				jackA.play('idle');
			}
		}, this);

		jackB.on('animationcomplete', function (animation, frame) {
			if (animation.key === 'jump') {
				console.log("He jumpth");
			}
			else if (animation.key === 'run') {
				jackB.play('idle');
			}
		}, this);
		console.log(background);

		/*this.matter.world.on('collisionactive', function (bodyA, bodyB) {
			if (bodyA.label != "Rectangle Body" || bodyB.label != "Rectangle Body")
				console.log("Ground hit!");
			else
				console.log("Yamete!");
        })*/

		jackA.setOnCollide(function (MatterCollisionData) {
			if ((MatterCollisionData.bodyA.gameObject) && (MatterCollisionData.bodyB.gameObject)) {
				if ((MatterCollisionData.bodyA.gameObject.name === "P2") && (MatterCollisionData.bodyB.gameObject.texture.key === "asheet")) {
					//console.log("P2 hit");
					//end(MatterCollisionData.bodyA.gameObject.name);
					//this.gameObject.scene.scene.manager.remove('gameScene');
					this.gameObject.scene.scene.manager.start('endScene', { winner: 'Player 1' });
				}
				else if ((MatterCollisionData.bodyB.gameObject.name === "P2") && (MatterCollisionData.bodyA.gameObject.texture.key === "asheet")) {
					//console.log("P2 hit");
					//end(MatterCollisionData.bodyB.gameObject.name);
					//this.gameObject.scene.scene.manager.remove('gameScene');
					this.gameObject.scene.scene.manager.start('endScene', { winner: 'Player 1' });
				}
			}
		})

		jackB.setOnCollide(function (MatterCollisionData) {
			if ((MatterCollisionData.bodyA.gameObject) && (MatterCollisionData.bodyB.gameObject)) {
				if ((MatterCollisionData.bodyA.gameObject.name === "P1") && (MatterCollisionData.bodyB.gameObject.texture.key === "asheet")) {
					//console.log("P1 hit");
					//end(MatterCollisionData.bodyA.gameObject.name);
					//this.gameObject.scene.scene.manager.remove('gameScene'); //Remove later, this might be messing things up
					this.gameObject.scene.scene.manager.start('endScene', { winner: 'Player 2' });
				}
				else if ((MatterCollisionData.bodyB.gameObject.name === "P1") && (MatterCollisionData.bodyA.gameObject.texture.key === "asheet")) {
					//end(MatterCollisionData.bodyb.gameObject.name);
					//console.log("P1 hit");
					//this.gameObject.scene.scene.manager.remove('gameScene');
					this.gameObject.scene.scene.manager.start('endScene', { winner: 'Player 2' });
				}
			}
		})

	},

	update: function (time, delta) {
		player2.update(time, delta);
		//console.log(jackA.anims.getCurrentKey());
		frameCounter = frameCounter + 1;
		if ((frameCounter % 125 == 0) && (obstacles.isFull() == false)) {
			var x = Math.floor(Math.random() * 5);
			var obstacle;
			switch (x) {
				case 0:
					obstacle = this.matter.add.sprite(Phaser.Math.Between(300, 900), -20, 'asheet', 'ball', { shape: shapes.ball }).setVelocity(Phaser.Math.Between(-5, 5), Phaser.Math.Between(-30, 30));
					obstacles.add(obstacle);
					//console.log(obstacle.body);
					break;
				case 1:
					obstacle = this.matter.add.sprite(Phaser.Math.Between(300, 900), -50, 'asheet', 'box', { shape: shapes.box }).setVelocity(Phaser.Math.Between(-5, 5), Phaser.Math.Between(-30, 30));
					obstacles.add(obstacle);
					break;
				case 2:
					obstacle = this.matter.add.sprite(Phaser.Math.Between(300, 900), -50, 'asheet', 'manyspike', { shape: shapes.manyspike }).setVelocity(Phaser.Math.Between(-5, 5), Phaser.Math.Between(-30, 30));
					obstacles.add(obstacle);
					break;
				case 3:
					obstacle = this.matter.add.sprite(Phaser.Math.Between(300, 900), -50, 'asheet', 'spike', { shape: shapes.spike }).setVelocity(Phaser.Math.Between(-5, 5), Phaser.Math.Between(-30, 30));
					obstacles.add(obstacle);
					break;
				case 4:
					obstacle = this.matter.add.sprite(Phaser.Math.Between(300, 900), -50, 'asheet', 'spikyball', { shape: shapes.spikyball }).setVelocity(Phaser.Math.Between(-5, 5), Phaser.Math.Between(-30, 30));
					obstacles.add(obstacle);
					break;
			}
			obstacle.setBounce(1.25);
			
			var timer = this.time.addEvent({
				delay: 6000,
				callback: function () {
					obstacles.killAndHide(obstacle);
					obstacle.destroy();
				},
			})

		}

		if (cursors.left.isDown) {
			jackA.x += -7;
			jackA.setFlipX(true);
			if (jackA.body.position.y > 610) {

				if (jackA.anims.getCurrentKey() != 'run') {
					jackA.play('run');
				}
			}
		}
		else if (cursors.right.isDown) {
			jackA.x += 7;
			jackA.setFlipX(false);
			if (jackA.body.position.y > 610) {

				if (jackA.anims.getCurrentKey() != 'run') {
					jackA.play('run');
				}
			}
		}
		else {
			jackA.setVelocityX(0);
		}

		if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
			if (jackA.body.position.y > 610) {
				jackA.play('jump');
				jackA.setVelocityY(-13);
			}

		}

		if (WASD.A.isDown) {
			jackB.x += -7;
			jackB.setFlipX(true);
			if (jackB.body.position.y > 610) {

				if (jackB.anims.getCurrentKey() != 'run') {
					jackB.play('run');
				}
			}
		}
		else if (WASD.D.isDown) {
			jackB.x += 7;
			jackB.setFlipX(false);
			if (jackB.body.position.y > 610) {

				if (jackB.anims.getCurrentKey() != 'run') {
					jackB.play('run');
				}
			}
		}
		else {
			jackB.setVelocityX(0);
			jackB.play('idle');
		}

		if (Phaser.Input.Keyboard.JustDown(WASD.W)) {
			if (jackB.body.position.y > 610) {
				jackB.play('jump');
				jackB.setVelocityY(-13);
			}

		}

	}

});

export default GameScene;