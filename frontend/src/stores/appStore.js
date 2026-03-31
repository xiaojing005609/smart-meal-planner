import { defineStore } from "pinia";
import {
  calculateNutrition,
  generateMeal,
  generateFromFavorites,
  generateMultipleMeals,
  replaceMeal,
  fetchShoppingList,
  fetchWeeklyShoppingList,
  fetchWeeklyReport
} from "../services/api";

const PROFILE_KEY = "meal_user_profile";
const HISTORY_KEY = "meal_history";
const FAVORITES_KEY = "meal_favorites";
const DISLIKED_KEY = "meal_disliked_today";

const defaultProfile = {
  age: 28,
  gender: "female",
  height: 165,
  weight: 58,
  activityLevel: "light",
  goal: "maintain",
  preferences: ["家常"],
  avoidIngredients: []
};

const PREFERENCE_ROTATION = [
  ["清淡", "低油"],
  ["家常", "快手"],
  ["低油", "快手"],
  ["家常", "清淡"]
];

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function extractRecentDishIds(history = []) {
  return history
    .slice(0, 7)
    .flatMap((day) => {
      const p = day.plan || {};
      return [p.breakfast?.id, p.lunch?.id, p.dinner?.id].filter(Boolean);
    });
}

function calcWeeklyDiversity(history = []) {
  const dishIds = extractRecentDishIds(history);
  if (!dishIds.length) {
    return {
      totalCount: 0,
      uniqueCount: 0,
      duplicateRate: 0,
      diversityScore: 0
    };
  }
  const unique = new Set(dishIds);
  const uniqueCount = unique.size;
  const totalCount = dishIds.length;
  const duplicateRate = Number((((totalCount - uniqueCount) / totalCount) * 100).toFixed(1));
  const diversityScore = Number(((uniqueCount / totalCount) * 100).toFixed(1));
  return {
    totalCount,
    uniqueCount,
    duplicateRate,
    diversityScore
  };
}

function buildDiversityTip(duplicateRate) {
  if (duplicateRate > 60) {
    return "本周重复率偏高，建议优先使用“重新生成”，并减少“从收藏生成”的频次。";
  }
  if (duplicateRate > 40) {
    return "本周有一定重复，建议增加“清淡/快手”等新偏好，尝试替换1-2餐。";
  }
  if (duplicateRate > 20) {
    return "本周重复率可接受，继续保持，并可每周收藏1-2道新菜。";
  }
  if (duplicateRate > 0) {
    return "本周多样性表现不错，当前策略很稳。";
  }
  return "暂无历史数据，先保存几天配餐后再看趋势。";
}

