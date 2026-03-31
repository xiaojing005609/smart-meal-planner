const { DISHES, AVOID_MAP } = require("./data");
const { calcTargets, sumNutrition, getStatus } = require("./nutrition");

function matchesAvoid(dish, avoidIngredients = []) {
  const text = `${dish.name} ${dish.ingredients.join(" ")}`;
  return avoidIngredients.some((avoid) => {
    const mapped = AVOID_MAP[avoid] || [avoid];
    return mapped.some((word) => text.includes(word));
  });
}

function preferenceScore(dish, preferences = []) {
  if (!preferences.length) return 0;
  return preferences.reduce((acc, pref) => (dish.tags.includes(pref) ? acc + 1 : acc), 0);
}

function goalScore(dish, goal) {
  if (goal === "lose_fat") return dish.tags.includes("减脂") || dish.tags.includes("低油") ? 2 : 0;
  if (goal === "build_muscle") return dish.tags.includes("增肌") ? 2 : 0;
  return 0;
}

function favoriteScore(dish, favorites = []) {
  if (!favorites.length) return 0;
  return favorites.some((item) => item.id === dish.id) ? 3 : 0;
}

function historyPenalty(dish, recentDishIds = []) {
  if (!recentDishIds.length) return 0;
  return recentDishIds.includes(dish.id) ? 4 : 0;
}

function pickDish(mealType, profile, excludeIds = []) {
  const {
    avoidIngredients = [],
    preferences = [],
    favorites = [],
    dislikedDishIds = [],
    recentDishIds = []
  } = profile;
  const baseCandidates = DISHES.filter((dish) => dish.mealType === mealType).filter(
    (dish) =>
      !matchesAvoid(dish, avoidIngredients) &&
      !excludeIds.includes(dish.id) &&
      !dislikedDishIds.includes(dish.id)
  );
  let candidates = baseCandidates.filter((dish) => !recentDishIds.includes(dish.id));
  if (!candidates.length) candidates = baseCandidates;
  if (!candidates.length) return null;

  const sorted = [...candidates].sort((a, b) => {
    const scoreA =
      preferenceScore(a, preferences) +
      goalScore(a, profile.goal) +
      favoriteScore(a, favorites) -
      historyPenalty(a, recentDishIds);
    const scoreB =
      preferenceScore(b, preferences) +
      goalScore(b, profile.goal) +
      favoriteScore(b, favorites) -
      historyPenalty(b, recentDishIds);
    return scoreB - scoreA;
  });

  const top = sorted.slice(0, Math.min(2, sorted.length));
  return top[Math.floor(Math.random() * top.length)];
}

function generateMealPlan(profile) {
  const breakfast = pickDish("breakfast", profile);
  const lunch = pickDish("lunch", profile);
  const dinner = pickDish("dinner", profile);

  if (!breakfast || !lunch || !dinner) {
    return {
      error: "当前忌口条件下可选菜品不足，请减少忌口或补充菜品库。"
    };
  }

  const plan = { breakfast, lunch, dinner };
  const all = [breakfast, lunch, dinner];
  const totals = sumNutrition(all);
  const targets = calcTargets(profile);
  const status = getStatus(totals, targets);

  return { plan, totals, targets, status };
}

function pickDishFromFavorites(mealType, profile, excludeIds = []) {
  const { favorites = [], dislikedDishIds = [], recentDishIds = [] } = profile;
  const favoriteIds = favorites.map((f) => f.id);
  const baseScoped = DISHES.filter(
    (dish) =>
      dish.mealType === mealType &&
      favoriteIds.includes(dish.id) &&
      !excludeIds.includes(dish.id) &&
      !dislikedDishIds.includes(dish.id)
  );
  const scoped = baseScoped.filter((dish) => !recentDishIds.includes(dish.id));
  const pool = scoped.length ? scoped : baseScoped;
  if (!pool.length) {
    return pickDish(mealType, profile, excludeIds);
  }
  const top = pool.slice(0, Math.min(2, pool.length));
  return top[Math.floor(Math.random() * top.length)];
}

function generateFromFavorites(profile) {
  const breakfast = pickDishFromFavorites("breakfast", profile);
  const lunch = pickDishFromFavorites("lunch", profile);
  const dinner = pickDishFromFavorites("dinner", profile);

  if (!breakfast || !lunch || !dinner) {
    return {
      error: "收藏菜品或可选菜品不足，无法生成完整三餐。"
    };
  }
  const plan = { breakfast, lunch, dinner };
  const totals = sumNutrition([breakfast, lunch, dinner]);
  const targets = calcTargets(profile);
  const status = getStatus(totals, targets);
  return { plan, totals, targets, status };
}

function generateMultiplePlans(profile, count = 3) {
  const plans = [];
  const maxCount = Math.max(1, Math.min(3, Number(count) || 3));

  for (let i = 0; i < maxCount; i += 1) {
    const breakfastExclude = plans.map((p) => p.plan.breakfast.id);
    const lunchExclude = plans.map((p) => p.plan.lunch.id);
    const dinnerExclude = plans.map((p) => p.plan.dinner.id);

    const breakfast = pickDish("breakfast", profile, breakfastExclude);
    const lunch = pickDish("lunch", profile, lunchExclude);
    const dinner = pickDish("dinner", profile, dinnerExclude);

    if (!breakfast || !lunch || !dinner) break;
    const plan = { breakfast, lunch, dinner };
    const totals = sumNutrition([breakfast, lunch, dinner]);
    const targets = calcTargets(profile);
    const status = getStatus(totals, targets);
    plans.push({ plan, totals, targets, status });
  }

  if (!plans.length) {
    return { error: "当前忌口条件下可选菜品不足，请减少忌口或补充菜品库。" };
  }

  return { plans };
}

function replaceMeal(profile, currentPlan, mealType, extraExcludeIds = []) {
  const current = currentPlan?.[mealType];
  if (!current) return { error: "缺少当前餐次数据。" };
  const replacement = pickDish(mealType, profile, [current.id, ...extraExcludeIds]);
  if (!replacement) return { error: "没有可替换的菜品了，请调整忌口条件。" };

  const nextPlan = { ...currentPlan, [mealType]: replacement };
  const totals = sumNutrition([nextPlan.breakfast, nextPlan.lunch, nextPlan.dinner]);
  const targets = calcTargets(profile);
  const status = getStatus(totals, targets);

  return { plan: nextPlan, totals, targets, status };
}

module.exports = {
  generateMealPlan,
  generateFromFavorites,
  generateMultiplePlans,
  replaceMeal,
  calcTargets
};
