<template>
  <div class="flex flex-col items-center">
    <div class="mb-6 flex justify-between w-full px-2">
      <div class="flex flex-col">
        <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Signal Strength</span>
        <span class="text-xl font-black text-white tracking-tighter">{{ score }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">High Frequency</span>
        <span class="text-xl font-black text-indigo-400 tracking-tighter">{{ highScore }}</span>
      </div>
    </div>

    <!-- Game Board -->
    <div 
      class="relative bg-[#0d0e15] border-2 border-white/5 rounded-2xl overflow-hidden shadow-2xl"
      :style="{ width: boardSize + 'px', height: boardSize + 'px' }"
    >
      <!-- Grid Background -->
      <div class="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20">
        <div v-for="i in 400" :key="i" class="border-[0.5px] border-white/5"></div>
      </div>

      <!-- Snake -->
      <div 
        v-for="(seg, idx) in snake" 
        :key="idx"
        class="absolute rounded-sm transition-all duration-100 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        :class="idx === 0 ? 'bg-indigo-400 z-10' : 'bg-indigo-600'"
        :style="{ 
          width: cellSize - 2 + 'px', 
          height: cellSize - 2 + 'px', 
          left: seg.x * cellSize + 1 + 'px', 
          top: seg.y * cellSize + 1 + 'px' 
        }"
      ></div>

      <!-- Food -->
      <div 
        class="absolute bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]"
        :style="{ 
          width: cellSize - 6 + 'px', 
          height: cellSize - 6 + 'px', 
          left: food.x * cellSize + 3 + 'px', 
          top: food.y * cellSize + 3 + 'px' 
        }"
      ></div>

      <!-- Game Over Overlay -->
      <div v-if="gameOver" class="absolute inset-0 bg-[#0a0b14]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-50">
        <h3 class="text-3xl font-black text-white mb-2 tracking-tighter">SIGNAL LOST</h3>
        <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-8">Connection Terminated</p>
        <button 
          @click="resetGame" 
          class="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
        >
          Re-establish Link
        </button>
      </div>

      <!-- Start Overlay -->
      <div v-if="!gameStarted && !gameOver" class="absolute inset-0 bg-[#0a0b14]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-50">
        <button 
          @click="startGame" 
          class="group relative px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all"
        >
          <div class="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-500 transition-colors"></div>
          <span class="relative text-white">Initialize Bot</span>
        </button>
        <p class="text-[8px] text-gray-500 font-bold uppercase mt-6 tracking-widest">Use Arrow Keys or WASD</p>
      </div>
    </div>

    <!-- Controls (Mobile/Touch) -->
    <div class="grid grid-cols-3 gap-2 mt-8 md:hidden">
      <div></div>
      <button @click="changeDirection('up')" class="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">▲</button>
      <div></div>
      <button @click="changeDirection('left')" class="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">◀</button>
      <button @click="changeDirection('down')" class="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">▼</button>
      <button @click="changeDirection('right')" class="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">▶</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const boardSize = 320;
const gridCount = 20;
const cellSize = boardSize / gridCount;

const snake = ref([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
const food = ref({ x: 5, y: 5 });
const direction = ref('up');
const nextDirection = ref('up');
const score = ref(0);
const highScore = ref(localStorage.getItem('snake_highscore') || 0);
const gameStarted = ref(false);
const gameOver = ref(false);
let gameInterval = null;

const startGame = () => {
  gameStarted.value = true;
  gameInterval = setInterval(moveSnake, 150);
};

const moveSnake = () => {
  direction.value = nextDirection.value;
  const head = { ...snake.value[0] };

  if (direction.value === 'up') head.y--;
  if (direction.value === 'down') head.y++;
  if (direction.value === 'left') head.x--;
  if (direction.value === 'right') head.x++;

  // Check collision with walls or self
  if (
    head.x < 0 || head.x >= gridCount || 
    head.y < 0 || head.y >= gridCount || 
    snake.value.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.value.unshift(head);

  // Check collision with food
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10;
    if (score.value > highScore.value) {
      highScore.value = score.value;
      localStorage.setItem('snake_highscore', highScore.value);
    }
    spawnFood();
  } else {
    snake.value.pop();
  }
};

const spawnFood = () => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * gridCount),
      y: Math.floor(Math.random() * gridCount)
    };
    if (!snake.value.some(seg => seg.x === newFood.x && seg.y === newFood.y)) break;
  }
  food.value = newFood;
};

const changeDirection = (dir) => {
  if (dir === 'up' && direction.value !== 'down') nextDirection.value = 'up';
  if (dir === 'down' && direction.value !== 'up') nextDirection.value = 'down';
  if (dir === 'left' && direction.value !== 'right') nextDirection.value = 'left';
  if (dir === 'right' && direction.value !== 'left') nextDirection.value = 'right';
};

const handleKeydown = (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') changeDirection('up');
  if (e.key === 'ArrowDown' || e.key === 's') changeDirection('down');
  if (e.key === 'ArrowLeft' || e.key === 'a') changeDirection('left');
  if (e.key === 'ArrowRight' || e.key === 'd') changeDirection('right');
};

const endGame = () => {
  gameOver.value = true;
  gameStarted.value = false;
  clearInterval(gameInterval);
};

const resetGame = () => {
  snake.value = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
  direction.value = 'up';
  nextDirection.value = 'up';
  score.value = 0;
  gameOver.value = false;
  spawnFood();
  startGame();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  clearInterval(gameInterval);
});
</script>
