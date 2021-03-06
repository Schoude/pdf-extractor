import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import useFileHandler from '../composables/file-handler';
import Setup from '../pages/Setup.vue';
const { filesLoaded, exportedFiles } = useFileHandler();

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
    beforeEnter: (to, from, next) => {
      if (!filesLoaded.value) {
        next({ name: 'Setup' });
        return;
      }
      next();
    },
  },
  {
    path: '/csv',
    name: 'CSVPreview',
    component: () => import('../pages/CSVPreview.vue'),
    beforeEnter: (to, from, next) => {
      if (exportedFiles.value.length === 0) {
        next({ name: 'Setup' });
        return;
      }
      next();
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
