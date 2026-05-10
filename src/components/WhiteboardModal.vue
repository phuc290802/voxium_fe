<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-xl" @click="$emit('close')"></div>
      
      <div class="relative w-full h-full max-w-6xl bg-[#0d0e16] rounded-[2.5rem] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        <!-- Toolbar -->
        <div class="p-6 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <div class="flex flex-col">
              <h2 class="text-xl font-black text-white tracking-tighter uppercase">Nexus Board</h2>
              <span class="text-[8px] font-black text-indigo-400 tracking-[0.3em] uppercase mt-0.5">Offline Creative Matrix</span>
            </div>
            
            <div class="h-8 w-[1px] bg-white/10 mx-2"></div>

            <!-- Colors -->
            <div class="flex gap-2">
              <button 
                v-for="c in colors" 
                :key="c"
                @click="color = c"
                class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-90"
                :style="{ backgroundColor: c, borderColor: color === c ? 'white' : 'transparent' }"
              ></button>
            </div>

            <div class="h-8 w-[1px] bg-white/10 mx-2"></div>

            <!-- Brush Size -->
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Size</span>
              <input type="range" v-model="lineWidth" min="1" max="50" class="w-32 accent-indigo-500" />
              <span class="text-[10px] font-mono text-white w-6">{{ lineWidth }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button @click="clearCanvas" class="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Clear Matrix</button>
            <button @click="downloadCanvas" class="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Extract Data</button>
            <button @click="$emit('close')" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">✕</button>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="flex-1 relative bg-white cursor-crosshair overflow-hidden" ref="canvasContainer">
          <canvas 
            ref="canvasRef"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="startDrawingTouch"
            @touchmove="drawTouch"
            @touchend="stopDrawing"
            class="absolute inset-0"
          ></canvas>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const canvasRef = ref(null);
const canvasContainer = ref(null);
const isDrawing = ref(false);
const color = ref('#000000');
const lineWidth = ref(5);
const colors = ['#000000', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

let ctx = null;

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  // Set canvas size to container size
  const container = canvasContainer.value;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
};

watch(() => props.show, (val) => {
  if (val) {
    setTimeout(initCanvas, 100);
  }
});

const startDrawing = (e) => {
  isDrawing.value = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = color.value;
  ctx.lineWidth = lineWidth.value;
};

const draw = (e) => {
  if (!isDrawing.value) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

const startDrawingTouch = (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvasRef.value.getBoundingClientRect();
  isDrawing.value = true;
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.strokeStyle = color.value;
  ctx.lineWidth = lineWidth.value;
};

const drawTouch = (e) => {
  e.preventDefault();
  if (!isDrawing.value) return;
  const touch = e.touches[0];
  const rect = canvasRef.value.getBoundingClientRect();
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
};

const stopDrawing = () => {
  isDrawing.value = false;
};

const clearCanvas = () => {
  if (!ctx) return;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
};

const downloadCanvas = () => {
  const link = document.createElement('a');
  link.download = `nexus-board-${Date.now()}.png`;
  link.href = canvasRef.value.toDataURL();
  link.click();
};

const handleResize = () => {
  if (props.show) {
    // Save content
    const tempImage = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height);
    initCanvas();
    ctx.putImageData(tempImage, 0, 0);
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.glass {
  background: rgba(13, 14, 22, 0.8);
  backdrop-filter: blur(20px);
}
</style>
