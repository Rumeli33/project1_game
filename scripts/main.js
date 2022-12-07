//////////////////////////////// Create game class /////////////////////////////////////////////////////

class Game {
  constructor() {
    this.player = null;
    this.spell = null;
    this.currentLevel = null;
    this.bludgerArr = [];
    this.snitchArr = [];
    this.dementorArr = [];
    this.spellArr = [];
    this.positionsArr = [10, 30, 50];
    this.frame = 0;
    this.score = 0;
    this.startInterval = 0;
    this.restartInterval = 0;
    this.backgroundmusic = new Audio("./audio/background_music.mp3");
    this.playerMove = new Audio("./audio/harry_moving.wav");
    this.bludgerHit = new Audio("./audio/bludger_thud.wav");
    this.snitchCatch = new Audio("./audio/snitch_catch.wav");
    this.shootSpell = new Audio("./audio/spell.wav");
  }
  start() {
    this.player = new Player(); // player created
    this.score = new Score();
    this.currentLevel = new LevelUp();
    this.attachEventlisteners();
    const updateGame = () => {
            this.startInterval = setInterval(() => {
            this.score.update();
            this.score.updateHealth();
            this.score.collectSnitch();
            this.score.levelNum = this.currentLevel.level;
            this.score.updateLevel();
            this.backgroundmusic.play();
            this.frame += 1;
            generateBludgers();
            collisionDetection(this.bludgerArr);
            generateSnitches();
            collisionDetection(this.snitchArr);
            generateDementors();
            collisionDetection(this.dementorArr);
            spellVsDementor(this.dementorArr);
            chkLevelUp(); // checking for Level
          }, 400-100*(this.currentLevel.level-1));
    }
    updateGame();
    const generateBludgers = () => {
      // creating array for bludger positions so that collision can happen.
      let item =
        this.positionsArr[Math.floor(Math.random() * this.positionsArr.length)];
      if (this.frame % 5 === 0) {
        const newBludger = new Obstacle(item, 20);

        this.bludgerArr.push(newBludger);
      }
    };

    const generateDementors = () => {
      // creating array for dementors positions so that collision can happen.
      let item =
        this.positionsArr[Math.floor(Math.random() * this.positionsArr.length)];
      if (this.frame % 13 === 0) {
        const newDementor = new Dementor(item, 20);

        this.dementorArr.push(newDementor);
      }
    };

    const generateSnitches = () => {
      // creating array for snitch positions so that collision can happen.
      let index =
        this.positionsArr[Math.floor(Math.random() * this.positionsArr.length)];
      if (index === this.player.positionY) {
        switch (index) {
          case 10:
            index = index * 3;
            break;
          case 20:
            index = index / 2;
            break;
          case 30:
            index = index / 3;
            break;
        }
      }
      if (this.frame % 30 === 0 && this.snitchArr.length < 1) {
        const newSnitch = new Snitch(index, 20);
        this.snitchArr.push(newSnitch);
      }
    };
    ////////////////////////  Collision detection and movement of bludgers, dementors and snitches ////////////////////////////

    const collisionDetection = (obstacleArr) => {
      obstacleArr.forEach((element) => {
        let typeOfObstacle = element.domElement.id;
        element.moveObstacles(); // Moving bludgers or snitches or dementors
        if (
          this.player.positionX + this.player.width > element.positionX &&
          this.player.positionY === element.positionY
        ) {
          if (typeOfObstacle === "obstacle") {
            this.bludgerHit.play();
            const intervalid1 = setTimeout(() => {
                gameOver();
            }, 500);
            
          } else if (typeOfObstacle === "snitch") {
            this.snitchCatch.play();
            this.score.currentScore += 1000;
            this.score.update();
            this.score.collectedSnitch += 1;
            this.score.collectSnitch();
            element.domElement.remove();
            obstacleArr.shift();
          } else if (typeOfObstacle === "dementor") {
            element.domElement.remove();
            obstacleArr.shift();
            this.player.receivePlayerDamage(element.health);
            this.score.playerHealth = this.player.myhealth;
            this.score.updateHealth();
            if (this.player.myhealth <= 0) {
              gameOver();
            }
          }
        }
        ///check if we need to remove current obstacle
        if (element.positionX <= 0 - element.width) {
          if (typeOfObstacle === "obstacle") {
            this.score.currentScore += 100;
            this.score.update();
          }
          element.domElement.remove();
          obstacleArr.shift(); // remove the obstacle instance from the array as well.
        }
      });
    };

    const spellVsDementor = (demArr) => {
      demArr.forEach((element, index1) => {
        this.spellArr.forEach((bullet, index) => {
          if (
            bullet.positionX + bullet.width > element.positionX &&
            bullet.positionY - this.player.height / 2 === element.positionY
          ) {
            element.receiveDamage(bullet.strength);
            this.score.currentScore += 500;
            this.score.update();
            bullet.domElement.remove();
            this.spellArr.splice(index, 1);
          }
          if (element.health <= 0) {
            demArr.splice(index1, 1);
            element.domElement.remove();
          }
        });
      });
    };

    //////////////////////////checking Level Up ///////////////////////////////////////////////////////
    const chkLevelUp = () => {
        let possibleScoresArrLevel1 = [2000,2100,2200,2300,2400,2500,2600,2700,2800,2900];
        let possibleScoresArrLevel2 = [5000,5100,5200,5300,5400,5500,5600,5700,5800,5900];
        let possibleScoresArrLevel3 = [10000,10100,10200,10300,10400,10500,10600,10700,10800,10900];
        if(this.currentLevel.level === 1 && possibleScoresArrLevel1.includes(this.score.currentScore)){
            stopGame();
            this.currentLevel.changeLevel();
            this.score.updateLevel();
            restartGame();
        }
        else if(this.currentLevel.level === 2 && possibleScoresArrLevel2.includes(this.score.currentScore)){
            stopGame();
            this.score.updateLevel();
            this.currentLevel.changeLevel();
            restartGame();
        }
        else if(this.currentLevel.level === 3 && possibleScoresArrLevel3.includes(this.score.currentScore)){
            stopGame();
            this.score.updateLevel();
            this.currentLevel.changeLevel();
            restartGame();
        }
    }

    const restartGame = () => {
        this.restartInterval = setTimeout(() => {
            this.currentLevel.hideLevelUp();
            updateGame();
        }, 3000);
    }

    const stopGame = () => {
        clearInterval(this.startInterval);
    }


    ////////////////////////////////Game Over ///////////////////////////////////////////////////////////
    const gameOver = () => {
      localStorage.setItem("finalScore", this.score.currentScore.toString());
      localStorage.setItem(
        "numberOfSnitches",
        this.score.collectedSnitch.toString()
      );
      location.href = "./gameover.html";
    };
  }

