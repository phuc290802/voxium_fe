<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#0a0b14]/90 backdrop-blur-2xl" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="glass w-full max-w-lg rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <!-- Header Glow -->
        <div class="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
        
        <div class="relative p-10 flex flex-col items-center text-center">
          <!-- Close Button -->
          <button @click="$emit('close')" class="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <!-- Large Avatar -->
          <div class="relative w-32 h-32 mb-8 group">
            <div class="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse"></div>
            <div class="relative h-full w-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] border-2 border-white/20 flex items-center justify-center shadow-2xl">
              <span class="text-5xl font-black text-white tracking-tighter">{{ user.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#12131a] flex items-center justify-center">
              <div class="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>

          <h2 class="text-4xl font-black text-white tracking-tight mb-2">{{ user.username }}</h2>
          <div class="flex items-center gap-3 mb-10">
            <span class="text-[10px] px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-[0.2em]">{{ user.role }}</span>
            <span class="text-[10px] px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black uppercase tracking-[0.2em]">Validated Operative</span>
          </div>

          <!-- Info Grid -->
          <div class="w-full grid grid-cols-2 gap-4 mb-10">
            <div class="bg-white/5 border border-white/5 p-5 rounded-3xl text-left">
              <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
              <p class="text-white font-bold text-sm">Active Protocol</p>
            </div>
            <div class="bg-white/5 border border-white/5 p-5 rounded-3xl text-left">
              <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">ID Hash</p>
              <p class="text-white font-bold text-sm">#{{ user.id.toString().slice(0, 8) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="w-full flex flex-col gap-3">
            <button class="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
              Edit Core Identity
            </button>
            <button @click="$emit('logout')" class="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all">
              Terminate Session
            </button>
          </div>

          <p class="mt-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">Secure Transmission Protocol v4.2.0</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  user: { type: Object, required: true }
});

const emit = defineEmits(['close', 'logout']);
</script>
