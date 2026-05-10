<template>
  <div class="relative max-w-5xl mx-auto" ref="containerRef">
    <!-- Emoji Picker Overlay -->
    <div v-if="showEmojiPicker" class="absolute bottom-full left-0 mb-4 z-50">
      <EmojiPicker @select="addEmoji" />
    </div>

    <!-- Sticker Picker Overlay -->
    <div v-if="showStickerPicker" class="absolute bottom-full left-12 mb-4 z-50">
      <StickerPicker @select="sendSticker" />
    </div>

    <!-- Game Hub Overlay -->
    <div v-if="showGameHub" class="absolute bottom-full left-24 mb-4 z-50">
      <GameHub @select-game="openGame" />
    </div>

    <form @submit.prevent="submit" class="flex gap-4 group items-center">
      <div class="relative flex-1 flex items-center">
        <div class="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-focus-within:bg-indigo-500/10 transition-all duration-500"></div>
        
        <!-- Toggle Buttons (Fixed Layout) -->
        <div class="absolute left-3 z-10 flex items-center gap-0.5 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-lg">
          <!-- Emoji Toggle -->
          <button type="button" @click="toggleEmoji" class="p-1.5 text-gray-500 hover:text-indigo-400 transition-colors" :class="{ 'text-indigo-400': showEmojiPicker }">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>

          <!-- Sticker Toggle -->
          <button type="button" @click="toggleSticker" class="p-1.5 text-gray-500 hover:text-indigo-400 transition-colors" :class="{ 'text-indigo-400': showStickerPicker }">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
          </button>

          <!-- Game Hub Toggle -->
          <button type="button" @click="toggleGameHub" class="p-1.5 text-gray-500 hover:text-indigo-400 transition-colors" :class="{ 'text-indigo-400': showGameHub }">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
          </button>

          <!-- Image/File Upload -->
          <button type="button" @click="triggerFileInput" class="p-1.5 text-gray-500 hover:text-indigo-400 transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </button>

          <div class="w-[1px] h-4 bg-white/10 mx-1"></div>

          <!-- PLUS BUTTON for extra services -->
          <button type="button" @click="showMoreMenu = !showMoreMenu" class="p-1.5 text-indigo-400 hover:scale-125 transition-all">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          </button>
        </div>

        <input 
          ref="inputRef"
          v-model="content" 
          @input="onInput"
          type="text" 
          placeholder="TRANSMIT MESSAGE..." 
          class="relative w-full pl-52 pr-14 py-5 bg-white/5 border border-white/10 rounded-[1.8rem] focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all duration-300 text-white placeholder:text-gray-600 font-bold tracking-widest text-xs uppercase"
        />

        <!-- MORE MENU OVERLAY -->
        <div v-if="showMoreMenu" class="absolute bottom-full left-44 mb-4 z-50 glass rounded-3xl p-3 border border-white/10 flex flex-col gap-2 min-w-[180px] shadow-2xl">
          <button @click="openWhiteboard" class="flex items-center gap-3 p-3 hover:bg-indigo-500/10 rounded-2xl transition-all group/item">
            <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-indigo-400">
               <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/item:text-white">Nexus Board</span>
          </button>
          <button @click="openLogicTree" class="flex items-center gap-3 p-3 hover:bg-indigo-500/10 rounded-2xl transition-all group/item">
            <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-indigo-400">
               <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" /></svg>
            </div>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/item:text-white">Logic Tree</span>
          </button>
        </div>
      </div>
      
      <button 
        type="submit" 
        :disabled="!content.trim()"
        class="relative group/btn h-[60px] w-[60px] flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:grayscale flex-shrink-0 active:scale-90"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] group-hover/btn:rotate-6 group-hover/btn:scale-110 transition-all duration-300"></div>
        <svg width="24" height="24" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24" class="relative z-10 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>

    <!-- Whiteboard Modal -->
    <WhiteboardModal :show="showWhiteboard" @close="showWhiteboard = false" />
    
    <!-- Logic Tree Modal -->
    <LogicTreeModal :show="showLogicTree" @close="showLogicTree = false" />

    <!-- Game Modal -->
    <GameModal :show="showGameModal" :game="selectedGame" @close="showGameModal = false" />

    <!-- Global Drop Zone Overlay (Aesthetic from Logic Matrix) -->
    <div 
      v-if="isDragging" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-purple-900/40 backdrop-blur-xl animate-in fade-in duration-300"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @mousedown.self="isDragging = false"
    >
      <div class="w-full max-w-2xl h-[450px] glass-purple rounded-[3rem] border-4 border-dashed border-purple-400/30 flex flex-col items-center justify-center text-center p-10 relative overflow-hidden pointer-events-auto">
        <!-- Energy Sphere Visual -->
        <div class="relative mb-10">
          <div class="w-32 h-32 relative">
            <div class="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-t-purple-400 rounded-full animate-spin"></div>
            <div class="absolute inset-6 border-2 border-indigo-400/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg width="48" height="48" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
          </div>
        </div>
        <h3 class="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">SYNC VISUAL DATA</h3>
        <p class="text-[12px] text-purple-200/60 font-bold uppercase tracking-[0.4em] mb-10">Neural transmission via drag, paste or browse</p>
        
        <div class="flex gap-4 w-full max-w-sm">
          <button @click="fileInputRef.click()" class="flex-1 py-4 bg-white text-purple-600 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-purple-50 transition-all shadow-xl">Browse Files</button>
          <button @click="isDragging = false" class="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
        </div>

        <!-- Decorative corner glows -->
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[80px]"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[80px]"></div>
      </div>
    </div>

    <!-- Hidden Inputs -->
    <input type="file" ref="fileInputRef" class="hidden" accept="image/*" @change="handleFileChange" />
  </div>
