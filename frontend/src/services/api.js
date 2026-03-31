import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL
});

export async function generateMeal(profile) {
  const { data } = await api.post("/meal/generate", profile);
  return data;
}

export async function generateFromFavorites(profile) {
  const { data } = await api.post("/meal/generate-from-favorites", profile);
  return data;
}

export async function generateMultipleMeals(profile, count = 3) {
  const { data } = await api.post("/meal/generate-multiple", { profile, count });
  return data.plans;
}

export async function replaceMeal(profile, currentPlan, mealType) {
  const { data } = await api.post("/meal/replace", { profile, currentPlan, mealType });
  return data;
}

export async function fetchShoppingList(currentPlan) {
  const { data } = await api.post("/meal/shopping-list", { currentPlan });
  return data.list;
}

export async function fetchWeeklyShoppingList(history) {
  const { data } = await api.post("/meal/shopping-list-weekly", { history });
  return data.list;
}

export async function fetchWeeklyReport(history) {
  const { data } = await api.post("/meal/weekly-report", { history });
  return data.report;
}

export async function calculateNutrition(profile) {
  const { data } = await api.post("/nutrition/calculate", profile);
  return data.targets;
}
