<template>
  <div class="glass p-10 rounded-[2.5rem] w-full max-w-md relative z-10 shadow-[0_30px_70px_rgba(0,0,0,0.5)] border-white/10">
    <div class="text-center mb-10">
      <h1 class="text-5xl font-black text-gradient tracking-tighter mb-4">JOIN US</h1>
      <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Register New Operative</p>
    </div>
    
    <form @submit.prevent="submit" class="space-y-5">
      <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">{{ error }}</div>
      
      <div>
        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Identity Name</label>
        <input 
          v-model="username" 
          type="text" 
          required
          class="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
          placeholder="USERNAME..."
        />
      </div>

      <div>
        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Frequency Email</label>
        <input 
          v-model="email" 
          type="email" 
          required
          class="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
          placeholder="OPERATIVE@PROTOCOL.COM"
        />
      </div>
      
      <div>
        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Secure Key</label>
        <input 
          v-model="password" 
          type="password" 
          required
          minlength="6"
          class="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
          placeholder="••••••••"
        />
      </div>
      
      <button 
        type="submit"
        :disabled="loading"
        class="w-full relative group py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all active:scale-95 shadow-[0_20px_40px_rgba(99,102,241,0.2)]"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:opacity-90 transition-opacity"></div>
        <span class="relative z-10 text-white">
          <template v-if="loading">Initializing...</template>
          <template v-else>Authorize Account</template>
        </span>
      </button>
    </form>
    
    <div class="mt-10 text-center">
      <p class="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Existing operative?</p>
      <router-link to="/login" class="inline-block px-8 py-3 rounded-xl border border-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Establish Link</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['register-success', 'switch-to-login']);

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await axios.post(`${apiUrl}/api/auth/register`, {
      username: username.value,
      email: email.value,
      password: password.value
    });
    localStorage.setItem('chatty_token', response.data.token);
    localStorage.setItem('chatty_user', JSON.stringify({
      id: response.data.userId,
      username: response.data.username,
      role: response.data.role || 'user'
    }));
    emit('register-success', response.data);
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>
