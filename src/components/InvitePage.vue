<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">

      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p class="text-gray-600">Validating invite link...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">❌</div>
        <h2 class="text-xl font-bold text-gray-800">Invalid Invite</h2>
        <p class="text-gray-500 text-sm">{{ error }}</p>
        <button @click="$router.push('/rooms')" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
          Go to Rooms
        </button>
      </div>

      <!-- Valid invite - not logged in -->
      <div v-else-if="roomInfo && !isLoggedIn" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">🔒</div>
        <h2 class="text-2xl font-bold text-gray-800">{{ roomInfo.roomName }}</h2>
        <p class="text-gray-500 text-sm">{{ roomInfo.memberCount }} members</p>
        <div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700 w-full">
          You need to log in to join this private room.
        </div>
        <div class="flex gap-3 w-full">
          <button @click="goLogin" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
            Login
          </button>
          <button @click="goRegister" class="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors">
            Register
          </button>
        </div>
      </div>

      <!-- Valid invite - logged in, joining... -->
      <div v-else-if="roomInfo && isLoggedIn" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">🚀</div>
        <h2 class="text-2xl font-bold text-gray-800">{{ roomInfo.roomName }}</h2>
        <p class="text-gray-500 text-sm">{{ roomInfo.memberCount }} members · Private Room</p>
        <div v-if="joining" class="flex items-center gap-2 text-gray-500 text-sm">
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-indigo-300 border-t-indigo-600"></div>
          Joining room...
        </div>
        <div v-else-if="joinError" class="text-red-500 text-sm">{{ joinError }}</div>
        <button v-else @click="joinRoom" class="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-lg transition-colors shadow-md">
          Join Room
        </button>
        <button @click="$router.push('/rooms')" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Cancel
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const token = route.params.token;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const loading = ref(true);
const error = ref('');
const roomInfo = ref(null);
const joining = ref(false);
const joinError = ref('');

const isLoggedIn = computed(() => !!localStorage.getItem('chatty_token'));

// Store token in sessionStorage to use after login redirect
const saveInviteToken = () => {
  sessionStorage.setItem('pending_invite_token', token);
};

const goLogin = () => {
  saveInviteToken();
  router.push('/login');
};

const goRegister = () => {
  saveInviteToken();
  router.push('/register');
};

const validateInvite = async () => {
  loading.value = true;
  try {
    // We use "general" as roomId placeholder; server will find by code/link
    // Actually we query without a specific roomId - server validates by token
    const response = await axios.get(`${apiUrl}/api/rooms/0/validate-invite`, {
      params: { link: token }
    });
    if (response.data.valid) {
      roomInfo.value = response.data;
      // Auto-join if already logged in
      if (isLoggedIn.value) {
        await joinRoom();
      }
    } else {
      error.value = response.data.error || 'Invalid invite link';
    }
  } catch (err) {
    error.value = 'Could not validate invite link. Please try again.';
  } finally {
    loading.value = false;
  }
};

const joinRoom = async () => {
  joining.value = true;
  joinError.value = '';
  try {
    const authToken = localStorage.getItem('chatty_token');
    const response = await axios.post(`${apiUrl}/api/rooms/join-by-link`, {
      inviteLink: token
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    router.push(`/chat/${response.data.roomId}`);
  } catch (err) {
    joinError.value = err.response?.data?.error || 'Failed to join room';
    joining.value = false;
  }
};

onMounted(async () => {
  // Check if returning from login with pending invite
  const pendingToken = sessionStorage.getItem('pending_invite_token');
  if (pendingToken && isLoggedIn.value) {
    sessionStorage.removeItem('pending_invite_token');
  }
  await validateInvite();
});
</script>
