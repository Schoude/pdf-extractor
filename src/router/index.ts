import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Setup from '../pages/Setup.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Setup',
    component: Setup,
  },
  {
    path: '/viz',
    name: 'Viz',
    component: () => import('../pages/Viz.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
