<template>
  <div class="bg-white p-8 rounded-xl shadow-lg w-96 max-w-full transform transition-all duration-300">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-indigo-600 mb-2">Chatty</h1>
      <p class="text-gray-500">Join the realtime conversation</p>
    </div>
    
    <form @submit.prevent="submit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input 
          v-model="username" 
          type="text" 
          required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
          placeholder="Enter your username"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Room (Optional)</label>
        <input 
          v-model="roomId" 
          type="text" 
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
          placeholder="general"
        />
      </div>
      
      <button 
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-300"
      >
        Join Chat
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['join']);

const username = ref('');
const roomId = ref('general');

const submit = () => {
  if (username.value.trim()) {
    emit('join', username.value.trim(), roomId.value.trim() || 'general');
  }
};
</script>
