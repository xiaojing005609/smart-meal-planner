function parseIngredient(raw) {
  const text = String(raw || "").trim();
  const match = text.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(g|ml|个|片|张)$/);
  if (!match) {
    return { name: text, amount: 1, unit: "份" };
  }
  return {
    name: match[1].trim(),
    amount: Number(match[2]),
    unit: match[3]
  };
}

function mergeList(parsedItems) {
  const map = new Map();
  parsedItems.forEach((item) => {
    const key = `${item.name}__${item.unit}`;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, { ...item });
    } else {
      prev.amount += item.amount;
      map.set(key, prev);
    }
  });
  return Array.from(map.values()).map((item) => ({
    ...item,
    amount: Number(item.amount.toFixed(1))
  }));
}

function buildShoppingList(plan) {
  if (!plan) return [];
  const allDishes = [plan.breakfast, plan.lunch, plan.dinner].filter(Boolean);
  const ingredients = allDishes.flatMap((dish) => dish.ingredients || []);
  const parsed = ingredients.map(parseIngredient);
  return mergeList(parsed);
}

module.exports = { buildShoppingList };
