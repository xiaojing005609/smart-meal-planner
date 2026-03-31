const DISHES = [
  {
    id: "oatmeal-milk-egg",
    name: "燕麦牛奶鸡蛋碗",
    mealType: "breakfast",
    tags: ["清淡", "快手", "家常", "低油"],
    ingredients: ["燕麦 50g", "牛奶 250ml", "鸡蛋 1个", "香蕉 80g"],
    recipeBrief: "燕麦加牛奶煮3-5分钟，鸡蛋水煮，搭配香蕉食用。",
    nutrition: { kcal: 470, protein: 24, fat: 16, carb: 58 }
  },
  {
    id: "tofu-veg-wrap",
    name: "豆腐蔬菜卷",
    mealType: "breakfast",
    tags: ["清淡", "家常", "低油"],
    ingredients: ["全麦饼 1张", "北豆腐 100g", "生菜 80g", "番茄 80g"],
    recipeBrief: "豆腐煎至微黄后和蔬菜卷入全麦饼。",
    nutrition: { kcal: 390, protein: 20, fat: 11, carb: 47 }
  },
  {
    id: "yogurt-fruit-toast",
    name: "酸奶水果全麦吐司",
    mealType: "breakfast",
    tags: ["清淡", "快手", "低油", "减脂"],
    ingredients: ["无糖酸奶 200g", "全麦吐司 2片", "蓝莓 60g", "奇异果 80g"],
    recipeBrief: "水果切块与酸奶拌匀，搭配全麦吐司。",
    nutrition: { kcal: 360, protein: 18, fat: 8, carb: 52 }
  },
  {
    id: "chicken-rice-bowl",
    name: "鸡胸肉糙米饭",
    mealType: "lunch",
    tags: ["家常", "低油", "增肌"],
    ingredients: ["鸡胸肉 150g", "糙米饭 180g", "西兰花 150g", "胡萝卜 80g"],
    recipeBrief: "鸡胸肉少油煎熟，蔬菜焯水，和糙米饭搭配。",
    nutrition: { kcal: 620, protein: 48, fat: 14, carb: 73 }
  },
  {
    id: "beef-potato-stir",
    name: "土豆牛肉家常炒",
    mealType: "lunch",
    tags: ["家常"],
    ingredients: ["牛里脊 130g", "土豆 150g", "青椒 70g", "米饭 150g"],
    recipeBrief: "牛肉先滑炒，加入土豆和青椒翻炒至熟。",
    nutrition: { kcal: 700, protein: 39, fat: 22, carb: 80 }
  },
  {
    id: "salmon-quinoa-salad",
    name: "三文鱼藜麦沙拉",
    mealType: "lunch",
    tags: ["清淡", "快手", "低油"],
    ingredients: ["三文鱼 120g", "藜麦 120g", "生菜 100g", "玉米 60g"],
    recipeBrief: "三文鱼煎熟后与煮熟藜麦及蔬菜拌匀。",
    nutrition: { kcal: 590, protein: 37, fat: 20, carb: 55 }
  },
  {
    id: "turkey-pasta-bowl",
    name: "火鸡肉意面碗",
    mealType: "lunch",
    tags: ["快手", "增肌"],
    ingredients: ["火鸡胸肉 150g", "全麦意面 130g", "番茄 100g", "西葫芦 80g"],
    recipeBrief: "意面煮熟后与炒熟火鸡肉和蔬菜混合。",
    nutrition: { kcal: 650, protein: 50, fat: 15, carb: 76 }
  },
  {
    id: "shrimp-egg-noodle",
    name: "虾仁鸡蛋面",
    mealType: "dinner",
    tags: ["快手", "家常"],
    ingredients: ["虾仁 120g", "鸡蛋 1个", "全麦面 100g", "小青菜 120g"],
    recipeBrief: "面煮熟后加入虾仁、鸡蛋和青菜煮1-2分钟。",
    nutrition: { kcal: 520, protein: 36, fat: 14, carb: 58 }
  },
  {
    id: "tofu-mushroom-soup",
    name: "豆腐菌菇汤配红薯",
    mealType: "dinner",
    tags: ["清淡", "家常", "低油"],
    ingredients: ["北豆腐 150g", "菌菇 120g", "红薯 180g", "菠菜 100g"],
    recipeBrief: "菌菇豆腐煮汤，红薯蒸熟后搭配食用。",
    nutrition: { kcal: 480, protein: 23, fat: 10, carb: 68 }
  },
  {
    id: "pork-cabbage-bowl",
    name: "瘦肉卷心菜饭",
    mealType: "dinner",
    tags: ["家常"],
    ingredients: ["瘦猪肉 120g", "卷心菜 150g", "米饭 150g", "木耳 50g"],
    recipeBrief: "瘦肉与卷心菜快炒，搭配米饭即可。",
    nutrition: { kcal: 600, protein: 34, fat: 18, carb: 70 }
  },
  {
    id: "cod-veg-rice",
    name: "鳕鱼蔬菜饭",
    mealType: "dinner",
    tags: ["清淡", "低油", "减脂"],
    ingredients: ["鳕鱼 150g", "米饭 130g", "芦笋 120g", "彩椒 80g"],
    recipeBrief: "鳕鱼煎熟，蔬菜快炒，搭配米饭。",
    nutrition: { kcal: 510, protein: 42, fat: 11, carb: 60 }
  }
];

const AVOID_MAP = {
  "海鲜": ["虾仁", "三文鱼"],
  "花生": ["花生"],
  "牛奶": ["牛奶"],
  "鸡蛋": ["鸡蛋"],
  "豆制品": ["豆腐", "北豆腐"],
  "牛肉": ["牛里脊", "牛肉"],
  "猪肉": ["瘦猪肉"],
  "虾": ["虾仁"]
};

module.exports = { DISHES, AVOID_MAP };
