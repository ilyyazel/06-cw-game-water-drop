// game variables

let gameRunning = false;

let dropMaker;
let timer;

let score = 0;

let timeLeft = 30;

let selectedDifficulty = "normal";

let goal = 20;

let dropSpeed = 1000;

let fallSpeed = 4000;

let badDropChance = 0.25;


// page elements

const scoreDisplay = document.getElementById("score");

const timeDisplay = document.getElementById("time");

const goalDisplay = document.getElementById("goal");

const startButton = document.getElementById("start-btn");

const resetButton = document.getElementById("reset-btn");

const gameMessage = document.getElementById("game-message");

const milestoneMessage =
  document.getElementById("milestone-message");

const difficultyInfo =
  document.getElementById("difficulty-info");

const gameContainer =
  document.getElementById("game-container");

const difficultyButtons =
  document.querySelectorAll(".difficulty-btn");


// winning messages

const winningMessages = [

  "Amazing! You reached the clean water goal!",

  "Great job! Every drop counts!",

  "You did it! Clean water wins!"

];


// losing messages

const losingMessages = [

  "Almost there! Try again!",

  "Keep going! Every drop counts!",

  "So close! Give it another shot!"

];


// milestone messages

const milestones = [

  {
    percent: 0.25,
    message: "Great start!"
  },

  {
    percent: 0.50,
    message: "Halfway there!"
  },

  {
    percent: 0.80,
    message: "Almost there!"
  }

];


// keeps track of shown milestones

let milestonesShown = [];


// button clicks

startButton.addEventListener(
  "click",
  startGame
);

resetButton.addEventListener(
  "click",
  resetGame
);


// difficulty button clicks

difficultyButtons.forEach(button => {

  button.addEventListener("click", () => {

    // dont change during game

    if (gameRunning) return;


    selectedDifficulty =
      button.dataset.difficulty;


    // remove active style

    difficultyButtons.forEach(btn => {
      btn.classList.remove("active");
    });


    // add active style

    button.classList.add("active");


    setDifficulty();

  });

});


// change settings for difficulty

function setDifficulty() {

  if (selectedDifficulty === "easy") {

    goal = 15;

    timeLeft = 30;

    dropSpeed = 1200;

    fallSpeed = 5000;

    badDropChance = 0.15;

    difficultyInfo.textContent =
      "Easy Mode - Reach 15 points!";

  }


  else if (selectedDifficulty === "hard") {

    goal = 25;

    timeLeft = 25;

    dropSpeed = 700;

    fallSpeed = 3000;

    badDropChance = 0.35;

    difficultyInfo.textContent =
      "Hard Mode - Reach 25 points!";

  }


  else {

    goal = 20;

    timeLeft = 30;

    dropSpeed = 1000;

    fallSpeed = 4000;

    badDropChance = 0.25;

    difficultyInfo.textContent =
      "Normal Mode - Reach 20 points!";

  }


  goalDisplay.textContent = goal;

  timeDisplay.textContent = timeLeft;

}


// starts game

function startGame() {

  if (gameRunning) return;


  setDifficulty();


  gameRunning = true;

  score = 0;

  milestonesShown = [];


  scoreDisplay.textContent = score;

  timeDisplay.textContent = timeLeft;

  goalDisplay.textContent = goal;


  gameMessage.textContent = "";

  milestoneMessage.textContent = "";


  startButton.disabled = true;

  resetButton.style.display =
    "inline-block";


  // make drops

  dropMaker = setInterval(
    createDrop,
    dropSpeed
  );


  // game timer

  timer = setInterval(() => {

    timeLeft--;

    timeDisplay.textContent =
      timeLeft;


    if (timeLeft <= 0) {

      endGame();

    }

  }, 1000);

}


// creates drops

