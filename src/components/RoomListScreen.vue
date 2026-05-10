<template>
  <div v-if="user" class="relative w-full h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden bg-[#0a0b14]">
    <!-- Background Glows -->
    <div class="glow-bg top-[-10%] left-[-10%] opacity-20"></div>
    <div class="glow-bg bottom-[-10%] right-[-10%] opacity-20" style="background: radial-gradient(circle, var(--purple) 0%, transparent 70%)"></div>

    <div class="glass p-6 md:p-10 rounded-[2rem] w-full max-w-6xl h-full max-h-[90vh] flex flex-col relative z-10 shadow-2xl overflow-hidden">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div class="flex items-center gap-6">
          <!-- Profile Quick Access -->
          <button @click="showProfileModal = true" class="group relative">
            <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black text-2xl text-white group-hover:border-indigo-500/50 transition-all">
              {{ user.username.charAt(0).toUpperCase() }}
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0a0b14]"></div>
          </button>

          <div>
            <h1 class="text-4xl md:text-5xl font-black text-gradient tracking-tight mb-2">CHATTY SPACES</h1>
            <p class="text-gray-400 flex items-center gap-2 cursor-pointer hover:text-white transition-colors" @click="showProfileModal = true">
              Logged in as <span class="text-white font-semibold">{{ user.username }}</span>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 uppercase tracking-widest ml-2">{{ user.role }}</span>
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-4">
          <button @click="showJoinModal = true" class="group relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all group-hover:opacity-90"></div>
            <span class="relative flex items-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              Join Room
            </span>
          </button>
          <button @click="showCreateModal = true" class="group relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all group-hover:opacity-90"></div>
            <span class="relative flex items-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Create Room
            </span>
          </button>
          <button @click="$emit('logout')" class="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            Logout
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex-1 flex flex-col justify-center items-center gap-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-indigo-400 font-medium tracking-widest animate-pulse">SYNCHRONIZING...</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <!-- Public Rooms Section -->
        <div v-if="publicRooms.length > 0" class="mb-10">
          <div class="flex items-center gap-4 mb-6">
            <h2 class="text-lg font-bold text-white tracking-widest uppercase opacity-80">Global Channels</h2>
            <div class="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="room in publicRooms" 
              :key="room.id"
              class="glass-card rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
              @click="joinRoom(room.id)"
            >
              <div class="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                <div class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              </div>
              <div class="flex items-center gap-4 mb-4">
                <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{{ room.name }}</h3>
                  <p class="text-xs text-gray-500 uppercase tracking-widest">Public Access</p>
                </div>
              </div>
              <p class="text-sm text-gray-400 line-clamp-2">Connect with everyone in this open space.</p>
            </div>
          </div>
        </div>

          <!-- Private Rooms Section -->
        <div v-if="privateRooms.length > 0">
          <div class="flex items-center gap-4 mb-6">
            <h2 class="text-lg font-bold text-white tracking-widest uppercase opacity-80">Encrypted Vaults</h2>
            <div class="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="room in privateRooms" 
              :key="room.id"
              class="glass-card rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
              @click="joinRoom(room.id)"
            >
              <div class="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                <div class="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]"></div>
              </div>
              <div class="flex items-center gap-4 mb-4">
                <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{{ room.name }}</h3>
                  <p class="text-xs text-gray-500 uppercase tracking-widest">End-to-End Secure</p>
                </div>
              </div>
              <p class="text-sm text-gray-400 line-clamp-2">Private end-to-end encrypted space for your team.</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="rooms.length === 0" class="h-full flex flex-col items-center justify-center text-center py-20">
          <div class="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
            <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">No active frequency detected</h3>
          <p class="text-gray-500 max-w-xs">Initialize a new space or enter an access code to begin.</p>
        </div>
      </div>

    <!-- Modals Section (Glass Style) -->
    <Teleport to="body">
      <!-- Create Room Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="showCreateModal = false"></div>
        <div class="glass w-full max-w-md rounded-3xl p-8 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
          <h2 class="text-3xl font-black text-white mb-6">INITIALIZE SPACE</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Space Identity</label>
              <input v-model="newRoomName" type="text" placeholder="Enter name..." class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
            </div>

            <div v-if="canCreatePublic">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Access Type</label>
              <select v-model="newRoomType" class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
                <option value="public" class="bg-gray-900">🌐 Public Protocol</option>
                <option value="private" class="bg-gray-900">🔒 Secure Protocol</option>
              </select>
            </div>

            <!-- Animated banner -->
            <div v-else class="relative overflow-hidden rounded-2xl py-6 px-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
              <div class="absolute top-0 right-0 p-2"><span class="flex h-2 w-2 rounded-full bg-indigo-400"></span></div>
              <div class="relative z-10 text-center">
                <p class="room-come-in-text font-black text-white uppercase tracking-widest mb-1">SECURE MODE ACTIVE</p>
                <p class="text-xs text-indigo-300 opacity-60 italic">End-to-end encrypted room will be generated</p>
              </div>
            </div>

            <div v-if="createError" class="text-red-400 text-sm font-medium">{{ createError }}</div>
            
            <div v-if="createdRoom" class="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl text-sm">
              <p class="text-green-400 font-bold mb-3 flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                SPACE READY
              </p>
              <div v-if="createdRoom.type === 'private'" class="space-y-2">
                <p class="text-white/60">ACCESS CODE: <span class="text-white font-mono font-bold">{{ createdRoom.inviteCode }}</span></p>
                <p class="text-white/40 text-[10px] break-all font-mono">{{ createdRoom.inviteLink }}</p>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button @click="showCreateModal = false; createdRoom = null" class="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 transition-all">
                ABORT
              </button>
              <button v-if="!createdRoom" @click="createRoom" class="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                EXECUTE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Join Room Modal -->
      <div v-if="showJoinModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="showJoinModal = false"></div>
        <div class="glass w-full max-w-md rounded-3xl p-8 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
          <h2 class="text-3xl font-black text-white mb-6">LINK PORTAL</h2>
          
          <div class="space-y-8">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Enter Frequency Code</label>
              <div class="flex gap-3">
                <input v-model="inviteCode" type="text" placeholder="CODE..." class="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-center font-mono text-xl tracking-widest outline-none focus:border-cyan-500/50 transition-all uppercase" maxlength="6" />
                <button @click="joinByCode" class="px-8 bg-cyan-600 text-white rounded-2xl font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20">
                  LINK
                </button>
              </div>
            </div>

            <div class="relative py-2 text-center">
              <div class="absolute inset-x-0 top-1/2 h-[1px] bg-white/10"></div>
              <span class="relative bg-[#161720] px-4 text-xs font-bold text-gray-600 tracking-widest">OR USE TOKEN</span>
            </div>

            <div>
              <input v-model="inviteLink" type="text" placeholder="Paste access token here..." class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-all mb-4" />
              <button @click="joinByLink" class="w-full px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                ESTABLISH CONNECTION
              </button>
            </div>
            
            <div v-if="joinError" class="text-red-400 text-sm text-center font-medium">{{ joinError }}</div>

            <button @click="showJoinModal = false" class="w-full text-gray-500 hover:text-white transition-colors text-xs font-bold tracking-widest">
              TERMINATE PORTAL
            </button>
          </div>
        </div>
      </div>
    </Teleport>
      <!-- User Profile Modal -->
      <UserProfileModal :show="showProfileModal" :user="user" @close="showProfileModal = false" @logout="$emit('logout')" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import UserProfileModal from './UserProfileModal.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['join-room', 'logout']);
