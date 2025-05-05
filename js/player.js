const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setBodySize(16, 16);
        this.setOffset(42, 42);
        this.play('idle');
    }

    static preload(scene) {
        scene.load.spritesheet('playerSprite', 'sprites/Soldier/Soldier/Soldier.png', { frameWidth: 100, frameHeight: 100 });
    }
    static createAnimations(scene) {
        //Player animation
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('playerSprite', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNumbers('playerSprite', { frames: [9, 10, 11, 12, 13, 14, 15, 16] }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'attackX',
            frames: scene.anims.generateFrameNumbers('playerSprite', { frames: [18, 19, 20, 21, 22, 23] }),
            frameRate: 8,
            repeat: 0
        });
        scene.anims.create({
            key: 'jumpAttack',
            frames: scene.anims.generateFrameNumbers('playerSprite', { frames: [27, 28, 29, 30, 31, 32] }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'hurt',
            frames: scene.anims.generateFrameNumbers('playerSprite', { frames: [45, 46, 47, 48] }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'attackYDown',
            frames: scene.anims.generateFrameNumbers('playerSprite', { frames: [63, 64, 65, 66, 67, 68] }),
            frameRate: 8,
            repeat: 0
        });
        scene.anims.create({
            key: 'attackYUp',
            frames: scene.anims.generateFrameNumbers('playerSprite', { frames: [72, 73, 74, 75, 76, 77] }),
            frameRate: 8,
            repeat: 0
        });
    }
    //scale the object health bar
    setBarValue(gameObject, bar) {
        var aux = gameObject.getData(bar); //get the bar value
        aux = gameObject.getData('health') / gameObject.getData('maxHealth') * 100; //calculate the health bar percentage
        aux = aux.toString() + '%'; //add '%' character to fit css property    
        document.getElementById("playerHealthBarFront").style.width = aux; //set player health bar value
    }

    createAtributes() {
        this.setData('maxHealth', 5); //set slime maxHealth to 5
        this.setData('health', 5); //set player health to 5
        this.setData('beingAttacked', false); //set player beingAttacked to false
        this.setData('name', 'player'); //set player name
        this.setData('isMoving', false); //set player name
        this.setBarValue(this, 'maxHealth'); //update health bar value


        //  Whenever a data value is updated we call this function:
        this.on('setdata', function (gameObject, key, value) {
            text.setText([
                'maxHealth: ' + player.getData('maxHealth') + 'maxHealth',
                'health: ' + player.getData('health') + 'health',
                'beingAttacked: ' + player.getData('beingAttacked'),
                'name: ' + player.getData('name'),
                'isMoving: ' + player.getData('isMoving')
            ]);
        });
    }


    //run([top,down,right,left],[1,2,3])
    async runAction(gameObject, gameObjectTarget, direction, tilesToWalk) {
        gameObject.anims.play('walk', true);
        if (direction == "right") {
            gameObject.setFlipX(false); //invert player animation
            gameObjectTarget.x = gameObject.body.center.x + (16 * tilesToWalk);
            gameObjectTarget.y = gameObject.body.center.y;
        }
        if (direction == "left") {
            gameObject.setFlipX(true); //invert player animation
            gameObjectTarget.x = gameObject.body.center.x - (16 * tilesToWalk);
            gameObjectTarget.y = gameObject.body.center.y;
        }
        if (direction == "up") {
            gameObjectTarget.x = gameObject.body.center.x;
            gameObjectTarget.y = gameObject.body.center.y - (16 * tilesToWalk);
        }
        if (direction == "down") {
            gameObject.setFlipX(false); //invert player animation
            gameObjectTarget.x = gameObject.body.center.x;
            gameObjectTarget.y = gameObject.body.center.y + (16 * tilesToWalk);
        }
        gameObject.setData('isMoving', true); //set player isMoving to true
        this.scene.physics.moveTo(gameObject, gameObjectTarget.x, gameObjectTarget.y, 30);
    }

    //slash([top,down,right,left])
    async slashAction(gameObject, gameObject2, gameObjectTarget, direction) {
        if (direction == "right") {
            gameObjectTarget.setPosition(gameObject.body.center.x + 16, gameObject.body.center.y); //define target collider to the right block relative to player
            gameObject.setFlipX(false); //invert player animation
            gameObject.anims.play('attackX', false); //play attack animation
        }
        if (direction == "left") {
            gameObjectTarget.setPosition(gameObject.body.center.x - 16, gameObject.body.center.y); //define target collider to the right block relative to player
            gameObject.setFlipX(true);
            gameObject.anims.play('attackX', false);
        }
        if (direction == "down") {
            gameObjectTarget.setPosition(gameObject.body.center.x, gameObject.body.center.y + 16); //define target collider to the right block relative to player
            gameObject.setFlipX(false);
            gameObject.anims.play('attackYDown', false);
        }
        if (direction == "up") {
            gameObjectTarget.setPosition(gameObject.body.center.x, gameObject.body.center.y - 16); //define target collider to the right block relative to player
            gameObject.setFlipX(false);
            gameObject.anims.play('attackYUp', false);
        }
        gameObject.anims.playAfterRepeat('idle');
        await sleepNow(1000)
        gameObject2.setData('beingAttacked', false); //set slime beingAttacked to default value
        gameObjectTarget.setPosition(0, 0);
    }
}