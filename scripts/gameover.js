let background_music = new Audio("./audio/background_music.mp3")
background_music.play();
const finalScoreElm = document.getElementById("final-score");
finalScoreElm.innerText = localStorage.getItem("finalScore");
const finalSnitchElm = document.getElementById("snitch-collection");
finalSnitchElm.innerText = localStorage.getItem("numberOfSnitches");
console.log(localStorage.getItem("numberOfSnitches from gameover"));
localStorage.clear();
