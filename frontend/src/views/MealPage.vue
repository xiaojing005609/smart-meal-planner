<script setup>
import { onMounted } from "vue";
import { useAppStore } from "../stores/appStore";

const store = useAppStore();

onMounted(() => {
  if (!store.currentPlan) {
    store.generateTodayPlan();
  }
});
</script>

<template>
  <section>
    <div class="header-row">
      <h1>今日智能配餐</h1>
      <div class="actions">
        <button
          type="button"
          class="btn-fruit fruit-apple"
          @click="store.generateTodayPlan"
          :disabled="store.loading"
        >
          {{ store.generating ? "生成中..." : "重新生成" }}
        </button>
        <button
          type="button"
          class="btn-fruit fruit-banana"
          @click="store.generateTodayPlanFromFavorites"
          :disabled="store.loading"
        >
          从收藏生成
        </button>
        <button
          type="button"
          class="btn-fruit fruit-watermelon"
          @click="store.saveCurrentToHistory"
          :disabled="!store.currentPlan || store.loading"
        >
          保存到历史
        </button>
        <button
          type="button"
          class="btn-fruit fruit-orange"
          @click="store.clearDislikedToday"
          :disabled="store.loading"
        >
          清空不想吃
        </button>
      </div>
    </div>

    <p v-if="store.error" class="error">{{ store.error }}</p>

    <article class="card">
      <h3>本周饮食多样性</h3>
      <p>本周重复率：{{ store.weeklyDiversity.duplicateRate }}%</p>
      <p>多样性得分：{{ store.weeklyDiversity.diversityScore }} / 100</p>
      <p>
        统计口径：近7天共 {{ store.weeklyDiversity.totalCount }} 餐，涉及
        {{ store.weeklyDiversity.uniqueCount }} 道不同菜品。
      </p>
      <p class="tip-text">建议：{{ store.weeklyDiversityTip }}</p>
    </article>

    <div v-if="store.planOptions.length" class="plan-tabs">
      <button
        v-for="(_, idx) in store.planOptions"
        :key="idx"
        type="button"
        class="btn-fruit"
        :class="['fruit-grape', 'fruit-cherry', 'fruit-kiwi'][idx % 3]"
        @click="store.selectPlan(idx)"
      >
        方案 {{ idx + 1 }}
      </button>
    </div>

    <div v-if="store.currentPlan" class="grid">
      <article class="card">
        <h3>早餐：{{ store.currentPlan.plan.breakfast.name }}</h3>
        <p>食材：{{ store.currentPlan.plan.breakfast.ingredients.join("、") }}</p>
        <p>做法：{{ store.currentPlan.plan.breakfast.recipeBrief }}</p>
        <div class="meal-actions">
          <button
            type="button"
            class="btn-fruit fruit-strawberry"
            @click="store.toggleFavorite(store.currentPlan.plan.breakfast)"
            :disabled="store.generating"
          >
            {{ store.isFavorite(store.currentPlan.plan.breakfast.id) ? "取消收藏" : "收藏菜品" }}
          </button>
          <button
            type="button"
            class="btn-fruit fruit-mango"
            @click="store.dislikeDishForToday(store.currentPlan.plan.breakfast.id); store.replaceMealType('breakfast')"
            :disabled="store.generating"
          >
            今天不想吃
          </button>
          <button
            type="button"
            class="btn-fruit fruit-peach btn-replace"
            :class="{ 'btn-replace-active': store.replacingMealType === 'breakfast' }"
            @click="store.replaceMealType('breakfast')"
            :disabled="store.generating || store.replacingMealType === 'breakfast'"
          >
            {{ store.replacingMealType === "breakfast" ? "替换中..." : "替换早餐" }}
          </button>
        </div>
      </article>
      <article class="card">
        <h3>午餐：{{ store.currentPlan.plan.lunch.name }}</h3>
        <p>食材：{{ store.currentPlan.plan.lunch.ingredients.join("、") }}</p>
        <p>做法：{{ store.currentPlan.plan.lunch.recipeBrief }}</p>
        <div class="meal-actions">
          <button
            type="button"
            class="btn-fruit fruit-lemon"
            @click="store.toggleFavorite(store.currentPlan.plan.lunch)"
            :disabled="store.generating"
          >
            {{ store.isFavorite(store.currentPlan.plan.lunch.id) ? "取消收藏" : "收藏菜品" }}
          </button>
          <button
            type="button"
            class="btn-fruit fruit-pineapple"
            @click="store.dislikeDishForToday(store.currentPlan.plan.lunch.id); store.replaceMealType('lunch')"
            :disabled="store.generating"
          >
            今天不想吃
          </button>
          <button
            type="button"
            class="btn-fruit fruit-pear btn-replace"
            :class="{ 'btn-replace-active': store.replacingMealType === 'lunch' }"
            @click="store.replaceMealType('lunch')"
            :disabled="store.generating || store.replacingMealType === 'lunch'"
          >
            {{ store.replacingMealType === "lunch" ? "替换中..." : "替换午餐" }}
          </button>
        </div>
      </article>
      <article class="card">
        <h3>晚餐：{{ store.currentPlan.plan.dinner.name }}</h3>
        <p>食材：{{ store.currentPlan.plan.dinner.ingredients.join("、") }}</p>
        <p>做法：{{ store.currentPlan.plan.dinner.recipeBrief }}</p>
        <div class="meal-actions">
          <button
            type="button"
            class="btn-fruit fruit-blueberry"
            @click="store.toggleFavorite(store.currentPlan.plan.dinner)"
            :disabled="store.generating"
          >
            {{ store.isFavorite(store.currentPlan.plan.dinner.id) ? "取消收藏" : "收藏菜品" }}
          </button>
          <button
            type="button"
            class="btn-fruit fruit-melon"
            @click="store.dislikeDishForToday(store.currentPlan.plan.dinner.id); store.replaceMealType('dinner')"
            :disabled="store.generating"
          >
            今天不想吃
          </button>
          <button
            type="button"
            class="btn-fruit fruit-coconut btn-replace"
            :class="{ 'btn-replace-active': store.replacingMealType === 'dinner' }"
            @click="store.replaceMealType('dinner')"
            :disabled="store.generating || store.replacingMealType === 'dinner'"
          >
            {{ store.replacingMealType === "dinner" ? "替换中..." : "替换晚餐" }}
          </button>
        </div>
      </article>
    </div>

    <article v-if="store.currentPlan" class="card">
      <h3>当日营养汇总</h3>
      <p>
        热量 {{ store.currentPlan.totals.kcal }} / {{ store.currentPlan.targets.kcal }} kcal（{{ store.currentPlan.status.kcal }}）
      </p>
      <p>
        蛋白质 {{ store.currentPlan.totals.protein }} / {{ store.currentPlan.targets.protein }} g（{{ store.currentPlan.status.protein }}）
      </p>
      <p>
        脂肪 {{ store.currentPlan.totals.fat }} / {{ store.currentPlan.targets.fat }} g（{{ store.currentPlan.status.fat }}）
      </p>
      <p>
        碳水 {{ store.currentPlan.totals.carb }} / {{ store.currentPlan.targets.carb }} g（{{ store.currentPlan.status.carb }}）
      </p>
    </article>

    <article v-if="store.shoppingList.length" class="card">
      <h3>今日采购清单</h3>
      <p v-for="item in store.shoppingList" :key="`${item.name}-${item.unit}`">
        {{ item.name }}：{{ item.amount }}{{ item.unit }}
      </p>
    </article>
  </section>
</template>
