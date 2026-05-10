<template>
  <div class="bg-[#161720] border border-white/10 rounded-[2rem] p-6 w-[350px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Game Hub</h3>
      <span class="text-[8px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-widest border border-indigo-500/20">Beta</span>
    </div>
    
    <!-- Tabs -->
    <div class="flex gap-2 mb-6 p-1 bg-white/5 rounded-2xl">
      <button 
        @click="activeTab = 'single'" 
        class="flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
        :class="activeTab === 'single' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'"
      >
        Single Player
      </button>
      <button 
        @click="activeTab = 'multi'" 
        class="flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
        :class="activeTab === 'multi' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'"
      >
        Multiplayer
      </button>
    </div>

    <!-- Game List -->
    <div class="h-72 overflow-y-auto custom-scrollbar pr-2">
      <div v-if="activeTab === 'single'" class="space-y-3">
        <div 
          v-for="game in singlePlayerGames" 
          :key="game.id"
          @click="$emit('select-game', game)"
          class="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-4"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl" :class="game.color">
            {{ game.icon }}
          </div>
          <div class="flex-1">
            <h4 class="text-xs font-black text-white uppercase tracking-widest">{{ game.name }}</h4>
            <p class="text-[9px] text-gray-500 font-bold uppercase mt-1">{{ game.desc }}</p>
          </div>
          <svg class="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="game in multiPlayerGames" 
          :key="game.id"
          @click="$emit('select-game', game)"
          class="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-4 opacity-60"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl" :class="game.color">
            {{ game.icon }}
          </div>
          <div class="flex-1">
            <h4 class="text-xs font-black text-white uppercase tracking-widest">{{ game.name }}</h4>
            <p class="text-[9px] text-indigo-400/50 font-bold uppercase mt-1">Under Development</p>
          </div>
          <svg class="w-4 h-4 text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['select-game']);
const activeTab = ref('single');

const singlePlayerGames = [
  { 
    id: 'snake', 
    name: 'Cyber Snake', 
    desc: 'Classic grid navigation', 
    icon: '🐍', 
    color: 'from-green-500/20 to-emerald-500/20 text-green-500' 
  },
  { 
    id: 'block', 
    name: 'Block Breaker', 
    desc: 'Bounce & Destroy bricks', 
    icon: '🎾', 
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-500' 
  },
  { 
    id: 'bird', 
    name: 'Cyber Bird', 
    desc: 'Fly through firewalls', 
    icon: '🐦', 
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400' 
  }
];

const multiPlayerGames = [
  {
    id: 'poker',
    name: 'Cyber Poker',
    desc: 'Multiplayer Card Game',
    icon: '🃏',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400'
  }
];
</script>
