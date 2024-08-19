import { createRouter, createMemoryHistory } from "vue-router";
import layout from "@r/layout/index.vue";
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: "/",
      name: "dash",
      component: layout,
      redirect: "/home",
      children: [
        { 
          path: "/home",
          name: "home",
          component: () => import("@r/pages/index.vue"),
        }
      ]
      
    },
  ],
});

export default router;
 