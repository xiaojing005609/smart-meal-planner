<template>
  <div class="container">
    <nav class="top-nav">
      <RouterLink class="btn-fruit fruit-peach" to="/">配餐首页</RouterLink>
      <RouterLink class="btn-fruit fruit-kiwi" to="/settings">个人设置</RouterLink>
      <RouterLink class="btn-fruit fruit-grape" to="/history">历史记录</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
