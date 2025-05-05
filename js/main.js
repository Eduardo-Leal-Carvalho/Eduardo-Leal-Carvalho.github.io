import tutorialRun from './tutorialScenes/tutorialRun.js';
import tutorialSlash from './tutorialScenes/tutorialSlash.js';
import tutorial from './tutorialScenes/tutorial.js';
import maintenance from './tutorialScenes/maintenance.js';


function nextTurn(){
        
    this.action();

    index = --index;
}

function readPlayerCode(){
    //inputCode = document.getElementById("inputCode");
    inputCode = document.getElementById("inputCode").addEventListener("click", readPlayerCode);

    breakCode = inputCode.value.split('\n');
    index = ++index;
}

window.onload = function () {
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth * 0.7,
        height: window.innerHeight,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
            }
        },
        scene: [tutorialRun,tutorialSlash, tutorial, maintenance]
    };

    let game = new Phaser.Game(config);

    // Inicializa variáveis globais
    window.index = -1;
    window.flagStop = 1;

    // Associa o evento de clique ao botão
    const actionButton = document.getElementById("actionButton");
    const continueSceneButton = document.getElementById("nextSceneButton");

    actionButton.addEventListener("click", () => {
        const inputCode = document.getElementById("inputCode");
        window.breakCode = inputCode.value.split('\n').map(line => line.trim()).filter(line => line); // Remove espaços e linhas vazias
        window.index++;
        document.getElementById("unfocus").style.backgroundColor = "rgba(0, 0, 0, 0.0)";

        if (window.myScene) {
            window.myScene.nextTurn();
        }
    });
    continueSceneButton.addEventListener("click", () => {
        tutorialStep++;
        document.getElementById("nextSceneButton").style.display = "none"; //esconde o botão de continuar cena
        if(tutorialStep == 1){
            game.scene.stop('tutorialRun');
            game.scene.start('tutorialSlash');
        } 
        if(tutorialStep == 2){
            game.scene.stop('tutorialSlash');
            game.scene.start('maintenance');
        }
    });
};
