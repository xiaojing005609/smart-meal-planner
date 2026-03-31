<script setup>
import { onMounted } from "vue";
import { useAppStore } from "../stores/appStore";

const store = useAppStore();
onMounted(() => {
  store.updateWeeklyData();
});
</script>

<template>
  <section>
    <h1>历史配餐记录</h1>
    <div class="card" v-if="store.favorites.length">
      <h3>已收藏菜品</h3>
      <p v-for="item in store.favorites" :key="item.id">
        {{ item.name }}（{{ item.mealType === "breakfast" ? "早餐" : item.mealType === "lunch" ? "午餐" : "晚餐" }}）
      </p>
    </div>
    <div class="card" v-if="store.dislikedDishIds.length">
      <h3>今日不想吃（临时）</h3>
      <p>已标记 {{ store.dislikedDishIds.length }} 道菜，今日生成会自动避开。</p>
    </div>
    <p v-if="!store.history.length">还没有历史记录，先去首页生成并保存一份吧。</p>

    <div class="card" v-if="store.weeklyReport">
      <h3>每周营养复盘（近{{ store.weeklyReport.days }}天）</h3>
      <p>达标分数：{{ store.weeklyReport.score }} / 100</p>
      <p>
        平均摄入：{{ store.weeklyReport.average.kcal }} kcal / 蛋白
        {{ store.weeklyReport.average.protein }}g / 脂肪
        {{ store.weeklyReport.average.fat }}g / 碳水
        {{ store.weeklyReport.average.carb }}g
      </p>
      <p v-for="(item, idx) in store.weeklyReport.suggestions" :key="idx">建议：{{ item }}</p>
    </div>

    <div class="card" v-if="store.weeklyShoppingList.length">
      <h3>一周采购清单（近7天）</h3>
      <p v-for="item in store.weeklyShoppingList" :key="`${item.name}-${item.unit}`">
        {{ item.name }}：{{ item.amount }}{{ item.unit }}
      </p>
    </div>
    <div class="card">
      <h3>连续7天去重策略</h3>
      <p>系统会优先避开近7天已经吃过的菜品，减少重复；菜品不足时自动回退保证可生成。</p>
    </div>

    <div v-for="item in store.history" :key="item.date" class="card">
      <h3>{{ item.date }}</h3>
      <p>早餐：{{ item.plan.breakfast.name }}</p>
      <p>午餐：{{ item.plan.lunch.name }}</p>
      <p>晚餐：{{ item.plan.dinner.name }}</p>
      <p>
        汇总：{{ item.totals.kcal }} kcal / 蛋白 {{ item.totals.protein }}g / 脂肪
        {{ item.totals.fat }}g / 碳水 {{ item.totals.carb }}g
      </p>
    </div>
  </section>
</template>
