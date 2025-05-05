import Player from '../player.js';
import Slime from '../slime.js';


let inputCode = document.getElementById("inputCode");

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default class tutorialSlash extends Phaser.Scene {
    constructor(config) {
        super({ key: 'tutorialSlash', active: false })
    }

    preload() {
        // map tiles
        this.load.image('Dungeon_Tileset', 'sprites/character and tileset/Dungeon_Tileset.png');
        // map in json format
        this.load.tilemapTiledJSON('map', 'sprites/scenes/scene1.json');

        this.iterationTutorial = 0; //initialize tutorial iteration for controling tutorial steps
        Player.preload(this);
        Slime.preload(this);
    }
    create() {
        const map = this.make.tilemap({ key: 'map', width: 480, height: 320, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('Dungeon_Tileset');

        const floor = map.createLayer(0, tileset, 0, 0);
        const walls = map.createLayer(1, tileset, 0, 0);
        const obstacles = map.createLayer(2, tileset, 0, 0);

        //Player.createAnimations(this); //create player animations
        Slime.createAnimations(this); //create slime animations
        this.player = new Player(this, 120, 264); //create player object
        this.player.createAtributes(); //create player animations
        this.slime = new Slime(this, 190, 256).setActive(false).setVisible(false); //create slime object

        this.slime.createAtributes(); //create slime atributes

        //aux target object for manipulating player attack actions
        this.AttackTarget = new Player(this, 0, 0).setAlpha(0);
        //Change target collision to match floor size
        this.AttackTarget.setBodySize(13, 13);
        this.AttackTarget.body.onOverlap = false;
        this.physics.add.overlap(this.AttackTarget, this.slime); //Define overlap between attack collision sprite and enemy sprite

        //function activate on attack overlap
        //gameObject1 = attackTarget, gameObject2 = slime
        this.physics.world.on('overlap', (gameObject1, gameObject2) => {
            const health = gameObject2.data.get('health'); //get health value from gameObject2
            if (gameObject2.getData('beingAttacked') == false) {
                gameObject2.data.set('health', health - 1); // gameObject2 take damage

                gameObject2.setData('beingAttacked', true);
                this.slime.setBarValue(gameObject2, 'maxHealth'); //update health bar value
            }

        })

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

        walls.setTileIndexCallback(wallIndices, this.hitWalls, this);

        //Add collision between player and slime
        this.physics.world.addCollider(this.player, this.slime);
        this.player.body.onCollide = true;
        this.slime.body.onCollide = true;

        //function activate on collision overlap
        this.physics.world.on('collide', function (gameObject1, gameObject2, body1, body2) {
            body1.stop();
            body2.stop();
            //gameObject1.anims.play('idle', true);
            gameObject2.anims.play('idleSlime', true);
        });

        //-----TARGET CREATION-----
        //aux target object for manipulating player movemment actions
        this.target = new Phaser.Math.Vector2();
        this.target.x = 0;
        this.target.y = 0;

        //--------------CAMERA CREATION--------------
        //create camera and define size
        this.cameras.main.setSize(window.innerWidth * 0.7, window.innerHeight); // x y 
        //make camera follow player
        this.cameras.main.startFollow(this.player);
        //creates a boundary for the camera on the map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(4); //Increase camera zoom

        tutorialText.innerHTML = "Para atacar utilize o comando slash(direção) no terminal<br>direção = [right,left,up,down]";
        tutorialInput.innerHTML = "slash(right)";
        enemyHealthBar.style.display = "block"; // show enemy health bar

        window.myScene = this; //make scene accessible from outside
    }

    update() {
        // TODO: command run(left,10) run(up,2) d'sent go to the end of first run

        if (this.player.active == true) {
            if (index == 0) {
                this.nextTurn();
                index = --index;
            }
            var distance = Phaser.Math.Distance.BetweenPoints(this.player, this.target); //calculate the diference between x,y targeted to player movement
            this.isMoving = this.player.getData('isMoving');
          
            if (distance < 1 && this.isMoving == true) {
                this.isMoving = this.player.setData('isMoving', false);
                this.player.body.stop(); // stop player body
                this.player.anims.play('idle', true); //change player animation to idle

            }
        }
        //If slime is attacked congratulate player and show button to change scene
        if(this.slime.getData('health') < 5){
            tutorialText.innerHTML = "Parabéns você completou o tutorial do comando Slash!<br>Agora vamos aprender o comando block!<br>Pressione o botão para continuar!";
            document.getElementById("nextSceneButton").style.display = "block"; //show button to change scene
            document.getElementById("actionButton").disabled = true; //enable action button
        }
    }


    hitWalls() {
        // Impede movimento extra
        this.player.body.stop();
        this.player.anims.play('idle', true);
    }

    nextTurn() {
        document.getElementById("actionButton").disabled = true;
        this.iterationTutorial++; //increment tutorial iteration
        this.action(this.player, this.slime, this.target, this.AttackTarget); //call action function to make player actions
        if (this.iterationTutorial == 1) {
            tutorialText.innerHTML = "Agora experimente atacar o  inimigo. Utilize o comando run e slash para se aproximar e atacar";
            this.slime.setActive(true).setVisible(true);
            this.AttackTarget.body.onOverlap = true;
        }

        index = --index;
    }

    //gameObject = player, gameObject2 = slime, gameObjectTarget = target
    async action(gameObject, gameObject2, gameObjectTarget, gameObjectAttackTarget) {
        for (let i = 0; i < breakCode.length; i++) {
            //separate the function and parameters from player code
            const playerActionFunction = breakCode[i].match(/^\w+(?=\()/);

            if (playerActionFunction[0] == "run") {
                const playerActionArgs = breakCode[i].match(/(\w+)\(([^,]+),([^)]+)\)/);
                await this.player.runAction(gameObject, gameObjectTarget, playerActionArgs[2], playerActionArgs[3]);
                await sleepNow(2000);
            }
            else if (playerActionFunction[0] == "slash") {
                const playerActionArgs = breakCode[i].match(/\(([^)]+)\)/);
                await this.player.slashAction(gameObject, gameObject2, gameObjectAttackTarget, playerActionArgs[1]);
                await sleepNow(1000);
            }
        }

        document.getElementById("actionButton").disabled = false; //enable action button
    }
}