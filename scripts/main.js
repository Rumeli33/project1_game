//////////////////////////////// Create game class /////////////////////////////////////////////////////

class Game {
    constructor(){
        this.player = null;
        this.bludgerArr = [];
        this.snitchArr = [];
        this.positionsArr = [10, 30, 50]; 
        this.frame = 0;
        this.score = 0;
    }
    start() {
        this.player = new Player(); // player created
        this.score = new Score();
        this.attachEventlisteners();
         
          setInterval(() => {
            this.frame += 1;
            generateBludgers();
            collisionDetection(this.bludgerArr);
          }, 500);

          const generateBludgers = () => {
           // creating array for bludger positions so that collision can happen.
            let item = this.positionsArr[Math.floor(Math.random() * this.positionsArr.length)];
            if (this.frame % 4 === 0) {
              const newBludger = new Obstacle(item, 20);
              console.log(this.bludgerArr);
              this.bludgerArr.push(newBludger);
            }
          }
          const intervalid1 = setTimeout(() => {
            setInterval(() => {
              if (this.frame % 60 === 0 && this.snitchArr.length < 1) {
                generateSnitches(); // generate snitch only one at a time in the viewport.
              }
              collisionDetection(this.snitchArr);
            }, 300);
          }, 30000);

          const generateSnitches = () => {
            // creating array for snitch positions so that collision can happen.
            let index = this.positionsArr[Math.floor(Math.random() * this.positionsArr.length)];
            if (index === this.player.positionY) {
              switch (index) {
                case 10:
                  index = index * 2;
                  break;
                case 20:
                  index = index / 2;
                  break;
                case 30:
                  index = index / 3;
                  break;
              }
            }
          
             const newSnitch = new Snitch(index, 10);
            this.snitchArr.push(newSnitch);
          }

          const collisionDetection =(obstacleArr) => {
            obstacleArr.forEach((element) => {
              let typeOfObstacle = element.domElement.id;
              element.moveObstacles(); // Moving bludgers or snitches
              if (
                this.player.positionX + this.player.width > element.positionX &&
                this.player.positionY === element.positionY
              ) {
                if (typeOfObstacle === "obstacle") {
                  gameOver();
                } else if (typeOfObstacle === "snitch") {
                  this.score.currentScore += 1000;
                  this.score.update();
                  this.score.collectedSnitch += 1;
                  this.score.collectSnitch();
                  element.domElement.remove();
                obstacleArr.shift();
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
          
            
          }

          const gameOver = () =>  {
            localStorage.setItem("finalScore", this.score.currentScore.toString());
            localStorage.setItem("numberOfSnitches", this.score.collectedSnitch.toString());
            location.href = "../gameover.html";
            
          }

    }
    
    attachEventlisteners(){                                           // On arrow key press move player.
        document.addEventListener("keydown", (event) => {
            // "ArrowUp" or "ArrowDown"
            if (event.key === "ArrowUp") {
              this.player.moveUp();
            } else if (event.key === "ArrowDown") {
              this.player.moveDown();
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
    this.domElement = null;
    this.createDomElement(); // create player dynamically
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

  //>>>>>>>>>>>>> Moving Player Up or Down <<<<<<<<<<<<<<<<<<<<<<<<<<<<<//

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

/////////////////////////// /////// Create Score class //////////////////////////////////////////////

class Score {
  constructor() {
    this.currentScore = 0;
    this.collectedSnitch = 0;
    this.element = document.getElementById("score");
    this.elementSnitch = document.getElementById("snitch-num");
  }
  update() {
    this.element.innerText = this.currentScore.toString();
  }
  collectSnitch(){
    this.elementSnitch.innerText = this.collectedSnitch.toString();
  }
}

//////////////////////// Declare global variables and create instance of Player./////////////////////////


const game = new Game();
game.start();








