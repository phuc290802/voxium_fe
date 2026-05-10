<template>
  <div class="h-screen w-screen bg-[#0a0b14] flex items-center justify-center font-['Outfit'] relative overflow-hidden text-white">
    <!-- Global Background Glows -->
    <div class="glow-bg top-[-10%] left-[-10%] opacity-20"></div>
    <div class="glow-bg bottom-[-10%] right-[-10%] opacity-20" style="background: radial-gradient(circle, var(--purple) 0%, transparent 70%)"></div>
    
    <router-view 
      :key="$route.fullPath"
      class="relative z-10" 
      :user="user" 
      @login-success="handleAuthSuccess" 
      @register-success="handleAuthSuccess" 
      @join-room="handleJoinRoom" 
      @logout="handleLogout" 
      @leave="handleLeave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import axios from 'axios';

const user = ref(null);
const router = useRouter();

const userStr = localStorage.getItem('chatty_user');
if (userStr) {
  user.value = JSON.parse(userStr);
}

const handleAuthSuccess = (data) => {
  user.value = { id: data.userId, username: data.username, role: data.role || 'user' };
  localStorage.setItem('chatty_user', JSON.stringify(user.value));
  router.push('/rooms');
};

const handleJoinRoom = (roomId) => {
  router.push(`/chat/${roomId}`);
};

const handleLeave = () => {
  router.push('/rooms');
};

const handleLogout = async () => {
  try {
    const presenceUrl = import.meta.env.VITE_PRESENCE_URL || 'http://localhost:3003';
    const token = localStorage.getItem('chatty_token');
    if (token) {
      await axios.post(`${presenceUrl}/api/presence/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (err) {
    console.error('Presence logout error', err);
  }

  user.value = null;
  localStorage.removeItem('chatty_token');
  localStorage.removeItem('chatty_user');
  router.push('/login');
};
</script>
