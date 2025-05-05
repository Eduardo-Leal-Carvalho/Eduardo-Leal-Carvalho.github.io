import Player from '../player.js';
import Slime from '../slime.js';


let inputCode = document.getElementById("inputCode");

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


function readPlayerCode() {
    inputCode = document.getElementById("inputCode");
    breakCode = inputCode.value.split('\n');
    index = ++index;
}

export default class tutorial extends Phaser.Scene {
    constructor(config) {
        super({ key: 'tutorial', active: false })

    }

    preload() {
        // map tiles
        this.load.image('Dungeon_Tileset', 'sprites/character and tileset/Dungeon_Tileset.png');
        // map in json format
        this.load.tilemapTiledJSON('map', 'sprites/scenes/scene1.json');
        // load player sprite for target
        this.load.spritesheet('playerSprite', 'sprites/Soldier/Soldier/Soldier.png', { frameWidth: 100, frameHeight: 100 });

        Player.preload(this);
        Slime.preload(this);
    }

    create() {
        const map = this.make.tilemap({ key: 'map', width: 480, height: 320, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('Dungeon_Tileset');

        const floor = map.createLayer(0, tileset, 0, 0); // layer index, tileset, x, y
        const walls = map.createLayer(1, tileset, 0, 0);
        const obstacles = map.createLayer(2, tileset, 0, 0);

        //Player.createAnimations(this); //create player animations
        this.player = new Player(this, 120, 264); //create player object
        this.player.createAtributes(); //create player animations

        Slime.createAnimations(this); //create slime animations
        this.slime = new Slime(this, 160, 112); //create slime object
        this.slime.createAtributes(); //create slime animations

        //add world collisions to player
        this.physics.add.collider(this.player, walls);
        walls.setCollisionBetween(0, 6);
        walls.setCollisionBetween(10, 16);
        walls.setCollisionBetween(20, 26);
        walls.setCollisionBetween(30, 36);
        walls.setCollisionBetween(40, 46);

        const wallIndices = [0, 10, 20, 30, 40].flatMap(start =>
            Array.from({ length: 7 }, (_, i) => start + i)
        );

        walls.setTileIndexCallback(wallIndices,this.hitWalls,this);

        //-----TARGET CREATION-----
        //aux target object for manipulating player movemment actions
        this.target = new Phaser.Math.Vector2();
        this.target.x = 0;
        this.target.y = 0;
        //aux target object for manipulating player attack actions
        this.AttackTarget = this.physics.add.sprite(0, 0, 'player').setAlpha(0);
        //Change target collision to match floor size
        this.AttackTarget.setBodySize(16, 16);

        //--------------CAMERA CREATION--------------
        //create camera and define size
        this.cameras.main.setSize(window.innerWidth * 0.7, window.innerHeight); // x y 
        //make camera follow player
        this.cameras.main.startFollow(this.player);
        //creates a boundary for the camera on the map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(4); //Increase camera zoom

        this.physics.world.on('collide', function (gameObject1, gameObject2, body1, body2) {
            body1.stop();
            body2.stop();
            gameObject1.anims.play('idle', true);
            gameObject2.anims.play('standSlime', true);
        });

        window.myScene = this; //make scene accessible from outside
    }

    update() {
        // TODO: command run(left,10) run(up,2) d'sent go to the end of first run
        if (this.slime.active == true) {
            if (index == 0) {
                //action(this.player, this.target); //call action function to make player actions
                this.nextTurn();
                index = --index;
            }

            var distance = Phaser.Math.Distance.BetweenPoints(this.player, this.target); //calculate the diference between x,y targeted to player movement
            //var distanceEnemy = Phaser.Math.Distance.BetweenPoints(this.slime, this.target);

            var isCollided = this.physics.world.collide(this.slime, this.player); //check if player and slime are colliding

            if ((isCollided == true || distance < 1) && this.player.getData('isMoving') == true) { //if player and slime are colliding or distance is less than 16 pixels
                this.player.setData('isMoving', false);
                this.player.body.stop();
                this.player.anims.play('idle', true);
                this.slime.body.stop();
                this.slime.anims.play('idleSlime', true);
                distance = 9999; //reset distance to avoid infinite animation
            }
        }
    }

    hitWalls() {
        // Impede movimento extra
        this.player.body.stop();
        this.player.anims.play('idle', true);
    }

    nextTurn() {

        this.action(this.player, this.slime, this.AttackTarget, this.target); //call action function to make player actions

        index = --index;
    }

    //gameObject = player, gameObject2 = slime, gameObjectTarget = target
    async action(gameObject, gameObject2, gameObjectAttackTarget, gameObjectTarget) {

        for (let i = 0; i < breakCode.length; i++) {
            //separate the function and parameters from player code
            const playerActionFunction = breakCode[i].match(/^\w+(?=\()/);

            if (playerActionFunction[0] == "run") {
                this.player.setData('isMoving', true);
                const playerActionArgs = breakCode[i].match(/(\w+)\(([^,]+),([^)]+)\)/);
                this.player.anims.play('walk', true);
                await this.player.runAction(gameObject, gameObjectTarget, playerActionArgs[2], playerActionArgs[3]);
                await sleepNow(2000);
            }
            if (playerActionFunction[0] == "slash") {
                const playerActionArgs = breakCode[i].match(/\(([^)]+)\)/);
                await this.player.slashAction(gameObject, gameObject2, gameObjectAttackTarget, playerActionArgs[1]);
                await sleepNow(1500)
            }
        }

        await sleepNow(1500);
        document.getElementById("actionButton").innerHTML = 'Turno do oponente';
        document.getElementById("actionButton").disabled = true;

        //this.enemyAction();
    }


}