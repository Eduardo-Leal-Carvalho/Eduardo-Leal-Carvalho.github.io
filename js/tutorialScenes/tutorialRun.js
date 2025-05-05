import Player from '../player.js';

let inputCode = document.getElementById("inputCode");

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default class tutorialRun extends Phaser.Scene {
    constructor(config) {
        super({ key: 'tutorialRun', active: true})

    }

    preload() {
        // map tiles
        this.load.image('Dungeon_Tileset', 'sprites/character and tileset/Dungeon_Tileset.png');
        // map in json format
        this.load.tilemapTiledJSON('map', 'sprites/scenes/scene1.json');

        Player.preload(this);
    }
    create() {
        const map = this.make.tilemap({ key: 'map', width: 480, height: 320, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('Dungeon_Tileset');

        const floor = map.createLayer(0, tileset, 0, 0);
        const walls = map.createLayer(1, tileset, 0, 0);
        const obstacles = map.createLayer(2, tileset, 0, 0);

        Player.createAnimations(this); //create player animations
        this.player = new Player(this, 120, 264); //create player object
        this.player.createAtributes(); //create player animations

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

        

        window.myScene = this; //make scene accessible from outside
    }

    update() {
        // TODO: command run(left,10) run(up,2) d'sent go to the end of first run
        //TODO: bloquear botão de ação antes da segunda mensagem
        if (this.player.active == true) {
            if (index == 0) {
                this.nextTurn();
                index = --index;
            }
            var distance = Phaser.Math.Distance.BetweenPoints(this.player, this.target); //calculate the diference between x,y targeted to player movement

            if(distance < 1 && flagStop == 1){
                flagStop = 0;
                //const actionPlayerPromise = Promise.resolve(1);
                this.player.body.stop(); // stop player body
                this.player.anims.play('idle', true); //change player animation to idle
                //window.tutorial++;//add var tutorial to change scene
                tutorialText.innerHTML = "Parabéns! Você completou o tutorial do comando Run!<br>Agora vamos aprender o comando Slash!<br>Pressione o botão para continuar!";
                document.getElementById("nextSceneButton").style.display = "block"; //show button to change scene
            }
        }
    }
    

    hitWalls() {
        // Impede movimento extra
        this.player.body.stop();
        this.player.anims.play('idle', true);
    }

    nextTurn() {

        this.action(this.player, this.target); //call action function to make player actions

        index = --index;
    }

    //gameObject = player, gameObject2 = slime, gameObjectTarget = target
    async action(gameObject, gameObjectTarget) {
        
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
        }

        await sleepNow(1500);
    }
}