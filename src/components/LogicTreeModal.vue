<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 overflow-hidden">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-xl" @click="$emit('close')"></div>
      
      <div class="relative w-full h-full max-w-7xl bg-[#0d0e16] rounded-[2.5rem] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        <!-- Toolbar -->
        <div class="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between z-30">
          <div class="flex items-center gap-6">
            <div class="flex flex-col">
              <h2 class="text-xl font-black text-white tracking-tighter uppercase">Logic Matrix</h2>
              <span class="text-[8px] font-black text-cyan-400 tracking-[0.3em] uppercase mt-0.5">Neural Node Architect</span>
            </div>
            
            <div class="h-8 w-[1px] bg-white/10 mx-2"></div>

            <button @click="addNode" class="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span class="text-[10px] font-black uppercase tracking-widest">Deploy Node</span>
            </button>

            <div class="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
              <button @click="zoomOut" class="p-2 text-gray-400 hover:text-white transition-colors">－</button>
              <span class="text-[10px] font-mono text-gray-500 w-12 text-center">{{ Math.round(zoom * 100) }}%</span>
              <button @click="zoomIn" class="p-2 text-gray-400 hover:text-white transition-colors">＋</button>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button @click="downloadDiagram" class="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Extract Map</button>
            <button @click="clearBoard" class="px-6 py-3 rounded-2xl border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reset Sync</button>
            <button @click="$emit('close')" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">✕</button>
          </div>
        </div>

        <!-- Designer Area -->
        <div 
          class="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed cursor-default"
          :class="{ 'cursor-grabbing': isPanning }"
          @mousedown="handleBackgroundMouseDown"
          @mousemove="handleGlobalMouseMove"
          @mouseup="handleGlobalMouseUp"
          @wheel.prevent="handleWheel"
          @click="closeContextMenu"
          ref="boardRef"
        >
          <!-- Transformable Content Layer -->
          <div 
            class="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
            :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: '0 0' }"
          >
            <!-- Grid Background SVG -->
            <svg class="absolute inset-[-5000px] w-[10000px] h-[10000px] opacity-10 pointer-events-none">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#6366f1" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <!-- Connections Layer -->
            <svg class="absolute inset-[-10000px] w-[20000px] h-[20000px] pointer-events-none z-10">
              <g v-for="(conn, idx) in connections" :key="idx">
                <path 
                  :d="getConnectionPath(conn)"
                  :stroke="conn.color || '#6366f1'"
                  stroke-width="3"
                  fill="none"
                  class="connection-line"
                />
                <circle 
                  :cx="getNode(conn.to).x + (getNode(conn.to).width || 256) / 2" 
                  :cy="getNode(conn.to).y + 40" 
                  r="5" 
                  :fill="conn.color || '#6366f1'" 
                  class="connection-point"
                />
              </g>
            </svg>

            <!-- Nodes Layer -->
            <LogicNode 
              v-for="node in nodes" 
              :key="node.id"
              :node="node"
              :is-active="activeNode === node.id"
              :is-copied="copiedNodeId === node.id"
              :is-interacting="draggingNode?.id === node.id || resizingNode?.id === node.id"
              :is-connecting-from="connectingFrom === node.id"
              :is-image-sync-active="activeImageNodeId === node.id"
              :node-colors="nodeColors"
              @start-drag="startDrag"
              @start-resize="startResize"
              @show-context-menu="showNodeContextMenu"
              @click-node="handleNodeClick"
              @delete-node="deleteNode"
              @connect-node="connectNode"
              @drop-image="handleDrop"
              @paste-image="handleOverlayPaste"
              @trigger-browse="imageInput.click()"
              @cancel-sync="activeImageNodeId = null"
            />
          </div>

          <!-- Hidden Image Input -->
          <input type="file" ref="imageInput" class="hidden" accept="image/*" @change="processImage" />

          <!-- Custom Context Menu -->
          <div 
            v-if="contextMenu.show" 
            class="fixed z-[200] glass rounded-2xl border border-white/10 p-2 min-w-[180px] shadow-2xl animate-in fade-in zoom-in duration-200"
            :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
            @mousedown.stop
          >
             <div class="px-3 py-2 border-b border-white/5 mb-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Segment Operations</span>
             </div>
             <button @click.stop="connectNode(contextMenu.nodeId)" class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-500/10 text-white rounded-xl transition-all group/item">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-gray-400 group-hover/item:text-indigo-400"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ connectingFrom === contextMenu.nodeId ? 'Cancel Interface' : 'Connect Interface' }}</span>
             </button>
             <button @click.stop="triggerImageInput(contextMenu.nodeId)" class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-emerald-500/10 text-white rounded-xl transition-all group/item">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-gray-400 group-hover/item:text-emerald-400"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span class="text-[10px] font-black uppercase tracking-widest">Embed Visual</span>
             </button>
             <div class="h-[1px] bg-white/5 my-1"></div>
             <button @click.stop="copyNode(contextMenu.nodeId)" class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 text-white rounded-xl transition-all group/item">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-gray-400 group-hover/item:text-white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                <span class="text-[10px] font-black uppercase tracking-widest">Clone Segment (Ctrl+C)</span>
             </button>
             <button @click.stop="deleteNode(contextMenu.nodeId)" class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 text-white rounded-xl transition-all group/item">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-gray-400 group-hover/item:text-red-500"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span class="text-[10px] font-black uppercase tracking-widest text-red-400">Terminate Segment</span>
             </button>
          </div>

          <!-- Shortcuts -->
          <div class="absolute bottom-8 left-8 z-30 flex flex-col gap-2">
            <div class="glass p-4 rounded-2xl border border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest space-y-1">
              <div class="flex justify-between gap-8"><span>Ctrl + C / V</span> <span class="text-white">Clone Node</span></div>
              <div class="flex justify-between gap-8"><span>Right Click</span> <span class="text-white">Segment Operations</span></div>
              <div class="flex justify-between gap-8"><span>Scroll</span> <span class="text-white">Zoom Matrix</span></div>
            </div>
          </div>

          <!-- Custom Confirm Overlay -->
          <div v-if="confirmState.show" class="absolute inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <!-- Global purple aura for 'incoming' -->
            <div v-if="confirmState.type === 'incoming'" class="absolute inset-0 bg-purple-600/5 pointer-events-none"></div>
            
            <div class="w-full max-w-sm glass rounded-[3rem] border border-white/10 p-10 shadow-2xl text-center relative overflow-hidden">
              <!-- Decorative background glow for 'incoming' -->
              <div v-if="confirmState.type === 'incoming'" class="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 blur-[100px] animate-pulse"></div>
              <div v-if="confirmState.type === 'incoming'" class="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/20 blur-[100px] animate-pulse"></div>
              
              <!-- Visuals based on type -->
              <div v-if="confirmState.type === 'incoming'" class="relative mb-8 flex justify-center">
                <div class="w-24 h-24 relative">
                  <div class="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div class="absolute inset-0 border-2 border-purple-500/30 rounded-full scale-110 animate-ping"></div>
                  <div class="absolute inset-0 border-4 border-t-purple-400 rounded-full animate-spin"></div>
                  <div class="absolute inset-4 border-2 border-indigo-400/40 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-2xl animate-bounce">✨</div>
                  </div>
                </div>
              </div>

              <div v-else class="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-indigo-400">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>

              <h3 class="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">{{ confirmState.title }}</h3>
              <p class="text-[10px] text-purple-200/60 font-bold uppercase tracking-[0.3em] leading-relaxed mb-10">{{ confirmState.message }}</p>
              
              <div class="flex gap-3 relative z-10">
                <button v-if="confirmState.type === 'confirm'" @click="confirmState.show = false" class="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel Operation</button>
                <button @click="handleConfirmAction" class="flex-1 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl"
                  :class="confirmState.type === 'incoming' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/40' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40'">
                  {{ confirmState.confirmText || 'Execute' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LogicNode from './LogicTree/LogicNode.vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

// Node Colors
const nodeColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ffffff'];

const nodes = ref([
  { id: 1, x: 300, y: 200, width: 300, height: 220, text: 'CORE INTELLIGENCE', color: '#ffffff', image: null }
]);
const connections = ref([]);
const activeNode = ref(null);
const draggingNode = ref(null);
const resizingNode = ref(null);
const offset = ref({ x: 0, y: 0 });
const connectingFrom = ref(null);

// Image Handling
const imageInput = ref(null);
const activeImageNodeId = ref(null);

// Copy/Paste
const copiedNodeId = ref(null);
const copyBuffer = ref(null);

// Context Menu
const contextMenu = ref({ show: false, x: 0, y: 0, nodeId: null });

// Pan & Zoom
const panX = ref(0);
const panY = ref(0);
const zoom = ref(1);
const isPanning = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });

