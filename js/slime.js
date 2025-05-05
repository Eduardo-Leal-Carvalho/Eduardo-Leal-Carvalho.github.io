export default class slime extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setBodySize(30, 30);
        //this.setOffset(42, 42);
        this.play('idleSlime');
    }
    static preload(scene) {
        //enemy sprites
        scene.load.spritesheet('slime', 'sprites/slime/slime-spritesheet2.png', { frameWidth: 32, frameHeight: 32 });

    }
    static createAnimations(scene) {
        //enemy animation
        scene.anims.create({
            key: 'idleSlime',
            frames: scene.anims.generateFrameNumbers('slime', { frames: [0,1,2,3] }),
            frameRate: 4,
            repeat: -1
        });
        scene.anims.create({
            key: 'walkSlime',
            frames: scene.anims.generateFrameNumbers('slime', { frames: [4,5,6,7] }),
            frameRate: 4,
            repeat: -1
        });
        scene.anims.create({
            key: 'dieSlime',
            frames: scene.anims.generateFrameNumbers('slime', { frames: [8,9,10,11] }),
            frameRate: 4,
            repeat: 0
        });
        scene.anims.create({
            key: 'attackSlime',
            frames: scene.anims.generateFrameNumbers('slime', { frames: [12,13,14,15] }),
            frameRate: 4,
            repeat: 0
        });
    }
    createAtributes(){
        this.setData('maxHealth', 5); //set slime maxHealth to 5
        this.setData('health', 5); //set slime health to 5
        this.setData('beingAttacked', false); //set slime beingAttacked to false
        this.setData('name', 'slime'); //set slime name
    }
    //scale the object health bar
    setBarValue(gameObject, bar) {
        var aux = gameObject.getData(bar); //get the bar value
        aux = gameObject.getData('health') / gameObject.getData('maxHealth') * 100; //calculate the health bar percentage
        aux = aux.toString() + '%'; //add '%' character to fit css property    

        document.getElementById("enemyHealthBarFront").style.width = aux; //set enemy health bar value
        
    }
    
    runAction(gameObject, gameObjectTarget, direction, tilesToWalk) {
        flagStop = 1;
        if (direction == "right") {
            gameObjectTarget.x = gameObject.body.center.x + (16 * tilesToWalk);
            gameObjectTarget.y = gameObject.body.center.y;
        }
        if (direction == "left") {
            gameObjectTarget.x = gameObject.body.center.x - (16 * tilesToWalk);
            gameObjectTarget.y = gameObject.body.center.y;
        }
        if (direction == "up") {
            gameObjectTarget.x = gameObject.body.center.x;
            gameObjectTarget.y = gameObject.body.center.y - (16 * tilesToWalk);
        }
        if (direction == "down") {
            gameObjectTarget.x = gameObject.body.center.x;
            gameObjectTarget.y = gameObject.body.center.y + (16 * tilesToWalk);
        }
        gameObject.setData('isMoving', true); //set player isMoving to true
        this.scene.physics.moveTo(gameObject, gameObjectTarget.x, gameObjectTarget.y, 30);
    }
}