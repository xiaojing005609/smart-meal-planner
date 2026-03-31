function makeWeeklyReport(history = []) {
  const recent = history.slice(0, 7);
  if (!recent.length) {
    return {
      days: 0,
      score: 0,
      average: { kcal: 0, protein: 0, fat: 0, carb: 0 },
      statusCount: {
        kcal: { "达标": 0, "偏低": 0, "偏高": 0 },
        protein: { "达标": 0, "偏低": 0, "偏高": 0 },
        fat: { "达标": 0, "偏低": 0, "偏高": 0 },
        carb: { "达标": 0, "偏低": 0, "偏高": 0 }
      },
      suggestions: ["本周暂无数据，先生成并保存每日配餐。"]
    };
  }

  const average = recent.reduce(
    (acc, day) => {
      acc.kcal += day.totals?.kcal || 0;
      acc.protein += day.totals?.protein || 0;
      acc.fat += day.totals?.fat || 0;
      acc.carb += day.totals?.carb || 0;
      return acc;
    },
    { kcal: 0, protein: 0, fat: 0, carb: 0 }
  );

  Object.keys(average).forEach((key) => {
    average[key] = Number((average[key] / recent.length).toFixed(1));
  });

  const statusCount = {
    kcal: { "达标": 0, "偏低": 0, "偏高": 0 },
    protein: { "达标": 0, "偏低": 0, "偏高": 0 },
    fat: { "达标": 0, "偏低": 0, "偏高": 0 },
    carb: { "达标": 0, "偏低": 0, "偏高": 0 }
  };

  let hit = 0;
  let total = 0;
  recent.forEach((day) => {
    ["kcal", "protein", "fat", "carb"].forEach((key) => {
      const st = day.status?.[key] || "偏低";
      statusCount[key][st] += 1;
      total += 1;
      if (st === "达标") hit += 1;
    });
  });
  const score = Math.round((hit / total) * 100);

  const suggestions = [];
  ["protein", "fat", "carb", "kcal"].forEach((key) => {
    if (statusCount[key]["偏低"] > statusCount[key]["偏高"]) {
      suggestions.push(
        key === "protein"
          ? "蛋白质偏低天数较多，建议增加鸡蛋、豆腐、鱼、瘦肉。"
          : key === "carb"
            ? "碳水偏低天数较多，建议适当增加全谷物主食。"
            : key === "fat"
              ? "脂肪偏低天数较多，建议适量加入坚果和优质植物油。"
              : "总热量偏低天数较多，建议适当增加主食和优质蛋白。"
      );
    } else if (statusCount[key]["偏高"] > statusCount[key]["偏低"]) {
      suggestions.push(
        key === "protein"
          ? "蛋白质偏高天数较多，可略微下调高蛋白食材份量。"
          : key === "carb"
            ? "碳水偏高天数较多，可减少精制主食比例。"
            : key === "fat"
              ? "脂肪偏高天数较多，建议减少煎炸和高油菜品。"
              : "总热量偏高天数较多，可适当控制晚餐份量。"
      );
    }
  });

  if (!suggestions.length) suggestions.push("本周整体营养控制较好，继续保持。");

  return { days: recent.length, score, average, statusCount, suggestions };
}

module.exports = { makeWeeklyReport };