// Custom Confirm
const confirmState = ref({ show: false, title: '', message: '', type: 'confirm', confirmText: '', action: null });

const triggerConfirm = (title, message, action, type = 'confirm', confirmText = 'Execute') => {
  confirmState.value = { show: true, title, message, action, type, confirmText };
};

const handleConfirmAction = () => {
  if (confirmState.value.action) confirmState.value.action();
  confirmState.value.show = false;
};

const addNode = () => {
  const id = Date.now();
  const x = (window.innerWidth / 2 - panX.value) / zoom.value - 128;
  const y = (window.innerHeight / 2 - panY.value) / zoom.value - 100;
  
  nodes.value.push({
    id,
    x,
    y,
    width: 300,
    height: 200,
    text: '',
    color: '#ffffff',
    image: null
  });
};

const deleteNode = (id) => {
  nodes.value = nodes.value.filter(n => n.id !== id);
  connections.value = connections.value.filter(c => c.from !== id && c.to !== id);
  closeContextMenu();
};

const getNode = (id) => nodes.value.find(n => n.id === id) || { x: 0, y: 0, color: '#fff' };

const getConnectionPath = (conn) => {
  const from = getNode(conn.from);
  const to = getNode(conn.to);
  
  const fromW = from.width || 256;
  const toW = to.width || 256;
  
  const startX = from.x + fromW / 2;
  const startY = from.y + 40;
  const endX = to.x + toW / 2;
  const endY = to.y + 40;
  
  // Dynamic curvature
  const dx = endX - startX;
  const curve = Math.min(Math.abs(dx) * 0.5, 200);
  
  return `M ${startX} ${startY} C ${startX + (dx > 0 ? curve : -curve)} ${startY}, ${endX - (dx > 0 ? curve : -curve)} ${endY}, ${endX} ${endY}`;
};

