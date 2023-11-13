const routes = [
  {
    path: "/",
    component: () => import("../layouts/mossy-layout.vue"),
    children: [
      {
        path: "moments",
        component: () => import("./mossy/page-moments.vue"),
      },
      {
        path: "",
        component: () => import("./mossy/page-explore.vue"),
      },
      {
        path: "collected",
        component: () => import("./mossy/page-collected.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("./ErrorNotFound.vue"),
  },
];

export default routes;
