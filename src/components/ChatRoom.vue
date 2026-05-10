<template>
<div class="flex h-screen w-screen bg-[#0a0b14] overflow-hidden relative font-['Outfit']">
    <!-- Background Glows -->
    <div class="glow-bg top-[-10%] left-[-10%] opacity-10"></div>
    <div class="glow-bg bottom-[-10%] right-[-10%] opacity-10" style="background: radial-gradient(circle, var(--purple) 0%, transparent 70%)"></div>
    
    <!-- FULL SCREEN ERROR OVERLAY -->
    <div v-if="wsErrorMsg" class="absolute inset-0 bg-[#0a0b14]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
        <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h2 class="text-4xl font-black text-white mb-4 tracking-tight">ACCESS DENIED</h2>
      <p class="text-gray-400 max-w-sm mb-10 leading-relaxed uppercase tracking-widest text-xs font-bold">{{ wsErrorMsg }}</p>
      <button @click="$emit('leave')" class="px-10 py-4 bg-white text-black rounded-2xl font-black hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">RETREAT</button>
    </div>

    <!-- FULL SCREEN LOADING OVERLAY -->
    <div v-else-if="!isConnected" class="absolute inset-0 bg-[#0a0b14]/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <div class="relative w-20 h-20 mb-8">
        <div class="absolute inset-0 border-4 border-white/5 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-indigo-400 font-black tracking-[0.3em] animate-pulse uppercase">Syncing Frequency...</p>
    </div>

    <!-- Sidebar -->
    <div class="w-80 glass border-r border-white/5 flex flex-col hidden md:flex z-20 relative">
      <div class="p-8 border-b border-white/5 flex justify-between items-start">
        <div class="min-w-0">
          <h2 class="text-3xl font-black text-gradient tracking-tight">CHATTY</h2>
          <div class="mt-4 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">{{ roomData?.name || 'INITIALIZING...' }}</span>
          </div>
        </div>
        <button v-if="isAdmin" @click="showSettings = true" class="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <OnlineUsers :users="presenceUsers" />
      </div>
      
      <div class="p-6 border-t border-white/5 bg-white/[0.02]">
        <div class="flex items-center gap-4 mb-6 px-2 cursor-pointer group/user" @click="showProfileModal = true">
          <div class="relative">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/10 shrink-0 group-hover/user:scale-110 transition-transform">
              {{ user.username.charAt(0).toUpperCase() }}
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0b14] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-white truncate uppercase tracking-widest group-hover/user:text-indigo-400 transition-colors">{{ user.username }}</div>
            <div class="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{{ user.role }} Status: Core</div>
          </div>
        </div>
        <button 
          @click="$emit('leave')"
          class="w-full group relative py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all overflow-hidden border border-red-500/30 text-red-400 hover:text-white"
        >
          <div class="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span class="relative z-10 flex items-center justify-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Abort Connection
          </span>
        </button>
      </div>
    </div>
    
    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col h-full relative z-10">
      <!-- Mobile Header -->
      <div class="md:hidden glass border-b border-white/5 p-5 flex justify-between items-center shadow-lg z-20">
        <div class="font-black text-gradient text-xl">CHATTY</div>
        <div class="flex gap-4">
            <button v-if="isAdmin" @click="showSettings = true" class="text-gray-400 hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></button>
            <button @click="$emit('leave')" class="text-xs font-black text-red-500 tracking-widest">ABORT</button>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-hidden relative flex flex-col bg-white/[0.01]">
        <MessageList :messages="messages" :current-user="user.username" />
        
        <!-- Typing indicator (Refined) -->
        <div v-if="Object.keys(typingUsers).length > 0" class="px-8 py-3 bg-[#0a0b14]/80 backdrop-blur-md border-t border-white/5 flex items-center gap-3">
          <div class="flex gap-1">
            <span class="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
            <span class="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
            <span class="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
          </div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            <span v-for="(name, id) in typingUsers" :key="id" class="text-indigo-400">{{ name }}</span>
            <span class="ml-1">transmitting...</span>
          </p>
        </div>
      </div>
      
      <!-- Input Area -->
      <div class="p-6 bg-[#0a0b14]/50 backdrop-blur-xl border-t border-white/5 relative z-20">
        <MessageInput @send="handleSendMessage" @typing="handleTyping" />
      </div>
    </div>

    <!-- Room Settings Modal (Premium) -->
    <Teleport to="body">
      <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="showSettings = false"></div>
        <div class="glass w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div class="flex justify-between items-center mb-10">
            <h2 class="text-4xl font-black text-white tracking-tighter">PROTOCOLS</h2>
            <button @click="showSettings = false" class="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white transition-all hover:rotate-90">✕</button>
          </div>

          <div v-if="roomData?.type === 'private'" class="mb-10 p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <h3 class="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Access Frequency</h3>
            <div class="space-y-6">
              <div class="flex flex-col gap-2">
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Broadcast Code</span>
                <div class="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white font-mono font-bold tracking-[0.4em] text-center text-xl shadow-inner">{{ roomData.inviteCode }}</div>
              </div>
              <div class="flex flex-col gap-2">
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encrypted Link</span>
                <div class="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-[10px] text-gray-400 font-mono break-all line-clamp-1">{{ roomData.inviteLink }}</div>
              </div>
              <button @click="resetInvite" class="w-full py-4 rounded-2xl border border-indigo-500/30 text-indigo-400 font-black text-xs uppercase tracking-widest hover:bg-indigo-500/10 transition-all">Re-generate Signal</button>
            </div>
          </div>

          <div class="mb-10">
            <h3 class="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">Authorized Personnel ({{ members.length }})</h3>
            <div class="space-y-3">
              <div v-for="m in members" :key="m.userId" class="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-400 group-hover:text-white transition-colors">{{ m.username.charAt(0) }}</div>
                  <div>
                    <span class="font-bold text-white uppercase tracking-wider text-sm">{{ m.username }}</span>
                    <span v-if="m.userId === roomData?.createdBy" class="block text-[8px] font-black text-cyan-400 uppercase tracking-widest mt-0.5">Admin Level 10</span>
                  </div>
                </div>
                <button 
                  v-if="m.userId !== roomData?.createdBy" 
                  @click="removeMember(m.userId)" 
                  class="opacity-0 group-hover:opacity-100 px-4 py-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all"
                >
                  Terminate
                </button>
              </div>
            </div>
          </div>

          <div class="pt-8 mt-10 border-t border-white/5">
            <button @click="confirmDelete" class="w-full py-5 rounded-2xl bg-red-600/10 border border-red-500/30 text-red-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-[0_0_30px_rgba(220,38,38,0.1)]">
              INITIATE DELETION
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- User Profile Modal -->
    <UserProfileModal :show="showProfileModal" :user="user" @close="showProfileModal = false" @logout="$emit('logout')" />

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import axios from 'axios';
import OnlineUsers from './OnlineUsers.vue';
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';
import UserProfileModal from './UserProfileModal.vue';
import { useChatSocket } from '../composables/useChatSocket';

