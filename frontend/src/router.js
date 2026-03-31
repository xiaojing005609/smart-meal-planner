import { createRouter, createWebHistory } from "vue-router";
import MealPage from "./views/MealPage.vue";
import SettingsPage from "./views/SettingsPage.vue";
import HistoryPage from "./views/HistoryPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "meal", component: MealPage },
    { path: "/settings", name: "settings", component: SettingsPage },
    { path: "/history", name: "history", component: HistoryPage }
  ]
});

export default router;
