// Initialisation et Configuration du jeu Flappy Bird en JavaScript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// Paramètres general du jeu 
let gamePlaying = false;
const gravity = .5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

// Variables pour les pipes
let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

// paramètres des tuyaux
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

// setup pour le jeu
const setup = () => {
  currentScore = 0;
  flight = jump;

  // Position de départ du joueur
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // Position de départ des 3 premier tuyaux
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

// Fonction pour dessiner les éléments du jeu
const render = () => {
  // Dessiner le fond
  index++;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // Dessiner les tuyaux
  if (gamePlaying) {
    pipes.map(pipe => {
      pipe[0] -= speed;

      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }
      
      // Vérifier les collisions
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  
  // Dessiner le joueur
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  // Mettre à jour les scores affichés
  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  window.requestAnimationFrame(render);
}

// lance le jeu
setup();
img.onload = render;
document.addEventListener('click', () => {
  gamePlaying = true;
  flight = jump;
});

// Gérer les touches du joueur
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'KeyQ') {
    flight = jump;
  }
});