const router = useRouter();

const rooms = ref([]);
const loading = ref(false);

const showCreateModal = ref(false);
const newRoomName = ref('');
const createError = ref('');
const createdRoom = ref(null);

const showJoinModal = ref(false);
const showProfileModal = ref(false);
const inviteCode = ref('');
const inviteLink = ref('');
const joinError = ref('');

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Role-based access: only leader/super_admin can create public rooms
const canCreatePublic = computed(() =>
  props.user?.role === 'super_admin' || props.user?.role === 'leader'
);

const newRoomType = ref(canCreatePublic.value ? 'public' : 'private');
const publicRooms = computed(() => rooms.value.filter(r => r.type === 'public'));
const privateRooms = computed(() => rooms.value.filter(r => r.type === 'private'));

const fetchRooms = async () => {
  try {
    const token = localStorage.getItem('chatty_token');
    const response = await axios.get(`${apiUrl}/api/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    rooms.value = response.data.rooms || [];
  } catch (err) {
    console.error('Failed to fetch rooms', err);
  } finally {
    loading.value = false;
  }
};

const createRoom = async () => {
  createError.value = '';
  try {
    const token = localStorage.getItem('chatty_token');
    const response = await axios.post(`${apiUrl}/api/rooms`, {
      name: newRoomName.value,
      type: newRoomType.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    createdRoom.value = response.data;
    fetchRooms();
  } catch (err) {
    createError.value = err.response?.data?.error || 'Failed to create room';
  }
};

const joinByCode = async () => {
  joinError.value = '';
  try {
    const token = localStorage.getItem('chatty_token');
    const response = await axios.post(`${apiUrl}/api/rooms/join-by-code`, {
      inviteCode: inviteCode.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showJoinModal.value = false;
    emit('join-room', response.data.roomId);
  } catch (err) {
    joinError.value = err.response?.data?.error || 'Failed to join room';
  }
};

const joinByLink = async () => {
  joinError.value = '';
  try {
    let tokenValue = inviteLink.value;
    if (tokenValue.startsWith('/join/')) {
        tokenValue = tokenValue.replace('/join/', '');
    } else if (tokenValue.includes('/join/')) {
        tokenValue = tokenValue.split('/join/')[1];
    }
    const token = localStorage.getItem('chatty_token');
    const response = await axios.post(`${apiUrl}/api/rooms/join-by-link`, {
      inviteLink: tokenValue
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showJoinModal.value = false;
    emit('join-room', response.data.roomId);
  } catch (err) {
    joinError.value = err.response?.data?.error || 'Failed to join room';
  }
};

const joinRoom = (roomId) => {
  emit('join-room', roomId);
};

onMounted(() => {
  fetchRooms();
});
</script>
