<template>
  <div class="container">
    <nav class="top-nav">
      <RouterLink to="/">配餐首页</RouterLink>
      <RouterLink to="/settings">个人设置</RouterLink>
      <RouterLink to="/history">历史记录</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
