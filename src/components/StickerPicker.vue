<template>
  <div class="bg-[#161720] border border-white/10 rounded-[2rem] p-6 w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
    <h3 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 px-1">Digital Assets</h3>
    
    <!-- Sticker Grid -->
    <div class="h-64 overflow-y-auto custom-scrollbar pr-2">
      <div class="grid grid-cols-3 gap-3">
        <button 
          v-for="sticker in stickers" 
          :key="sticker.id"
          type="button"
          @click="$emit('select', sticker.url)"
          class="aspect-square rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all p-2 group overflow-hidden active:scale-90"
        >
          <img :src="sticker.url" :alt="sticker.id" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['select']);

const stickers = [
  { id: '1', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Rocket.png' },
  { id: '2', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Alien%20Monster.png' },
  { id: '3', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png' },
  { id: '4', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Exploding%20Head.png' },
  { id: '5', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Monocle.png' },
  { id: '6', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Ghost.png' },
  { id: '7', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png' },
  { id: '8', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked%20with%20Key.png' },
  { id: '9', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png' }
];
</script>
