<script setup>
import { reactive } from "vue";
import { useAppStore } from "../stores/appStore";

const store = useAppStore();

const form = reactive({
  ...store.profile,
  preferencesText: store.profile.preferences.join("、"),
  avoidText: store.profile.avoidIngredients.join("、")
});

function save() {
  store.saveProfile({
    age: Number(form.age),
    gender: form.gender,
    height: Number(form.height),
    weight: Number(form.weight),
    activityLevel: form.activityLevel,
    goal: form.goal || "maintain",
    preferences: form.preferencesText
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
    avoidIngredients: form.avoidText
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean)
  });
  alert("设置已保存");
}
</script>

<template>
  <section>
    <h1>个人设置</h1>
    <div class="card form">
      <label>年龄 <input v-model="form.age" type="number" min="10" max="100" /></label>
      <label>
        性别
        <select v-model="form.gender">
          <option value="female">女</option>
          <option value="male">男</option>
        </select>
      </label>
      <label>身高(cm) <input v-model="form.height" type="number" /></label>
      <label>体重(kg) <input v-model="form.weight" type="number" /></label>
      <label>
        活动量
        <select v-model="form.activityLevel">
          <option value="sedentary">久坐</option>
          <option value="light">轻度运动</option>
          <option value="moderate">中度运动</option>
          <option value="intense">高强度运动</option>
        </select>
      </label>
      <label>
        饮食目标
        <select v-model="form.goal">
          <option value="maintain">日常维持</option>
          <option value="lose_fat">减脂</option>
          <option value="build_muscle">增肌</option>
        </select>
      </label>
      <label>偏好（用顿号分隔）<input v-model="form.preferencesText" placeholder="家常、清淡、低油" /></label>
      <label>忌口/过敏（用顿号分隔）<input v-model="form.avoidText" placeholder="海鲜、花生" /></label>
      <button type="button" class="btn-fruit fruit-apple" @click="save">保存设置</button>
      <button type="button" class="btn-fruit fruit-banana" @click="store.resetWeeklyStrategy()">
        每周一键重置饮食策略
      </button>
      <p v-if="store.strategyMessage" class="tip-text">{{ store.strategyMessage }}</p>
    </div>
  </section>
</template>
