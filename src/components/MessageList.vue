<template>
  <div class="h-full overflow-y-auto px-6 py-10 custom-scrollbar" ref="scrollContainer">
    <div class="flex flex-col space-y-8 max-w-5xl mx-auto">
      <div 
        v-for="(msg, idx) in messages" 
        :key="msg.id || idx"
        class="flex w-full group transition-all duration-300"
        :class="[msg.username === currentUser ? 'justify-end' : 'justify-start']"
      >
        <div 
          class="flex items-end gap-3 max-w-[85%] md:max-w-[70%]"
          :class="[msg.username === currentUser ? 'flex-row-reverse' : 'flex-row']"
        >
          <div 
            v-if="msg.username !== currentUser"
            class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-gray-500 shrink-0 group-hover:border-indigo-500/30 transition-colors"
          >
            {{ (msg.username?.charAt(0) || '?').toUpperCase() }}
          </div>

          <div 
            class="flex flex-col"
            :class="[msg.username === currentUser ? 'items-end' : 'items-start']"
          >
            <span 
              v-if="msg.username !== currentUser" 
              class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1"
            >
              {{ msg.username }}
            </span>
            
            <div 
              class="relative group-hover:scale-[1.01] transition-all duration-300"
              :class="[
                (msg.content?.startsWith('[sticker]:') || msg.content?.startsWith('[image]:') || msg.Content?.startsWith('[sticker]:') || msg.Content?.startsWith('[image]:'))
                  ? '' 
                  : (msg.username === currentUser 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-xl shadow-indigo-600/20 px-6 py-4 rounded-[1.5rem]' 
                      : 'glass text-gray-200 rounded-bl-none border-white/10 px-6 py-4 rounded-[1.5rem]')
              ]"
            >
              <!-- Sticker Rendering -->
              <div v-if="msg.content?.startsWith('[sticker]:') || msg.Content?.startsWith('[sticker]:')" class="relative group/sticker">
                <img :src="(msg.content || msg.Content).replace('[sticker]:', '')" class="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_10px_20px_rgba(99,102,241,0.3)] group-hover/sticker:scale-110 transition-transform duration-500" />
                <div class="absolute -bottom-4 right-0 opacity-0 group-hover/sticker:opacity-100 transition-opacity text-[8px] font-black text-gray-500 uppercase tracking-widest bg-[#0a0b14]/80 px-2 py-1 rounded-full border border-white/5">Digital Asset</div>
              </div>

              <!-- Image Rendering -->
              <div v-else-if="msg.content?.startsWith('[image]:') || msg.Content?.startsWith('[image]:')" class="relative group/image max-w-sm">
                <div class="rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-500 group-hover/image:scale-[1.02]">
                  <img :src="(msg.content || msg.Content).replace('[image]:', '')" class="w-full h-auto max-h-[300px] object-cover block" />
                </div>
                <div class="absolute -bottom-4 right-0 opacity-0 group-hover/image:opacity-100 transition-opacity text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-[#0a0b14]/80 px-2 py-1 rounded-full border border-indigo-500/20">Neural Visual Sync</div>
              </div>

              <!-- Text Rendering -->
              <p v-else class="text-sm md:text-[15px] leading-relaxed break-all font-medium tracking-wide">
                {{ msg.content || msg.Content || '' }}
              </p>
              
              <div 
                v-if="!msg.content?.startsWith('[sticker]:') && !msg.content?.startsWith('[image]:') && !msg.Content?.startsWith('[sticker]:') && !msg.Content?.startsWith('[image]:')"
                class="text-[9px] mt-2 font-bold tracking-widest uppercase opacity-40"
                :class="[msg.username === currentUser ? 'text-white text-right' : 'text-gray-400 text-left']"
              >
                {{ formatTime(msg.createdAt) }}
              </div>
            </div>
            
            <!-- Timestamp for stickers -->
            <div 
              v-if="msg.content?.startsWith('[sticker]:') || msg.content?.startsWith('[image]:')"
              class="text-[8px] mt-2 font-black tracking-[0.2em] uppercase opacity-30 px-2"
              :class="[msg.username === currentUser ? 'text-right' : 'text-left']"
            >
              {{ formatTime(msg.createdAt) }}
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center min-h-[300px]">
        <div class="relative w-20 h-20 mb-8 opacity-20">
            <div class="absolute inset-0 border-2 border-indigo-500 rounded-full animate-ping"></div>
            <div class="absolute inset-0 border border-white rounded-full flex items-center justify-center">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
        </div>
        <h3 class="text-xl font-bold text-white opacity-40 uppercase tracking-[0.3em]">No Transmission Detected</h3>
        <p class="text-[10px] text-gray-600 mt-2 font-black uppercase tracking-widest animate-pulse">Waiting for outgoing signal...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => []
  },
  currentUser: {
    type: String,
    required: true
  }
});

const scrollContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
};

watch(() => props.messages, scrollToBottom, { deep: true });

const formatTime = (isoString) => {
  if (!isoString) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>