</template>

<style scoped>
.glass-purple {
  background: rgba(139, 92, 246, 0.1);
  backdrop-filter: blur(20px);
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import EmojiPicker from './EmojiPicker.vue';
import StickerPicker from './StickerPicker.vue';
import GameHub from './GameHub.vue';
import GameModal from './GameModal.vue';
import WhiteboardModal from './WhiteboardModal.vue';
import LogicTreeModal from './LogicTreeModal.vue';

const emit = defineEmits(['send', 'typing']);
const content = ref('');
const showEmojiPicker = ref(false);
const showStickerPicker = ref(false);
const showGameHub = ref(false);
const showGameModal = ref(false);
const showWhiteboard = ref(false);
const showLogicTree = ref(false);
const showMoreMenu = ref(false);
const isDragging = ref(false);
const selectedGame = ref(null);

const inputRef = ref(null);
const fileInputRef = ref(null);
const containerRef = ref(null);

const onInput = () => {
  emit('typing');
};

const toggleEmoji = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
  showStickerPicker.value = false;
  showGameHub.value = false;
  showMoreMenu.value = false;
};

const toggleSticker = () => {
  showStickerPicker.value = !showStickerPicker.value;
  showEmojiPicker.value = false;
  showGameHub.value = false;
  showMoreMenu.value = false;
};

const toggleGameHub = () => {
  showGameHub.value = !showGameHub.value;
  showEmojiPicker.value = false;
  showStickerPicker.value = false;
  showMoreMenu.value = false;
};

const openWhiteboard = () => {
  showWhiteboard.value = true;
  showMoreMenu.value = false;
};

const openLogicTree = () => {
  showLogicTree.value = true;
  showMoreMenu.value = false;
};

const closePickers = () => {
  showEmojiPicker.value = false;
  showStickerPicker.value = false;
  showGameHub.value = false;
  showMoreMenu.value = false;
};

const handleGlobalPaste = (e) => {
  if (showLogicTree.value) return;
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      processFile(blob);
      e.preventDefault();
      break;
    }
  }
};

const handleDragEnter = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e) => {
  e.preventDefault();
  if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
    isDragging.value = false;
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  }
};

const processFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    emit('send', `[image]:${e.target.result}`);
  };
  reader.readAsDataURL(file);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
  showMoreMenu.value = false;
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) processFile(file);
};

// Click outside logic
const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    closePickers();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  window.addEventListener('paste', handleGlobalPaste);
  window.addEventListener('dragenter', handleDragEnter);
  window.addEventListener('dragleave', handleDragLeave);
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', handleDrop);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  window.removeEventListener('paste', handleGlobalPaste);
  window.removeEventListener('dragenter', handleDragEnter);
  window.removeEventListener('dragleave', handleDragLeave);
  window.removeEventListener('drop', handleDrop);
});

const addEmoji = (emoji) => {
  content.value += emoji;
  inputRef.value?.focus();
};

const sendSticker = (url) => {
  emit('send', `[sticker]:${url}`);
  showStickerPicker.value = false;
};

const openGame = (game) => {
  selectedGame.value = game;
  showGameModal.value = true;
  showGameHub.value = false;
};

const submit = () => {
  if (content.value.trim()) {
    emit('send', content.value);
    content.value = '';
    closePickers();
  }
};
</script>
