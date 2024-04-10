import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
// Vue
import App from './App.vue';
import Top from './views/Top.vue';
// CSS
import './style.css';

// Router
const routes = [
  { path: '/', component: Top },
  { path: '/admin', component: () => import('./views/Admin.vue') },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
