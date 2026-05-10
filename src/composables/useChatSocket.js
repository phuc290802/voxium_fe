import { ref, onUnmounted } from 'vue';

export function useChatSocket() {
  const ws = ref(null);
  const isConnected = ref(false);
  const messages = ref([]);
  const users = ref([]);
  const typingUsers = ref({});
  const error = ref(null);
  const lastEvent = ref(null);

  const connect = (token, roomId) => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3004';
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => {
      isConnected.value = true;
      error.value = null;
      ws.value.send(JSON.stringify({
        type: 'join_room',
        payload: { token, roomId }
      }));
    };

    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleMessage(data);
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    };

    ws.value.onclose = () => {
      isConnected.value = false;
      typingUsers.value = {};
    };

    ws.value.onerror = (err) => {
      error.value = 'WebSocket connection error';
      isConnected.value = false;
    };
  };

  const handleMessage = (event) => {
    switch(event.type) {
      case 'new_message':
        messages.value.push(event.payload);
        break;
      case 'user_joined':
      case 'user_left':
        if (event.payload.users) {
          users.value = event.payload.users;
        }
        lastEvent.value = event;
        break;
      case 'user_typing':
        if (event.payload.isTyping) {
          typingUsers.value[event.payload.userId] = event.payload.username;
        } else {
          delete typingUsers.value[event.payload.userId];
        }
        break;
      case 'message_read':
        // Update read status for messages
        messages.value.forEach(msg => {
          if (event.payload.messageIds?.includes(msg.id)) {
            let readBy = [];
            try {
              if (typeof msg.readBy === 'string') {
                readBy = JSON.parse(msg.readBy) || [];
              } else if (Array.isArray(msg.readBy)) {
                readBy = msg.readBy;
              }
            } catch(e) {}
            if (!readBy.includes(event.payload.userId)) {
              readBy.push(event.payload.userId);
            }
            msg.readBy = JSON.stringify(readBy);
          }
        });
        break;
      case 'kicked_from_room':
      case 'room_deleted':
        lastEvent.value = event;
        break;
      case 'error':
        error.value = event.payload.message;
        lastEvent.value = event;
        break;
    }
  };

  const sendMessage = (roomId, content) => {
    if (ws.value && isConnected.value) {
      ws.value.send(JSON.stringify({
        type: 'send_message',
        payload: { roomId, content }
      }));
    }
  };

  const sendTyping = (roomId, isTyping) => {
    if (ws.value && isConnected.value) {
      ws.value.send(JSON.stringify({
        type: isTyping ? 'typing_start' : 'typing_stop',
        payload: { roomId }
      }));
    }
  };

  const sendMarkRead = (roomId, messageIds) => {
    if (ws.value && isConnected.value && messageIds.length > 0) {
      ws.value.send(JSON.stringify({
        type: 'mark_read',
        payload: { roomId, messageIds }
      }));
    }
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return { isConnected, messages, users, typingUsers, error, lastEvent, connect, disconnect, sendMessage, sendTyping, sendMarkRead };
}