function createDrop() {

  if (!gameRunning) return;


  const drop =
    document.createElement("div");


  drop.className =
    "water-drop";


  // chance of dirty drop

  const isBadDrop =
    Math.random() < badDropChance;


  if (isBadDrop) {

    drop.classList.add(
      "bad-drop"
    );

  }


  // random drop size

  const initialSize = 60;

  const sizeMultiplier =
    Math.random() * 0.8 + 0.5;

  const size =
    initialSize * sizeMultiplier;


  drop.style.width =
    `${size}px`;

  drop.style.height =
    `${size}px`;


  // random position

  const gameWidth =
    gameContainer.offsetWidth;


  const xPosition =
    Math.random() *
    (gameWidth - size);


  drop.style.left =
    xPosition + "px";


  // difficulty changes fall speed

  drop.style.animationDuration =
    fallSpeed + "ms";


  // add drop

  gameContainer.appendChild(drop);


  // click drop

  drop.addEventListener(
    "click",
    () => {

      if (!gameRunning) return;


      // dirty water removes point

      if (isBadDrop) {

        score--;

      }


      // clean water adds point

      else {

        score++;

      }


      scoreDisplay.textContent =
        score;


      // check milestones

      checkMilestones();


      // remove clicked drop

      drop.remove();

    }
  );


  // remove missed drop

  drop.addEventListener(
    "animationend",
    () => {

      drop.remove();

    }
  );

}


// milestone checker

function checkMilestones() {

  milestones.forEach(
    (milestone, index) => {

      const milestoneScore =
        Math.ceil(
          goal * milestone.percent
        );


      // only show once

      if (
        score >= milestoneScore &&
        !milestonesShown.includes(index)
      ) {

        milestoneMessage.textContent =
          milestone.message;


        milestonesShown.push(index);


        // remove message after 2 seconds

        setTimeout(() => {

          milestoneMessage.textContent =
            "";

        }, 2000);

      }

    }
  );

}


// ends game

function endGame() {

  gameRunning = false;


  clearInterval(dropMaker);

  clearInterval(timer);


  timeLeft = 0;

  timeDisplay.textContent =
    timeLeft;


  // remove leftover drops

  const drops =
    document.querySelectorAll(
      ".water-drop"
    );


  drops.forEach(drop => {

    drop.remove();

  });


  milestoneMessage.textContent =
    "";


  // player wins

  if (score >= goal) {

    const randomMessage =

      winningMessages[
        Math.floor(
          Math.random() *
          winningMessages.length
        )
      ];


    gameMessage.textContent =
      randomMessage;


    createConfetti();

  }


  // player loses

  else {

    const randomMessage =

      losingMessages[
        Math.floor(
          Math.random() *
          losingMessages.length
        )
      ];


    gameMessage.textContent =
      randomMessage;

  }


  startButton.disabled = false;

  startButton.textContent =
    "Play Again";

}


// resets game

function resetGame() {

  clearInterval(dropMaker);

  clearInterval(timer);


  gameRunning = false;

  score = 0;

  milestonesShown = [];


  setDifficulty();


  scoreDisplay.textContent =
    score;


  gameMessage.textContent =
    "";

  milestoneMessage.textContent =
    "";


  startButton.disabled = false;

  startButton.textContent =
    "Start Game";


  resetButton.style.display =
    "none";


  // clear all drops

  gameContainer.innerHTML =
    "";

}


// confetti when player wins

function createConfetti() {

  const colors = [

    "#FFC907",

    "#2E9DF7",

    "#8BD1CB",

    "#4FCB53",

    "#FF902A"

  ];


  // make confetti pieces

  for (let i = 0; i < 50; i++) {

    const confetti =
      document.createElement("div");


    confetti.className =
      "confetti";


    confetti.style.left =
      Math.random() * 100 + "vw";


    confetti.style.backgroundColor =

      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    confetti.style.animationDelay =
      Math.random() + "s";


    document.body.appendChild(
      confetti
    );


    // remove confetti

    setTimeout(() => {

      confetti.remove();

    }, 3000);

  }

}


// normal difficulty at first

setDifficulty();