const connectNode = (id) => {
  if (connectingFrom.value === null) {
    connectingFrom.value = id;
    activeNode.value = id;
  } else if (connectingFrom.value === id) {
    connectingFrom.value = null;
    activeNode.value = null;
  } else {
    establishConnection(connectingFrom.value, id);
  }
  closeContextMenu();
};

const establishConnection = (fromId, toId) => {
  const exists = connections.value.some(c => 
    (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)
  );
  if (!exists && fromId !== toId) {
    connections.value.push({ from: fromId, to: toId, color: getNode(fromId).color });
  }
  connectingFrom.value = null;
  activeNode.value = null;
};

const handleNodeClick = (id) => {
  if (connectingFrom.value && connectingFrom.value !== id) {
    establishConnection(connectingFrom.value, id);
  } else {
    activeNode.value = id;
  }
};

const triggerImageInput = (nodeId) => {
  activeImageNodeId.value = nodeId;
  closeContextMenu();
};

const handleFile = (file, node) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      node.image = event.target.result;
      activeImageNodeId.value = null;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (e, node) => {
  const file = e.dataTransfer.files[0];
  handleFile(file, node);
};

const handleOverlayPaste = (e, node) => {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      handleFile(blob, node);
      break;
    }
  }
};

const processImage = (e) => {
  const file = e.target.files[0];
  const node = nodes.value.find(n => n.id === activeImageNodeId.value);
  if (node) handleFile(file, node);
  e.target.value = '';
};

// Copy & Paste Logic
const copyNode = (id) => {
  const node = nodes.value.find(n => n.id === id);
  if (node) {
    copyBuffer.value = JSON.parse(JSON.stringify(node));
    copiedNodeId.value = id;
  }
  closeContextMenu();
};

const pasteNode = () => {
  if (copyBuffer.value) {
    const newNode = JSON.parse(JSON.stringify(copyBuffer.value));
    newNode.id = Date.now();
    newNode.x += 40;
    newNode.y += 40;
    nodes.value.push(newNode);
    activeNode.value = newNode.id;
  }
};

const handleKeydown = (e) => {
  if (!props.show) return;
  if (e.target.tagName === 'TEXTAREA') return;

  if (e.ctrlKey && e.key === 'c' && activeNode.value) {
    copyNode(activeNode.value);
  }
  if (e.ctrlKey && e.key === 'v') {
    pasteNode();
  }
  if (e.key === 'Delete' && activeNode.value) {
    deleteNode(activeNode.value);
  }
};

const showNodeContextMenu = (e, node) => {
  contextMenu.value = {
    show: true,
    x: e.clientX,
    y: e.clientY,
    nodeId: node.id
  };
};

const closeContextMenu = () => {
  contextMenu.value.show = false;
};

