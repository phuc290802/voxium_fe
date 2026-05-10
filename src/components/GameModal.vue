<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-[#0a0b14]/90 backdrop-blur-xl" @click="$emit('close')"></div>
      
      <div class="glass w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <div class="p-8 border-b border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl">
              {{ game?.icon }}
            </div>
            <div>
              <h3 class="text-sm font-black text-white uppercase tracking-widest">{{ game?.name }}</h3>
              <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{{ game?.desc }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-10 flex justify-center">
          <CyberSnake v-if="game?.id === 'snake'" />
          <BlockBreaker v-else-if="game?.id === 'block'" />
          <CyberBird v-else-if="game?.id === 'bird'" />
          <div v-else class="py-20 text-center">
            <div class="text-4xl mb-4">⚙️</div>
            <h4 class="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Game Module Under Development</h4>
            <p class="text-[8px] text-gray-600 font-bold uppercase mt-2 tracking-widest">Protocol encryption in progress...</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import CyberSnake from './CyberSnake.vue';
import BlockBreaker from './BlockBreaker.vue';
import CyberBird from './CyberBird.vue';

const props = defineProps({
  show: Boolean,
  game: Object
});

const emit = defineEmits(['close']);
</script>
