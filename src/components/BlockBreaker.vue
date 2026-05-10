<template>
  <div class="flex flex-col items-center">
    <div class="mb-6 flex justify-between w-full px-2">
      <div class="flex flex-col">
        <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Bricks Destroyed</span>
        <span class="text-xl font-black text-white tracking-tighter">{{ score }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Level</span>
        <span class="text-xl font-black text-indigo-400 tracking-tighter">{{ level }}</span>
      </div>
    </div>

    <div 
      class="relative bg-[#0d0e15] border-2 border-white/5 rounded-2xl overflow-hidden shadow-2xl cursor-none"
      :style="{ width: boardWidth + 'px', height: boardHeight + 'px' }"
      @mousemove="handleMouseMove"
    >
      <!-- Bricks -->
      <div 
        v-for="brick in bricks" 
        :key="brick.id"
        v-show="!brick.broken"
        class="absolute rounded-md shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-opacity duration-300"
        :class="brick.color"
        :style="{ 
          width: brickWidth - 4 + 'px', 
          height: brickHeight - 4 + 'px', 
          left: brick.x + 2 + 'px', 
          top: brick.y + 2 + 'px' 
        }"
      ></div>

      <!-- Paddle -->
      <div 
        class="absolute bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        :style="{ 
          width: paddleWidth + 'px', 
          height: paddleHeight + 'px', 
          left: paddleX + 'px', 
          bottom: '20px' 
        }"
      ></div>

      <!-- Ball -->
      <div 
        class="absolute bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        :style="{ 
          width: ballSize + 'px', 
          height: ballSize + 'px', 
          left: ballX + 'px', 
          top: ballY + 'px' 
        }"
      ></div>

      <!-- Overlays -->
      <div v-if="gameOver" class="absolute inset-0 bg-[#0a0b14]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-50">
        <h3 class="text-3xl font-black text-white mb-2 tracking-tighter">{{ win ? 'SYSTEM CLEARED' : 'SIGNAL LOST' }}</h3>
        <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-8">{{ win ? 'All blocks decrypted' : 'Connection Terminated' }}</p>
        <button @click="resetGame" class="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Retry Link</button>
      </div>

      <div v-if="!gameStarted && !gameOver" class="absolute inset-0 bg-[#0a0b14]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-50">
        <button @click="startGame" class="group relative px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all">
          <div class="absolute inset-0 bg-indigo-600"></div>
          <span class="relative text-white">Engage Protocol</span>
        </button>
        <p class="text-[8px] text-gray-500 font-bold uppercase mt-6 tracking-widest">Move Mouse to Control Paddle</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const boardWidth = 360;
const boardHeight = 400;
const brickWidth = 45;
const brickHeight = 20;
const paddleWidth = 80;
const paddleHeight = 10;
const ballSize = 10;

const score = ref(0);
const level = ref(1);
const gameStarted = ref(false);
const gameOver = ref(false);
const win = ref(false);

const paddleX = ref(boardWidth / 2 - paddleWidth / 2);
const ballX = ref(boardWidth / 2);
const ballY = ref(boardHeight - 45);
const ballDX = ref(3);
const ballDY = ref(-3);

const bricks = ref([]);
let gameInterval = null;

const createBricks = () => {
  const newBricks = [];
  const rows = 5;
  const cols = 8;
  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-cyan-500', 'bg-emerald-500'];
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      newBricks.push({
        id: r * cols + c,
        x: c * brickWidth,
        y: r * brickHeight + 40,
        broken: false,
        color: colors[r % colors.length]
      });
    }
  }
  bricks.value = newBricks;
};

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  paddleX.value = Math.max(0, Math.min(boardWidth - paddleWidth, x - paddleWidth / 2));
};

const moveBall = () => {
  ballX.value += ballDX.value;
  ballY.value += ballDY.value;

  // Wall collisions
  if (ballX.value <= 0 || ballX.value >= boardWidth - ballSize) ballDX.value *= -1;
  if (ballY.value <= 0) ballDY.value *= -1;

  // Paddle collision
  if (
    ballY.value >= boardHeight - 35 && 
    ballX.value + ballSize >= paddleX.value && 
    ballX.value <= paddleX.value + paddleWidth
  ) {
    ballDY.value = -Math.abs(ballDY.value);
    // Add some spin based on where it hit the paddle
    const hitPos = (ballX.value + ballSize / 2 - paddleX.value) / paddleWidth;
    ballDX.value = 8 * (hitPos - 0.5);
  }

  // Bottom collision (Game Over)
  if (ballY.value >= boardHeight) {
    gameOver.value = true;
    gameStarted.value = false;
    clearInterval(gameInterval);
  }

  // Brick collisions
  bricks.value.forEach(brick => {
    if (!brick.broken) {
      if (
        ballX.value + ballSize >= brick.x && 
        ballX.value <= brick.x + brickWidth && 
        ballY.value + ballSize >= brick.y && 
        ballY.value <= brick.y + brickHeight
      ) {
        brick.broken = true;
        ballDY.value *= -1;
        score.value += 10;
        
        if (bricks.value.every(b => b.broken)) {
          win.value = true;
          gameOver.value = true;
          gameStarted.value = false;
          clearInterval(gameInterval);
        }
      }
    }
  });
};

const startGame = () => {
  gameStarted.value = true;
  gameInterval = setInterval(moveBall, 16);
};

const resetGame = () => {
  score.value = 0;
  gameOver.value = false;
  win.value = false;
  ballX.value = boardWidth / 2;
  ballY.value = boardHeight - 45;
  ballDX.value = 3;
  ballDY.value = -3;
  createBricks();
  startGame();
};

onMounted(() => {
  createBricks();
});

onUnmounted(() => {
  clearInterval(gameInterval);
});
</script>