  attachEventlisteners() {
    // On arrow key press move player or shoot
    document.addEventListener("keydown", (event) => {
      // "ArrowUp" or "ArrowDown" or Spacebar
      if (event.key === "ArrowUp") {
        this.playerMove.play();
        this.player.moveUp();
      } else if (event.key === "ArrowDown") {
        this.playerMove.play();
        this.player.moveDown();
      } else if (event.key === " ") {
        this.shootSpell.play();
        const spell = new Spell( // generate bullets on hitting space.
          this.player.positionX + this.player.width / 2,
          this.player.positionY + this.player.height / 2
        );
        this.spellArr.push(spell);

        setInterval(() => {
          spell.moveRight(); // Shoot bullets
        }, 200);
      }
    });
  }
}

////////////////// Create a class Player ///////////////////////////////////////////////////////////////

class Player {
  constructor() {
    this.width = 15;
    this.height = 20;
    this.positionY = 40 - this.height / 2; // initial position is centered on Y axis.
    this.positionX = 0;
    this.myhealth = 100;
    this.domElement = null;
    this.createDomElement(); // create player dynamically
  }
  receivePlayerDamage(damage) {
    this.myhealth -= damage;
  }
  createDomElement() {
    this.domElement = document.createElement("div");
    this.domElement.id = "player";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.top = this.positionY + "vh";
    this.domElement.style.left = this.positionX + "vw";
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.domElement);
  }
  moveUp() {
    if (this.positionY > 10) {
      this.positionY -= 20;
      this.domElement.style.top = this.positionY + "vh";
    }
  }
  moveDown() {
    if (this.positionY < 50) {
      this.positionY += 20;
      this.domElement.style.top = this.positionY + "vh";
    }
  }
}

