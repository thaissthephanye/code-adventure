// ========== CONFIGURAÇÃO INICIAL ========== //

// Obtém o elemento canvas e seu contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define o tamanho do canvas para ocupar toda a janela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Elementos da UI
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const skillsCount = document.getElementById("skills-count");
const finalScore = document.getElementById("final-score");

// ========== VARIÁVEIS DO JOGO ========== //

// Objeto do jogador
const player = {
  x: 50,
  y: canvas.height - 100,
  width: 40,
  height: 60,
  color: "#6C63FF",
  speed: 5,
  velocityY: 0,
  jumping: false,
  gravity: 0.5,
  friction: 0.9,
};

// Plataformas (cada uma representa um projeto)
const platforms = [
  {
    x: 0,
    y: canvas.height - 40,
    width: 300,
    text: "Portfólio 2024",
    link: "portfolio.html",
  },
  {
    x: 350,
    y: canvas.height - 100,
    width: 200,
    text: "App de Clima",
    link: "weather-app.html",
  },
  {
    x: 600,
    y: canvas.height - 150,
    width: 250,
    text: "E-commerce",
    link: "ecommerce.html",
  },
  {
    x: 900,
    y: canvas.height - 200,
    width: 200,
    text: "Jogo da Memória",
    link: "memory-game.html",
  },
];

// Habilidades para coletar (moedas)
const skills = [
  {
    x: 100,
    y: canvas.height - 80,
    radius: 15,
    collected: false,
    type: "HTML",
    color: "#E44D26",
  },
  {
    x: 400,
    y: canvas.height - 140,
    radius: 15,
    collected: false,
    type: "CSS",
    color: "#2965F1",
  },
  {
    x: 700,
    y: canvas.height - 190,
    radius: 15,
    collected: false,
    type: "JS",
    color: "#F0DB4F",
  },
  {
    x: 950,
    y: canvas.height - 240,
    radius: 15,
    collected: false,
    type: "React",
    color: "#61DBFB",
  },
  {
    x: 1200,
    y: canvas.height - 150,
    radius: 15,
    collected: false,
    type: "Node.js",
    color: "#68A063",
  },
];

// Controles
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
};

// Estado do jogo
let score = 0;
let gameRunning = false;

// ========== EVENT LISTENERS ========== //

// Controles de teclado
document.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp"].includes(e.key)) {
    keys[e.key] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp"].includes(e.key)) {
    keys[e.key] = false;
  }
});

// Botões da interface
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// ========== FUNÇÕES DO JOGO ========== //

// Inicia o jogo
function startGame() {
  startScreen.classList.add("hidden");
  gameRunning = true;
  animate();
}

// Reinicia o jogo
function restartGame() {
  endScreen.classList.add("hidden");
  score = 0;
  skillsCount.textContent = score;

  // Reseta as habilidades
  skills.forEach((skill) => {
    skill.collected = false;
  });

  // Reseta a posição do jogador
  player.x = 50;
  player.y = canvas.height - 100;
  player.velocityY = 0;
  player.jumping = false;

  gameRunning = true;
  animate();
}

// Loop principal de animação
function animate() {
  if (!gameRunning) return;

  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Atualiza a posição do jogador
  updatePlayer();

  // Desenha todos os elementos
  drawPlatforms();
  drawSkills();
  drawPlayer();

  // Verifica se coletou todas as habilidades
  if (score === skills.length) {
    endGame();
  }

  requestAnimationFrame(animate);
}

// Atualiza a posição e física do jogador
function updatePlayer() {
  // Movimento horizontal
  if (keys.ArrowLeft) {
    player.x -= player.speed;
  }
  if (keys.ArrowRight) {
    player.x += player.speed;
  }

  // Pulo
  if (keys.ArrowUp && !player.jumping) {
    player.velocityY = -15;
    player.jumping = true;
  }

  // Aplica gravidade
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  // Limita o jogador às bordas do canvas
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  // Verifica colisão com plataformas
  let onGround = false;
  platforms.forEach((platform) => {
    // Colisão vertical
    if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + 20 &&
      player.velocityY > 0
    ) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.jumping = false;
      onGround = true;
    }
  });

  // Se não estiver em uma plataforma e estiver caindo
  if (!onGround && player.y + player.height < canvas.height) {
    player.jumping = true;
  }

  // Verifica colisão com habilidades
  skills.forEach((skill) => {
    if (
      !skill.collected &&
      player.x + player.width > skill.x - skill.radius &&
      player.x < skill.x + skill.radius &&
      player.y + player.height > skill.y - skill.radius &&
      player.y < skill.y + skill.radius
    ) {
      skill.collected = true;
      score++;
      skillsCount.textContent = score;
      // Poderia adicionar um efeito sonoro aqui
    }
  });
}

// Desenha as plataformas
function drawPlatforms() {
  platforms.forEach((platform) => {
    // Plataforma
    ctx.fillStyle = "#2D2D2D";
    ctx.fillRect(platform.x, platform.y, platform.width, 20);

    // Texto da plataforma
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.fillText(platform.text, platform.x + 10, platform.y - 10);
  });
}

// Desenha as habilidades (moedas)
function drawSkills() {
  skills.forEach((skill) => {
    if (!skill.collected) {
      // Moeda
      ctx.beginPath();
      ctx.arc(skill.x, skill.y, skill.radius, 0, Math.PI * 2);
      ctx.fillStyle = skill.color;
      ctx.fill();

      // Detalhe da moeda
      ctx.beginPath();
      ctx.arc(skill.x, skill.y, skill.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD700";
      ctx.fill();

      // Texto da habilidade (aparece quando perto)
      if (
        Math.abs(player.x - skill.x) < 100 &&
        Math.abs(player.y - skill.y) < 100
      ) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px Arial";
        ctx.fillText(skill.type, skill.x - 15, skill.y - skill.radius - 5);
      }
    }
  });
}

// Desenha o jogador
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Olhos do jogador (para dar personalidade)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(player.x + 10, player.y + 15, 8, 8);
  ctx.fillRect(player.x + 22, player.y + 15, 8, 8);

  // Sorriso
  ctx.beginPath();
  ctx.arc(player.x + 20, player.y + 30, 8, 0, Math.PI);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Finaliza o jogo
function endGame() {
  gameRunning = false;
  finalScore.textContent = score;
  endScreen.classList.remove("hidden");
}

// Redimensiona o canvas quando a janela é redimensionada
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