export const useAppStore = defineStore("app", {
  state: () => ({
    profile: readJSON(PROFILE_KEY, defaultProfile),
    currentPlan: null,
    planOptions: [],
    selectedPlanIndex: 0,
    shoppingList: [],
    weeklyShoppingList: [],
    weeklyReport: null,
    favorites: readJSON(FAVORITES_KEY, []),
    dislikedDishIds: readJSON(DISLIKED_KEY, []),
    history: readJSON(HISTORY_KEY, []),
    loading: false,
    generating: false,
    replacingMealType: "",
    replaceHistoryByMeal: {
      breakfast: [],
      lunch: [],
      dinner: []
    },
    error: "",
    strategyMessage: ""
  }),
  getters: {
    weeklyDiversity(state) {
      return calcWeeklyDiversity(state.history);
    },
    weeklyDiversityTip() {
      const stats = calcWeeklyDiversity(this.history);
      return buildDiversityTip(stats.duplicateRate);
    }
  },
  actions: {
    resetReplaceHistory() {
      this.replaceHistoryByMeal = {
        breakfast: [],
        lunch: [],
        dinner: []
      };
    },
    saveProfile(profile) {
      this.profile = { ...profile };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile));
    },
    async refreshTargets() {
      return calculateNutrition(this.profile);
    },
    async generateTodayPlan() {
      this.loading = true;
      this.generating = true;
      this.error = "";
      try {
        const plans = await generateMultipleMeals(
          {
            ...this.profile,
            favorites: this.favorites,
            dislikedDishIds: this.dislikedDishIds,
            recentDishIds: extractRecentDishIds(this.history)
          },
          3
        );
        this.planOptions = plans;
        this.selectedPlanIndex = 0;
        this.currentPlan =
          plans[0] ||
          (await generateMeal({
            ...this.profile,
            favorites: this.favorites,
            dislikedDishIds: this.dislikedDishIds,
            recentDishIds: extractRecentDishIds(this.history)
          }));
        this.shoppingList = await fetchShoppingList(this.currentPlan.plan);
        this.resetReplaceHistory();
      } catch (err) {
        this.error = err?.response?.data?.error || "生成失败，请稍后重试。";
      } finally {
        this.generating = false;
        this.loading = false;
      }
    },
    selectPlan(index) {
      if (index < 0 || index >= this.planOptions.length) return;
      this.selectedPlanIndex = index;
      this.currentPlan = this.planOptions[index];
      this.resetReplaceHistory();
      this.updateShoppingList();
    },
    async replaceMealType(mealType) {
      if (!this.currentPlan?.plan) return;
      if (this.replacingMealType) return;
      this.loading = true;
      this.replacingMealType = mealType;
      this.error = "";
      try {
        const beforeDishId = this.currentPlan.plan?.[mealType]?.id;
        const mealHistory = this.replaceHistoryByMeal[mealType] || [];
        const replaced = await replaceMeal(
          {
            ...this.profile,
            favorites: this.favorites,
            dislikedDishIds: this.dislikedDishIds,
            recentDishIds: extractRecentDishIds(this.history)
          },
          this.currentPlan.plan,
          mealType,
          mealHistory
        );
        const nextDishId = replaced.plan?.[mealType]?.id;
        if (beforeDishId && nextDishId && beforeDishId === nextDishId) {
          this.error = "已没有可替换的新菜品，可先重新生成。";
          return;
        }
        this.currentPlan = replaced;
        if (this.planOptions.length) {
          this.planOptions[this.selectedPlanIndex] = replaced;
        }
        this.replaceHistoryByMeal[mealType] = [...mealHistory, nextDishId].filter(Boolean);
        this.shoppingList = await fetchShoppingList(this.currentPlan.plan);
      } catch (err) {
        this.error = err?.response?.data?.error || "替换失败，请稍后重试。";
      } finally {
        this.replacingMealType = "";
        this.loading = false;
      }
    },
    async generateTodayPlanFromFavorites() {
      this.loading = true;
      this.generating = true;
      this.error = "";
      try {
        this.currentPlan = await generateFromFavorites({
          ...this.profile,
          favorites: this.favorites,
          dislikedDishIds: this.dislikedDishIds,
          recentDishIds: extractRecentDishIds(this.history)
        });
        this.planOptions = [this.currentPlan];
        this.selectedPlanIndex = 0;
        this.shoppingList = await fetchShoppingList(this.currentPlan.plan);
        this.resetReplaceHistory();
      } catch (err) {
        this.error = err?.response?.data?.error || "收藏生成失败，请稍后重试。";
      } finally {
        this.generating = false;
        this.loading = false;
      }
    },
    saveCurrentToHistory() {
      if (!this.currentPlan) return;
      const date = new Date().toISOString().slice(0, 10);
      const next = this.history.filter((item) => item.date !== date);
      next.unshift({
        date,
        ...this.currentPlan
      });
      this.history = next;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      this.updateWeeklyData();
    },
    async updateShoppingList() {
      if (!this.currentPlan?.plan) return;
      this.shoppingList = await fetchShoppingList(this.currentPlan.plan);
    },
    isFavorite(dishId) {
      return this.favorites.some((item) => item.id === dishId);
    },
    toggleFavorite(dish) {
      const index = this.favorites.findIndex((item) => item.id === dish.id);
      if (index >= 0) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.unshift({
          id: dish.id,
          name: dish.name,
          mealType: dish.mealType
        });
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
    },
    dislikeDishForToday(dishId) {
      if (!this.dislikedDishIds.includes(dishId)) {
        this.dislikedDishIds.push(dishId);
        localStorage.setItem(DISLIKED_KEY, JSON.stringify(this.dislikedDishIds));
      }
    },
    clearDislikedToday() {
      this.dislikedDishIds = [];
      localStorage.setItem(DISLIKED_KEY, JSON.stringify(this.dislikedDishIds));
    },
    resetWeeklyStrategy() {
      this.clearDislikedToday();
      const current = this.profile.preferences || [];
      let next = PREFERENCE_ROTATION.find(
        (group) => group.join("|") !== current.slice(0, 2).join("|")
      );
      if (!next) {
        next = PREFERENCE_ROTATION[0];
      }
      this.profile = {
        ...this.profile,
        preferences: next
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile));
      this.strategyMessage = `已切换本周偏好：${next.join("、")}。建议重新生成今日菜单。`;
    },
    async updateWeeklyData() {
      this.weeklyShoppingList = await fetchWeeklyShoppingList(this.history);
      this.weeklyReport = await fetchWeeklyReport(this.history);
    }
  }
});