// GLOBAL MOUSE HANDLERS
const handleGlobalMouseMove = (e) => {
  if (draggingNode.value) {
    draggingNode.value.x = (e.clientX - offset.value.x - panX.value) / zoom.value;
    draggingNode.value.y = (e.clientY - offset.value.y - panY.value) / zoom.value;
    return;
  }

  if (resizingNode.value) {
    const newWidth = (e.clientX - (resizingNode.value.x * zoom.value + panX.value)) / zoom.value;
    const newHeight = (e.clientY - (resizingNode.value.y * zoom.value + panY.value)) / zoom.value;
    resizingNode.value.width = Math.max(newWidth, 200);
    resizingNode.value.height = Math.max(newHeight, 100);
    return;
  }

  if (isPanning.value) {
    panX.value += e.clientX - lastMousePos.value.x;
    panY.value += e.clientY - lastMousePos.value.y;
    lastMousePos.value = { x: e.clientX, y: e.clientY };
  }
};

const handleGlobalMouseUp = () => {
  draggingNode.value = null;
  resizingNode.value = null;
  isPanning.value = false;
};

const startDrag = (e, node) => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.classList.contains('cursor-nwse-resize')) return;
  draggingNode.value = node;
  activeNode.value = node.id;
  offset.value = {
    x: e.clientX - (node.x * zoom.value + panX.value),
    y: e.clientY - (node.y * zoom.value + panY.value)
  };
  closeContextMenu();
};

const startResize = (e, node) => {
  resizingNode.value = node;
  activeNode.value = node.id;
  closeContextMenu();
};

const handleBackgroundMouseDown = (e) => {
  // If clicking on a UI element (like the context menu or overlay), don't reset
  if (e.target.closest('.glass') || e.target.closest('.glass-node')) return;

  if (e.button === 0 && !draggingNode.value && !resizingNode.value) {
    activeNode.value = null;
    copiedNodeId.value = null;
    connectingFrom.value = null;
    activeImageNodeId.value = null;
  }
  
  if (e.button === 1 || (e.button === 0 && !draggingNode.value && !resizingNode.value)) { 
    isPanning.value = true;
    lastMousePos.value = { x: e.clientX, y: e.clientY };
  }
  closeContextMenu();
};

const handleWheel = (e) => {
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  zoom.value = Math.min(Math.max(zoom.value * delta, 0.2), 3);
};

const zoomIn = () => { zoom.value = Math.min(zoom.value + 0.1, 3); };
const zoomOut = () => { zoom.value = Math.max(zoom.value - 0.1, 0.2); };

const clearBoard = () => {
  triggerConfirm(
    'Factory Reset',
    'Are you sure you want to terminate all neural segments? This action cannot be undone.',
    () => {
      nodes.value = [{ id: 1, x: 300, y: 200, width: 300, height: 220, text: 'CORE INTELLIGENCE', color: '#ffffff', image: null }];
      connections.value = [];
      panX.value = 0;
      panY.value = 0;
      zoom.value = 1;
    },
    'confirm',
    'Terminate All'
  );
};

const downloadDiagram = () => {
  triggerConfirm(
    'INCOMING',
    'Neural Map Protocol: Syncing with Future',
    null,
    'incoming',
    'STAY TUNED'
  );
};

const handleGlobalPaste = (e) => {
  if (!props.show || !activeImageNodeId.value) return;

  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      const node = nodes.value.find(n => n.id === activeImageNodeId.value);
      if (node) {
        handleFile(blob, node);
        e.preventDefault();
        break;
      }
    }
  }
};

onMounted(() => {
  document.addEventListener('contextmenu', e => { if (props.show) e.preventDefault(); });
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('paste', handleGlobalPaste);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('paste', handleGlobalPaste);
});
</script>

<style scoped>
.glass {
  background: rgba(13, 14, 22, 0.9);
  backdrop-filter: blur(20px);
}

.glass-node {
  background: rgba(13, 14, 22, 0.75);
  backdrop-filter: blur(15px);
  will-change: transform;
}

.connection-line {
  stroke-dasharray: 8;
  animation: dash 20s linear infinite;
  filter: drop-shadow(0 0 5px currentColor);
}

.connection-point {
  filter: drop-shadow(0 0 8px currentColor);
}

@keyframes dash {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}

.animate-in {
  animation: animate-in 0.2s ease-out;
}

@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>

<style scoped>
.glass {
  background: rgba(13, 14, 22, 0.85);
  backdrop-filter: blur(20px);
}
</style>
