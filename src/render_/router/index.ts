import { createRouter, createMemoryHistory, createWebHashHistory } from "vue-router";
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
        {
          path: "/tools",
          name: "tools",
          component: () => import("@r/pages/tools/tools.vue"),
          redirect: "setting-java",
          children: [
            {
              path: "/setting-java",
              name: "setting-java",
              component: () => import("@r/pages/tools/children/setting-java.vue"),
            },
            {
              path: "/setting-gradle",
              name: "setting-gradle",
              component: () => import("@r/pages/tools/children/setting-gradle.vue"),
            },
            {
              path: "/secret-genderal",
              name: "secret-genderal",
              component: () => import("@r/pages/tools/children/secret-key.vue"),
            },
            {
              path: "/senv-manager",
              name: "senv-manager",
              component: () => import("@r/pages/tools/children/senv-manager.vue"),
            },
          ],
        },
        {
          // 无匹配路由
          path: "/:pathMatch(.*)*",
          name: "not-found",
          redirect: "/version",
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
