import { createRouter, createWebHistory } from 'vue-router';
import LoginScreen from '../components/LoginScreen.vue';
import RegisterScreen from '../components/RegisterScreen.vue';
import RoomListScreen from '../components/RoomListScreen.vue';
import ChatRoom from '../components/ChatRoom.vue';
import InvitePage from '../components/InvitePage.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginScreen },
  { path: '/register', component: RegisterScreen },
  { path: '/rooms', component: RoomListScreen },
  { path: '/chat/:roomId', component: ChatRoom, props: true },
  { path: '/join/:token', component: InvitePage, meta: { allowGuest: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('chatty_token');
  const isPublicRoute = to.path === '/login' || to.path === '/register' || to.meta.allowGuest;

  if (!token && !isPublicRoute) {
    next('/login');
  } else if (token && (to.path === '/login' || to.path === '/register')) {
    // Check if there's a pending invite to redirect to
    const pendingInvite = sessionStorage.getItem('pending_invite_token');
    if (pendingInvite) {
      next(`/join/${pendingInvite}`);
    } else {
      next('/rooms');
    }
  } else {
    next();
  }
});

export default router;
