import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";

export const routes = setupLayouts([]);

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes,
});

export default router;