////////////////////////// Create Obstacle class //////////////////////////////////////////////////////
class Obstacle {
  constructor(randomPosition, height) {
    this.width = 10;
    this.height = height;
    this.positionY = randomPosition; // fix positions for obstacles randomly
    this.positionX = 85;
    this.domElement = null;
    this.createDomElement(); // create obstacle dynamically
  }

  createDomElement() {
    this.domElement = document.createElement("div");
    this.domElement.id = "obstacle";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.top = this.positionY + "vh";
    this.domElement.style.left = this.positionX + "vw";
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.domElement);
  }
  moveObstacles() {
    this.positionX -= 10;
    this.domElement.style.left = this.positionX + "vw";
  }
}

/////////////////////////// /////// Create Snitch class //////////////////////////////////////////////

class Snitch extends Obstacle {
  constructor(randomNum, height) {
    super(randomNum, height);
  }
  createDomElement() {
    this.domElement = document.createElement("div");
    this.domElement.id = "snitch";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.top = this.positionY + "vh";
    this.domElement.style.left = this.positionX + "vw";
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.domElement);
  }
}

/////////////////////////////////// Create Dementor Class //////////////////////////////////////////

class Dementor extends Obstacle {
  constructor(randomNum, height) {
    super(randomNum, height);
    this.health = 10;
  }
  receiveDamage(damage) {
    this.health -= damage;
  }

  createDomElement() {
    this.domElement = document.createElement("div");
    this.domElement.id = "dementor";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.top = this.positionY + "vh";
    this.domElement.style.left = this.positionX + "vw";
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.domElement);
  }
}

////////////////////// Create Spell(acting as bullets) Class //////////////////////////////////////////////////////////

class Spell {
  constructor(x, y) {
    this.width = 2;
    this.height = 2;
    this.positionX = x;
    this.positionY = y;
    this.domElement = null;
    this.createDomElement();
    this.strength = 10;
  }
  createDomElement() {
    this.domElement = document.createElement("div");
    this.domElement.id = "spell";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.top = this.positionY + "vh";
    this.domElement.style.left = this.positionX + "vw";
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.domElement);
  }

  moveRight() {
    this.positionX += 10;
    this.domElement.style.left = this.positionX + "vw";
  }
}

/////////////////////////// /////// Create Score class //////////////////////////////////////////////

class Score {
  constructor() {
    this.currentScore = 0;
    this.collectedSnitch = 0;
    this.playerHealth = 100;
    this.levelNum = 1;
    this.element = document.getElementById("score");
    this.elementSnitch = document.getElementById("snitch-num");
    this.elementHealth = document.getElementById("health");
    this.elementLevel = document.getElementById("level-num");
  }
  update() {
    this.element.innerText = this.currentScore.toString(); // update score.
  }
  collectSnitch() {
    this.elementSnitch.innerText = this.collectedSnitch.toString(); // update number of reward collected.
  }
  updateHealth() {
    this.elementHealth.innerText = this.playerHealth.toString(); // update player health after hitting dementors.
  }
  updateLevel(){
    this.elementLevel.innerText = this.levelNum.toString(); // update the current Level of play
  }
}

class LevelUp{
    constructor(){
        this.level = 1;
        this.width = 60;
        this.height = 40;
        this.positionX = 10;
        this.positionY = 20;
        this.domElement = null;
        this.createDomElement();
    }
    createDomElement() {
        this.domElement = document.createElement("div");
        this.domElement.id = "levelup";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.top = this.positionY + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElementChild= document.createElement("span");
        this.domElementChildImg = document.createElement("div");
        this.domElementChildImg.id = "level-img";
        this.domElementChild.id = "level-text";
        const boardElm = document.getElementById("board");
        boardElm.appendChild(this.domElement);
        this.domElement.appendChild(this.domElementChildImg);
        this.domElement.appendChild(this.domElementChild);

      }

    changeLevel(){
        this.level +=1;
        this.domElementChild.innerHTML = "";
        this.domElementChild.innerHTML = "Level "+this.level;
        this.domElement.style.display = "flex";
    }
    hideLevelUp(){
        this.domElement.style.display = "none";
    }
}
//////////////////////// Declare global variables and create instance of Player./////////////////////////

const game = new Game();
game.start();
