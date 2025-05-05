let breakCode;
let flagStop = 1
let actionTurnText = document.getElementById("ActionTurn");
let actionButton = document.getElementById("actionButton");
let actionButtonDisabled = document.getElementById("actionButton").disabled;




//scale the object health bar
function setBarValue(gameObject, bar){
    var aux = gameObject.getData(bar); //get the maxHealth value
    aux = gameObject.getData('health')/gameObject.getData('maxHealth')*100; //calculate the health bar value
    aux = aux.toString()+'%'; //add '%' character to fit css property    

    if(gameObject.getData('name') == 'player'){
        document.getElementById("playerHealthBarFront").style.width = aux; //set player health bar value

    }else if(gameObject.getData('name') == 'slime'){
        document.getElementById("enemyHealthBarFront").style.width = aux; //set enemy health bar value
    }
}

class scene1 extends Phaser.Scene{
    constructor(){
        super('scene1')
    }
    preload(){
       // map tiles
       this.load.image('Dungeon_Tileset', 'sprites/character and tileset/Dungeon_Tileset.png');
       // map in json format
       this.load.tilemapTiledJSON('map', 'sprites/scenes/scene1.json');
       //player sprites
       this.load.spritesheet('player', 'sprites/Soldier/Soldier/Soldier.png', { frameWidth: 100, frameHeight: 100 });
       //enemy sprites
       this.load.spritesheet('slime', 'sprites/slime/slime-spritesheet2.png', { frameWidth: 32, frameHeight: 32 });
    }   
    create(){ 
        const map = this.make.tilemap({ key: 'map', width: 480, height: 320, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('Dungeon_Tileset');

        const floor = map.createLayer(0, tileset, 0, 0); // layer index, tileset, x, y
        const walls = map.createLayer(1, tileset, 0, 0); 
        const obstacles = map.createLayer(2, tileset, 0, 0); 


         //Animation set
         //Player animation
         this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 9, 10, 11, 12, 13, 14, 15, 16] }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'attackX',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 18, 19, 20, 21, 22, 23] }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'jumpAttack',
            frames: this.anims.generateFrameNumbers('player', { frames: [27, 28, 29, 30, 31, 32] }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('player', { frames: [45,46,47,48] }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'attackYDown',
            frames: this.anims.generateFrameNumbers('player', { frames: [63,64,65,66,67,68] }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'attackYUp',
            frames: this.anims.generateFrameNumbers('player', { frames: [72,73,74,75,76,77] }),
            frameRate: 8,
            repeat: 0
        });
        //enemy animation
        this.anims.create({
            key: 'standSlime',
            frames: this.anims.generateFrameNumbers('slime', { frames: [0,1,2,3] }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'walkSlime',
            frames: this.anims.generateFrameNumbers('slime', { frames: [4,5,6,7] }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'dieSlime',
            frames: this.anims.generateFrameNumbers('slime', { frames: [8,9,10,11] }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'attackSlime',
            frames: this.anims.generateFrameNumbers('slime', { frames: [12,13,14,15] }),
            frameRate: 4,
            repeat: 0
        });

        const keysPlayer = [ 'idle', 'walk', 'attackX', 'jumpAttack', 'hurt', 'attackYDown', 'attackYUp']; //auxiliar vector for the animations
        const keysSlime = [ 'standSlime', 'walkSlime', 'dieSlime','attackSlime']; //auxiliar vector for the animations
        //add player sprite with physics
        this.player = this.physics.add.sprite(40, 40, 'player').play('idle');
        this.player.setImmovable(true);
        this.player.setBodySize(16, 16) //Change player collision to match floor size
        this.player.setData('maxHealth', 5); //set slime maxHealth to 5
        this.player.setData('health', 5); //set player health to 5
        this.player.setData('beingAttacked', false); //set player beingAttacked to false
        this.player.setData('name', 'player'); //set player name
        setBarValue(this.player, 'maxHealth'); //update health bar value

        //  Whenever a data value is updated we call this function:
        this.player.on('setdata', function (gameObject, key, value) {
            text.setText([
                'maxHealth: ' + player.getData('maxHealth') + 'maxHealth',
                'health: ' + player.getData('health') + 'health',
                'beingAttacked: ' + player.getData('beingAttacked'),
                'name: ' + player.getData('name')
            ]);
        });


        //add world collisions to player
        this.physics.add.collider(this.player, walls);
        walls.setCollisionBetween(0,6);
        walls.setCollisionBetween(10,16);
        walls.setCollisionBetween(20,26);
        walls.setCollisionBetween(30,36);
        walls.setCollisionBetween(40,46);
        this.physics.add.collider(this.player, obstacles);
        obstacles.setCollisionBetween(90,96);

        //aux target object for manipulating player movemment actions
        this.target = new Phaser.Math.Vector2();
        this.target.x = 0;
        this.target.y = 0;

        //aux target object for manipulating player attack actions
        this.AttackTarget = this.physics.add.sprite(0, 0, 'player').setAlpha(0);
        //Change target collision to match floor size
        this.AttackTarget.setBodySize(16, 16);
        
        //create camera and define size
        this.cameras.main.setSize(window.innerWidth*0.7, window.innerHeight); // x y 
        //make camera follow player
        this.cameras.main.startFollow(this.player);
        //creates a boundary for the camera on the map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(5); //Increase camera zoom

        this.slime = this.physics.add.sprite(96, 48); //place enemy slime in the grid
        this.slime.play('standSlime'); //animation function
        this.slime.setData('maxHealth', 5); //set slime maxHealth to 5
        this.slime.setData('health', 5); //set slime health to 5
        this.slime.setData('beingAttacked', false); //set slime beingAttacked to false
        this.slime.setData('name', 'slime'); //set slime name
        setBarValue(this.slime, 'maxHealth'); //update health bar value


        //  Whenever a data value is updated we call this function:
        this.slime.on('setdata', function (gameObject, key, value) {
            text.setText([
                'maxHealth: ' + slime.getData('maxHealth') + 'maxHealth',
                'health: ' + slime.getData('health') + 'health',
                'beingAttacked: ' + slime.getData('beingAttacked'),
                'name: ' + slime.getData('name')
            ]);
        });

       

        this.physics.add.collider(this.player, this.slime);//Add enemy collision to player 
        this.AttackTarget.body.onOverlap = true;

        this.physics.add.overlap(this.AttackTarget, this.slime); //Define overlap between attack collision sprite and enemy sprite
        this.physics.add.overlap(this.AttackTarget, this.player); //Define overlap between attack collision sprite and player sprite

        //Add collision between player and slime
        this.physics.world.addCollider(this.slime, this.player);
        this.player.body.onCollide =  true;
        this.slime.body.onCollide =  true;

        //function activate on attack overlap
        this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) =>
        {
            const health = gameObject2.data.get('health'); //get health value from gameObject2
            if(gameObject2.getData('beingAttacked') == false){
                gameObject2.data.set('health', health - 1); // gameObject2 take damage
                gameObject2.setData('beingAttacked', true);
                setBarValue(gameObject2, 'maxHealth'); //update health bar value
            }

        })
        //function activate on collision overlap
        this.physics.world.on('collide', function(gameObject1, gameObject2, body1, body2) {
            body1.stop();
            body2.stop();
            gameObject1.anims.play('idle', true);
            gameObject2.anims.play('standSlime', true);
            });

    }

    update(){
        
        if(this.slime.active == true){
            if(index == 0){
                this.nextTurn();

            }

            var distance = Phaser.Math.Distance.BetweenPoints(this.player, this.target); //calculate the diference between x,y targeted to player movement
            var distanceEnemy = Phaser.Math.Distance.BetweenPoints(this.slime, this.target);

            if(distance < 1 && flagStop == 1){
                flagStop = 0;
                const actionPlayerPromise = Promise.resolve(1);
                this.player.body.stop();
                this.player.anims.play('idle', true);
            }
            if(distanceEnemy < 1 && flagStop == 1){
                flagStop = 0;
                const actionPlayerPromise = Promise.resolve(1);
                this.slime.body.stop();
                this.slime.anims.play('standSlime', true);
            }
            var isCollided = this.physics.world.collide(this.slime, this.player);


            if(isCollided == true){

                flagStop = 1;
                distance = 0;
                this.player.body.stop();
                this.player.anims.play('idle', true);
                this.slime.body.stop();
                this.slime.anims.play('standSlime', true);
            }
        }

        if(slime.getData('health') == 0){
            this.slime.anims.play('dieSlime', true);
            this.slime.once('animationcomplete', ()=> 
                {
                    this.slime.destroy();
                    //slime.getData('health') = 5;//reset slime life
                }
            )
        }
    }

    nextTurn(){
        
        this.action();

        index = --index;
    }

    async enemyAction(){
        
        var enemyListActions = ['attack'];
        var enemyListDirections = ['right','left','up','down']

        for(let i = 0; i < 3; i++){
            const randomIndex = Math.floor(Math.random() * enemyListActions.length);
            const randomIndexDirection = Math.floor(Math.random() * enemyListDirections.length);
            if(enemyListActions[randomIndex] == "run"){
                var distance = Math.floor(Math.random() * 3)+1;
                this.slime.anims.play('walkSlime', true);  
                this.runAction(this.slime,enemyListDirections[randomIndexDirection],distance);
                
                await sleepNow(2500);
            }
            if(enemyListActions[randomIndex] == "attack"){
                this.AttackTarget.setBodySize(16, 32);  //Change target collision to match two floor sizes
                this.slime.anims.play('attackSlime', false); //Play attack animation one time only
                this.AttackTarget.setPosition(this.slime.body.center.x-24,this.slime.body.center.y); //define target collider to the right block relative to player

                await sleepNow(1500);
                this.player.setData('beingAttacked', false); //set player beingAttacked to default value
                this.slime.anims.play('standSlime', true);
            }
            this.AttackTarget.setPosition(0,0); //reset target collider position
        }
        await sleepNow(500);
        actionTurnText.innerHTML = 'Player Turn';
        document.getElementById("actionButton").innerHTML = 'Ação';
        document.getElementById("actionButton").disabled = false;

        
        this.AttackTarget.setBodySize(16, 16); //Reset target collision to match floor sizes and player attack
        this.AttackTarget.setPosition(0,0); //reset target collider position
    }

    

    //slash([top,down,right,left])
    async slashAction(direction){
            if(direction == "right"){ 
                this.AttackTarget.setPosition(this.player.body.center.x+16,this.player.body.center.y); //define target collider to the right block relative to player
                this.player.setFlipX(false); //invert player animation
                this.player.anims.play('attackX', false); //play attack animation
            }
            if(direction == "left"){
                this.AttackTarget.setPosition(this.player.body.center.x-16,this.player.body.center.y); //define target collider to the right block relative to player
                this.player.setFlipX(true);
                this.player.anims.play('attackX', false); 
            }
            if(direction == "down"){
                this.AttackTarget.setPosition(this.player.body.center.x,this.player.body.center.y+16); //define target collider to the right block relative to player
                this.player.setFlipX(false );
                this.player.anims.play('attackYDown', false); 
            }
            if(direction == "up"){
                this.AttackTarget.setPosition(this.player.body.center.x ,this.player.body.center.y-16); //define target collider to the right block relative to player
                this.player.setFlipX(false );
                this.player.anims.play('attackYUp', false); 
            }
            this.player.anims.playAfterRepeat('idle');
            await sleepNow(1000)
            this.slime.setData('beingAttacked', false); //set slime beingAttacked to default value
            this.AttackTarget.setPosition(0,0);
            slimeBeingAttack = 0;
    }
    
    async action(){

        for (let i = 0; i < breakCode.length; i++) {
            //separate the function and parameters from player code
            const playerActionFunction = breakCode[i].match(/^\w+(?=\()/);
            
            if(playerActionFunction[0] == "run"){
                const playerActionArgs= breakCode[i].match(/(\w+)\(([^,]+),([^)]+)\)/);
                this.player.anims.play('walk', true);
                this.runAction(this.player, playerActionArgs[2],playerActionArgs[3]);
                await sleepNow(2500)
            }
            if(playerActionFunction[0] == "slash"){
                const playerActionArgs = breakCode[i].match(/\(([^)]+)\)/);
                this.slashAction(playerActionArgs[1]);
                await sleepNow(1500)
            }
        }
        await sleepNow(1500); 
        actionTurnText.innerHTML = 'Enemy Turn';
        document.getElementById("actionButton").innerHTML = 'Turno do oponente';
        document.getElementById("actionButton").disabled = true;

        this.enemyAction();
    }
    
}
