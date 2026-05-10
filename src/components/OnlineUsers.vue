<template>
  <div class="py-6">
    <div class="px-8 py-4 flex items-center justify-between mb-4">
      <h3 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Authorized Signals</h3>
      <span class="bg-indigo-500/10 text-indigo-400 py-1 px-3 rounded-lg text-[10px] font-black border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">{{ uniqueUsers.length }}</span>
    </div>
    <ul class="space-y-1 px-4">
      <li 
        v-for="user in uniqueUsers" 
        :key="user" 
        class="px-4 py-3 flex items-center gap-4 rounded-2xl hover:bg-white/[0.03] transition-all cursor-default group"
      >
        <div class="relative">
          <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 font-bold group-hover:text-white group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all duration-300">
            {{ user.charAt(0).toUpperCase() }}
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0d0e1a] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
        </div>
        <span class="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">{{ user }}</span>
      </li>
      <li v-if="uniqueUsers.length === 0" class="px-8 py-10 text-[10px] text-gray-600 text-center font-black uppercase tracking-[0.2em] italic">
        No active signals
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  users: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Avoid duplicates just in case
const uniqueUsers = computed(() => {
  return [...new Set(props.users)].sort();
});
</script>
