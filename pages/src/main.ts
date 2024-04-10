import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
// Vue
import App from './App.vue';
import Top from './views/Top.vue';
import About from './views/About.vue';
// CSS
import './style.css';

const routes = [
  { path: '/', component: Top },
  { path: '/about', component: About },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