const props = defineProps({
  user: { type: Object, required: true },
  roomId: { type: String, required: true }
});

const emit = defineEmits(['leave']);

const { isConnected, messages, typingUsers, error, lastEvent, connect, disconnect, sendMessage, sendTyping, sendMarkRead } = useChatSocket();

const presenceUsers = ref([]);
const wsErrorMsg = ref('');
const roomData = ref(null);
const showSettings = ref(false);
const showProfileModal = ref(false);
const members = ref([]);

let heartbeatInterval = null;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const isAdmin = computed(() => {
  return roomData.value?.createdBy === props.user.id;
});

const loadRoomData = async () => {
  try {
    const token = localStorage.getItem('chatty_token');
    const response = await axios.get(`${apiUrl}/api/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const found = response.data.rooms?.find(r => r.id.toString() === props.roomId.toString());
    if (found) {
      roomData.value = found;
      if (isAdmin.value) fetchMembers();
    }
  } catch (err) {
    console.error('Failed to load room data', err);
  }
};

const fetchMembers = async () => {
  try {
    const token = localStorage.getItem('chatty_token');
    const response = await axios.get(`${apiUrl}/api/rooms/${props.roomId}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    members.value = response.data.members || [];
  } catch (err) {
    console.error('Failed to fetch members', err);
  }
};

const resetInvite = async () => {
  try {
    const token = localStorage.getItem('chatty_token');
    const response = await axios.post(`${apiUrl}/api/rooms/${props.roomId}/reset-invite`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    roomData.value.inviteCode = response.data.inviteCode;
    roomData.value.inviteLink = response.data.inviteLink;
  } catch (err) {
    alert('Failed to reset invite');
  }
};

const removeMember = async (userId) => {
  if (!confirm('Are you sure you want to remove this member?')) return;
  try {
    const token = localStorage.getItem('chatty_token');
    await axios.delete(`${apiUrl}/api/rooms/${props.roomId}/members/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMembers();
  } catch (err) {
    alert('Failed to remove member');
  }
};

const confirmDelete = async () => {
  const code = prompt('Type DELETE to confirm room deletion:');
  if (code !== 'DELETE') return;
  try {
    const token = localStorage.getItem('chatty_token');
    await axios.delete(`${apiUrl}/api/rooms/${props.roomId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    emit('leave');
  } catch (err) {
    alert('Failed to delete room');
  }
};

const hasJoined = ref(false);

watch(lastEvent, (evt) => {
  if (!evt) return;
  if (evt.type === 'error') {
    wsErrorMsg.value = evt.payload.message;
    if (heartbeatInterval) clearInterval(heartbeatInterval);
  } else if (evt.type === 'kicked_from_room') {
    if (evt.payload.roomId.toString() === props.roomId.toString() && evt.payload.userId === props.user.id) {
      alert('You have been removed from this room by the admin.');
      emit('leave');
    }
  } else if (evt.type === 'room_deleted') {
    if (evt.payload.roomId.toString() === props.roomId.toString()) {
      alert('This room has been deleted by the admin.');
      emit('leave');
    }
  } else if (evt.type === 'user_joined') {
    // Always update online user list from WS payload (hub broadcasts on every join/leave)
    if (evt.payload?.users && Array.isArray(evt.payload.users)) {
      presenceUsers.value = evt.payload.users;
    }
    // First join: load history and start presence heartbeat
    if (!hasJoined.value) {
      hasJoined.value = true;
      loadMessageHistory();
      startPresenceHeartbeat();
    }
  }
});

// Remove the old isConnected watcher entirely
// watch(isConnected, (connected) => { ... });

const loadMessageHistory = async () => {
  try {
    const token = localStorage.getItem('chatty_token');
    const response = await axios.get(`${apiUrl}/api/messages`, {
      params: { roomId: props.roomId, limit: 50 },
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.messages) {
      messages.value = response.data.messages;
      markUnreadMessages();
    }
  } catch (err) {
    console.error('Failed to load message history', err);
  }
};

const markUnreadMessages = () => {
  const unreadIds = [];
  messages.value.forEach(msg => {
    // Only process messages that have a valid ID and were not sent by current user
    if (msg.id && msg.userId !== props.user.id) {
      let readBy = [];
      try {
        if (typeof msg.readBy === 'string') readBy = JSON.parse(msg.readBy) || [];
        else if (Array.isArray(msg.readBy)) readBy = msg.readBy;
      } catch(e) {}
      if (!readBy.includes(props.user.id)) {
        unreadIds.push(msg.id);
      }
    }
  });
  if (unreadIds.length > 0) {
    sendMarkRead(props.roomId, unreadIds);
    // Also notify message-service
    const token = localStorage.getItem('chatty_token');
    const apiUrl = import.meta.env.VITE_MESSAGE_URL || 'http://localhost:3001';
    unreadIds.forEach(id => {
      axios.put(`${apiUrl}/api/messages/${id}/read`, { userId: props.user.id }, { headers: { Authorization: `Bearer ${token}` } }).catch(()=>{});
    });
  }
};

watch(messages, (newVal, oldVal) => {
  if (newVal.length > 0) {
    markUnreadMessages();
  }
}, { deep: true });

const handleTabClose = () => {
  const presenceUrl = import.meta.env.VITE_PRESENCE_URL || 'http://localhost:3003';
  const token = localStorage.getItem('chatty_token');
  // Use sendBeacon for reliable leave notification on tab close
  if (token) {
    const blob = new Blob([JSON.stringify({ roomId: props.roomId })], { type: 'application/json' });
    navigator.sendBeacon(`${presenceUrl}/api/presence/leave-beacon?token=${token}`, blob);
  }
  disconnect();
};

let isMounted = true;
const startPresenceHeartbeat = () => {
  const presenceUrl = import.meta.env.VITE_PRESENCE_URL || 'http://localhost:3003';
  const token = localStorage.getItem('chatty_token');
  
  const ping = async () => {
    if (!isMounted) return;
    try {
      await axios.post(`${presenceUrl}/api/presence/heartbeat`, { roomId: props.roomId }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
      if (!isMounted) return;
    
    } catch (e) {
      if (isMounted) console.error('Presence error', e);
    }
  };
  
  ping();
  heartbeatInterval = setInterval(ping, 30000); 
};

const handleSendMessage = (content) => {
  if (content.trim()) {
    sendMessage(props.roomId, content);
  }
};

let typingTimeout = null;
const handleTyping = () => {
  sendTyping(props.roomId, true);
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    sendTyping(props.roomId, false);
  }, 2000);
};

// Handled by user_joined event now

onMounted(() => {
  window.addEventListener('beforeunload', handleTabClose);
  loadRoomData();
  const token = localStorage.getItem('chatty_token');
  connect(token, props.roomId);
  // DO NOT loadMessageHistory or startPresenceHeartbeat here. Wait for connection success.
});

onUnmounted(async () => {
  isMounted = false;
  window.removeEventListener('beforeunload', handleTabClose);
  // Notify presence service immediately
  try {
    const presenceUrl = import.meta.env.VITE_PRESENCE_URL || 'http://localhost:3003';
    const token = localStorage.getItem('chatty_token');
    if (token) {
      // Use fire and forget but catch error to avoid console clutter
      axios.post(`${presenceUrl}/api/presence/leave`, { roomId: props.roomId }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
  } catch (e) {}

  disconnect();
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (typingTimeout) clearTimeout(typingTimeout);
});
</script>
