<template>
  <div class="flex flex-col items-center">
    <div class="mb-6 flex justify-between w-full px-2">
      <div class="flex flex-col">
        <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Data Packets Collected</span>
        <span class="text-xl font-black text-white tracking-tighter">{{ score }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">High Score</span>
        <span class="text-xl font-black text-cyan-400 tracking-tighter">{{ highScore }}</span>
      </div>
    </div>

    <div 
      class="relative bg-[#0d0e15] border-2 border-white/5 rounded-2xl overflow-hidden shadow-2xl"
      :style="{ width: boardWidth + 'px', height: boardHeight + 'px' }"
      @mousedown="jump"
      @touchstart="jump"
    >
      <!-- Background Parallax Grid -->
      <div class="absolute inset-0 overflow-hidden">
         <div class="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
            <div v-for="i in 100" :key="i" class="border-[0.5px] border-white/5"></div>
         </div>
      </div>

      <!-- Bird (Cyber Drone) -->
      <div 
        class="absolute bg-cyan-500 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-transform duration-100"
        :style="{ 
          width: birdSize + 'px', 
          height: birdSize + 'px', 
          left: birdX + 'px', 
          top: birdY + 'px',
          transform: `rotate(${velocity * 3}deg)`
        }"
      >
        <div class="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-cyan-400 rounded-sm"></div>
        <div class="absolute inset-1 border border-white/20 rounded-sm"></div>
      </div>

      <!-- Pipes (Firewalls) -->
      <template v-for="pipe in pipes" :key="pipe.id">
        <!-- Top Pipe -->
        <div 
          class="absolute bg-gradient-to-b from-indigo-900 to-indigo-600 border-x border-b border-indigo-400/30 rounded-b-xl shadow-[0_5px_15px_rgba(99,102,241,0.2)]"
          :style="{ 
            width: pipeWidth + 'px', 
            height: pipe.topHeight + 'px', 
            left: pipe.x + 'px', 
            top: '0px' 
          }"
        >
          <div class="absolute bottom-2 inset-x-2 h-1 bg-indigo-400/50 rounded-full animate-pulse"></div>
        </div>
        <!-- Bottom Pipe -->
        <div 
          class="absolute bg-gradient-to-t from-indigo-900 to-indigo-600 border-x border-t border-indigo-400/30 rounded-t-xl shadow-[0_-5px_15px_rgba(99,102,241,0.2)]"
          :style="{ 
            width: pipeWidth + 'px', 
            height: (boardHeight - pipe.topHeight - pipeGap) + 'px', 
            left: pipe.x + 'px', 
            bottom: '0px' 
          }"
        >
          <div class="absolute top-2 inset-x-2 h-1 bg-indigo-400/50 rounded-full animate-pulse"></div>
        </div>
      </template>

      <!-- Overlays -->
      <div v-if="gameOver" class="absolute inset-0 bg-[#0a0b14]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-50">
        <h3 class="text-3xl font-black text-white mb-2 tracking-tighter">DROID CRASH</h3>
        <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-8">Hardware Failure Detected</p>
        <button @click="resetGame" class="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Re-deploy Droid</button>
      </div>

      <div v-if="!gameStarted && !gameOver" class="absolute inset-0 bg-[#0a0b14]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-50">
        <button @click="startGame" class="group relative px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all">
          <div class="absolute inset-0 bg-cyan-600"></div>
          <span class="relative text-white">Initialize Flight</span>
        </button>
        <p class="text-[8px] text-gray-500 font-bold uppercase mt-6 tracking-widest">Press SPACE or Click to Boost</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const boardWidth = 320;
const boardHeight = 480;
const birdSize = 24;
const birdX = 50;
const pipeWidth = 50;
const pipeGap = 130;
const gravity = 0.45;
const jumpPower = -7;

const score = ref(0);
const highScore = ref(localStorage.getItem('bird_highscore') || 0);
const gameStarted = ref(false);
const gameOver = ref(false);

const birdY = ref(boardHeight / 2);
const velocity = ref(0);
const pipes = ref([]);
let gameInterval = null;
let nextPipeId = 0;

const startGame = () => {
  gameStarted.value = true;
  gameInterval = setInterval(update, 20);
};

const jump = () => {
  if (!gameStarted.value) return;
  velocity.value = jumpPower;
};

const spawnPipe = () => {
  const minHeight = 50;
  const maxHeight = boardHeight - pipeGap - minHeight;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  
  pipes.value.push({
    id: nextPipeId++,
    x: boardWidth,
    topHeight,
    passed: false
  });
};

const update = () => {
  // Bird Physics
  velocity.value += gravity;
  birdY.value += velocity.value;

  // Ceiling/Floor collision
  if (birdY.value < 0 || birdY.value > boardHeight - birdSize) {
    endGame();
  }

  // Move and check pipes
  pipes.value.forEach(pipe => {
    pipe.x -= 2.5;

    // Collision Detection
    if (
      birdX + birdSize > pipe.x &&
      birdX < pipe.x + pipeWidth &&
      (birdY.value < pipe.topHeight || birdY.value + birdSize > pipe.topHeight + pipeGap)
    ) {
      endGame();
    }

    // Scoring
    if (!pipe.passed && pipe.x < birdX) {
      pipe.passed = true;
      score.value++;
      if (score.value > highScore.value) {
        highScore.value = score.value;
        localStorage.setItem('bird_highscore', highScore.value);
      }
    }
  });

  // Remove off-screen pipes
  pipes.value = pipes.value.filter(pipe => pipe.x > -pipeWidth);

  // Spawn new pipes
  if (pipes.value.length === 0 || pipes.value[pipes.value.length - 1].x < boardWidth - 180) {
    spawnPipe();
  }
};

const endGame = () => {
  gameOver.value = true;
  gameStarted.value = false;
  clearInterval(gameInterval);
};

const resetGame = () => {
  score.value = 0;
  birdY.value = boardHeight / 2;
  velocity.value = 0;
  pipes.value = [];
  gameOver.value = false;
  startGame();
};

const handleKeydown = (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    e.preventDefault();
    jump();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  clearInterval(gameInterval);
});
</script>
