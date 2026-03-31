const express = require("express");
const cors = require("cors");
const {
  generateMealPlan,
  generateFromFavorites,
  generateMultiplePlans,
  replaceMeal,
  calcTargets
} = require("./planner");
const { buildShoppingList } = require("./shopping");
const { makeWeeklyReport } = require("./report");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

app.post("/api/nutrition/calculate", (req, res) => {
  const targets = calcTargets(req.body || {});
  res.json({ targets });
});

app.post("/api/meal/generate", (req, res) => {
  const result = generateMealPlan(req.body || {});
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

app.post("/api/meal/generate-from-favorites", (req, res) => {
  const result = generateFromFavorites(req.body || {});
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

app.post("/api/meal/generate-multiple", (req, res) => {
  const { profile = {}, count = 3 } = req.body || {};
  const result = generateMultiplePlans(profile, count);
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

app.post("/api/meal/replace", (req, res) => {
  const { profile = {}, currentPlan = {}, mealType, extraExcludeIds = [] } = req.body || {};
  const result = replaceMeal(profile, currentPlan, mealType, extraExcludeIds);
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

app.post("/api/meal/shopping-list", (req, res) => {
  const { currentPlan = {} } = req.body || {};
  const list = buildShoppingList(currentPlan);
  return res.json({ list });
});

app.post("/api/meal/shopping-list-weekly", (req, res) => {
  const { history = [] } = req.body || {};
  const recent = history.slice(0, 7);
  const merged = recent.flatMap((d) => buildShoppingList(d.plan || {}));
  const map = new Map();
  merged.forEach((item) => {
    const key = `${item.name}__${item.unit}`;
    const prev = map.get(key);
    if (!prev) map.set(key, { ...item });
    else {
      prev.amount += item.amount;
      map.set(key, prev);
    }
  });
  const list = Array.from(map.values()).map((item) => ({
    ...item,
    amount: Number(item.amount.toFixed(1))
  }));
  return res.json({ list });
});

app.post("/api/meal/weekly-report", (req, res) => {
  const { history = [] } = req.body || {};
  const report = makeWeeklyReport(history);
  return res.json({ report });
});

app.listen(PORT, () => {
  console.log(`Meal planner API running on http://localhost:${PORT}`);
});
