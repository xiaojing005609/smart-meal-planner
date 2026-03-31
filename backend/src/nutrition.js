function calcTargets(profile = {}) {
  const age = Number(profile.age) || 25;
  const height = Number(profile.height) || 165;
  const weight = Number(profile.weight) || 60;
  const gender = profile.gender === "male" ? "male" : "female";
  const activity = profile.activityLevel || "light";

  const activityMap = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    intense: 1.725
  };

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * (activityMap[activity] || 1.375));
  const goal = profile.goal || "maintain";
  let targetKcal = tdee;
  let proteinRate = 0.2;
  let fatRate = 0.25;
  let carbRate = 0.5;

  if (goal === "lose_fat") {
    targetKcal = Math.round(tdee * 0.85);
    proteinRate = 0.3;
    fatRate = 0.25;
    carbRate = 0.45;
  } else if (goal === "build_muscle") {
    targetKcal = Math.round(tdee * 1.1);
    proteinRate = 0.28;
    fatRate = 0.25;
    carbRate = 0.47;
  }

  const protein = Math.round((targetKcal * proteinRate) / 4);
  const fat = Math.round((targetKcal * fatRate) / 9);
  const carb = Math.round((targetKcal * carbRate) / 4);

  return {
    kcal: targetKcal,
    protein,
    fat,
    carb
  };
}

function sumNutrition(items = []) {
  return items.reduce(
    (acc, item) => {
      acc.kcal += item.nutrition.kcal;
      acc.protein += item.nutrition.protein;
      acc.fat += item.nutrition.fat;
      acc.carb += item.nutrition.carb;
      return acc;
    },
    { kcal: 0, protein: 0, fat: 0, carb: 0 }
  );
}

function getStatus(total, target) {
  const status = {};
  for (const key of ["kcal", "protein", "fat", "carb"]) {
    const ratio = target[key] ? total[key] / target[key] : 0;
    if (ratio < 0.9) status[key] = "偏低";
    else if (ratio > 1.1) status[key] = "偏高";
    else status[key] = "达标";
  }
  return status;
}

module.exports = { calcTargets, sumNutrition, getStatus };
