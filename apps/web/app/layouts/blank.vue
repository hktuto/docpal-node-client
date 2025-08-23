<template>
  <div class="page">
    <LoadingBg />
    <slot />
  </div>
</template>

<style scoped>
.page{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

