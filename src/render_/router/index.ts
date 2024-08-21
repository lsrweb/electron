import {
  createRouter,
  createMemoryHistory,
  createWebHashHistory,
} from "vue-router";
import layout from "@r/layout/index.vue";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "dash",
      component: layout,
      redirect: "/version",
      children: [
        {
          path: "/version",
          name: "home",
          component: () => import("@r/pages/version/version.vue"),
        },
        {
          path: "/program",
          name: "program",
          component: () => import("@r/pages/program/program.vue"),
        },
        {
          path: "/group",
          name: "group",
          component: () => import("@r/pages/group/group.vue"),
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
