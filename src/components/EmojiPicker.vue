<template>
  <div class="bg-[#161720] border border-white/10 rounded-[2rem] p-6 w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
    <h3 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 px-1">Transmit Emoji</h3>
    
    <!-- Emoji Grid -->
    <div class="h-64 overflow-y-auto custom-scrollbar pr-2">
      <div v-for="(group, name) in emojiGroups" :key="name" class="mb-4">
        <h4 class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 opacity-50">{{ name }}</h4>
        <div class="grid grid-cols-6 gap-2">
          <button 
            v-for="emoji in group" 
            :key="emoji"
            type="button"
            @click="$emit('select', emoji)"
            class="text-2xl hover:scale-125 transition-transform p-1 hover:bg-white/5 rounded-lg active:scale-90"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['select']);

const emojiGroups = {
  'Recent': ['🔥', '🚀', '✨', '💎', '💻', '🔒'],
  'Smileys': ['😀', '😂', '😎', '🤩', '🥳', '🤔', '🫠', '🙃', '👽', '🤖', '💀', '👻'],
  'Objects': ['📱', '⌚', '🕹️', '📡', '🔋', '🔌', '💡', '🧪', '🔭', '🛸', '🛰️', '🪐'],
  'Symbols': ['✔️', '❌', '⚠️', '☢️', '☣️', '⚡', '🌀', '💎', '💠', '🔱', '☯️', '🧿']
};
</script>
