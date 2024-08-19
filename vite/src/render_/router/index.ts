import { createRouter, createMemoryHistory } from "vue-router";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@r/pages/index.vue"),
    },
  ],
});

export default router;
