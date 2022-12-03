////////////////// Create a class Player //////////////////////////////////////////////////////////

class Player {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.positionY = 40 - this.width / 2; // initial position is centered on Y axis.
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
      console.log(this.positionY);
    }
  }
  moveDown() {
    if (this.positionY < 50) {
      this.positionY += 20;
      this.domElement.style.top = this.positionY + "vh";
    }
  }
}

////////////////////////// Create Obstacle class ///////////////////////////////////
class Obstacle {
  constructor(randomPosition) {
    this.width = 10;
    this.height = 20;
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
    this.positionX -= 5;
    this.domElement.style.left = this.positionX + "vw";
    console.log(this.positionX);
  }
}

//////////////////////// Declare global variables and create instance of Player.//////////////////////////////////

const player = new Player();

let bludgerArr = [];
let snitchArr = [];

//////////////////////// Move Player Up or Down /////////////////////////////////////////////////////////////////

document.addEventListener("keydown", (event) => {
  // "ArrowUp" or "ArrowDown"
  if (event.key === "ArrowUp") {
    player.moveUp();
  } else if (event.key === "ArrowDown") {
    player.moveDown();
  }
});

///////////////////////// Move Obstacles /////////////////////////////////////////////////////////////////////////

setInterval(() => {
  bludgerArr.forEach((element) => {
    element.moveObstacles();
  });
}, 500);

//////////////////////// Creating multiple Bludgers randomly /////////////////////////////////////////////////////////////

setInterval(() => {
  generateBludgers();
}, 2000);
//////////////////// Generate positions for multiple bludgers //////////////////////////////////////////////////////////

function generateBludgers() {
  let positionsArr = [10, 30, 50]; // creating array for bludger positions so that collision can happen.
  let item = positionsArr[Math.floor(Math.random() * positionsArr.length)];
  const newBludger = new Obstacle(item);
  bludgerArr.push(newBludger);
}
