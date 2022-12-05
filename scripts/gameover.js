const finalScoreElm = document.getElementById("final-score");
finalScoreElm.innerText = localStorage.getItem("finalScore");

const finalSnitchElm = document.getElementById("snitch-collection");
finalSnitchElm.innerText = localStorage.getItem("numberOfSnitches");
localStorage.clear();
