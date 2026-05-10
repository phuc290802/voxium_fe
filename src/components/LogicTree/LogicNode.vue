<template>
  <div 
    class="absolute glass-node rounded-3xl border z-20 group/node overflow-hidden"
    :style="{ 
      width: (node.width || 256) + 'px',
      height: (node.height || 160) + 'px',
      transform: `translate(${node.x}px, ${node.y}px)`,
      borderColor: isActive ? '#6366f1' : 'rgba(255,255,255,0.1)',
      boxShadow: isActive 
        ? `0 0 50px rgba(99, 102, 241, 0.4)` 
        : '0 0 20px rgba(255,255,255,0.05)',
      outline: isCopied ? '2px dashed #6366f1' : 'none',
      transition: isInteracting ? 'none' : 'border-color 0.3s, box-shadow 0.3s, transform 0.1s'
    }"
    @mousedown.stop="$emit('start-drag', $event, node)"
    @contextmenu.prevent.stop="$emit('show-context-menu', $event, node)"
    @click.stop="$emit('click-node', node.id)"
  >
    <!-- Drop Zone Overlay (Correctly clipped by parent overflow-hidden) -->
    <div 
      v-if="isImageSyncActive" 
      class="absolute inset-0 z-50 bg-indigo-600/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300"
      @dragover.prevent
      @drop.prevent="$emit('drop-image', $event, node)"
      @paste.stop="$emit('paste-image', $event, node)"
      @mousedown.stop
    >
      <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-bounce">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
      </div>
      <h4 class="text-sm font-black uppercase tracking-widest text-white mb-2">Sync Visual Data</h4>
      <p class="text-[10px] text-white/60 font-bold leading-tight mb-6">DROP IMAGE, CTRL+V OR</p>
      
      <div class="flex flex-col gap-2 w-full">
        <button @click.stop="$emit('trigger-browse')" class="w-full py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg">Browse Files</button>
        <button @click.stop="$emit('cancel-sync')" class="w-full py-3 bg-black/20 hover:bg-black/40 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Cancel Sync</button>
      </div>
    </div>

    <div class="p-5 h-full flex flex-col relative">
      <div class="flex justify-between items-start mb-4 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: node.color }"></div>
          <span class="text-[8px] font-black tracking-widest uppercase" :style="{ color: node.color }">Segment {{ node.id }}</span>
        </div>
        <button @click.stop="$emit('delete-node', node.id)" class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-all">✕</button>
      </div>
      
      <textarea 
        v-model="node.text" 
        class="flex-1 w-full bg-transparent border-none text-white text-sm font-bold focus:outline-none resize-none placeholder:text-gray-700 custom-scrollbar"
        placeholder="TRANSMIT LOGIC..."
      ></textarea>

      <!-- Image Preview -->
      <div v-if="node.image" class="mt-4 relative rounded-2xl overflow-hidden border border-white/10 group/img flex-shrink-0 max-h-[50%]">
        <img :src="node.image" class="w-full h-full object-cover" />
        <button @click.stop="node.image = null" class="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-500">
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      
      <!-- Node Controls -->
      <div class="mt-auto pt-4 flex items-center justify-between gap-3 flex-shrink-0">
        <div class="flex gap-1">
          <button 
            v-for="c in nodeColors" 
            :key="c"
            @click.stop="node.color = c"
            class="w-3.5 h-3.5 rounded-full border border-white/10 transition-transform hover:scale-125"
            :style="{ backgroundColor: c, ring: node.color === c ? '2px white' : 'none' }"
          ></button>
        </div>
        <button 
          @click.stop="$emit('connect-node', node.id)" 
          class="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border"
          :class="isConnectingFrom ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'"
        >
          {{ isConnectingFrom ? 'Cancel' : 'Interface' }}
        </button>
      </div>
    </div>

    <!-- Resize Handle -->
    <div 
      class="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize flex items-center justify-center group/resize"
      @mousedown.stop.prevent="$emit('start-resize', $event, node)"
    >
      <div class="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/resize:bg-indigo-500 transition-colors"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  node: Object,
  isActive: Boolean,
  isCopied: Boolean,
  isInteracting: Boolean,
  isConnectingFrom: Boolean,
  isImageSyncActive: Boolean,
  nodeColors: Array
});

defineEmits([
  'start-drag', 'start-resize', 'show-context-menu', 
  'click-node', 'delete-node', 'connect-node', 
  'drop-image', 'paste-image', 'trigger-browse', 'cancel-sync'
]);
</script>
