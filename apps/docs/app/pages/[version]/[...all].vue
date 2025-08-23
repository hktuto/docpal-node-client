<script setup lang="ts">
const route = useRoute()
const { data: page, error } = await useAsyncData(() => queryCollection('content').path(route.path).first())

</script>

<template>
  <NuxtLayout>
    <template v-if="error">
      {{ $route.path }}
      {{ error }}
    </template>
    <ContentRenderer v-else-if="page" :value="page" />
    <div v-else>
      {{ $route.path }}
      <h1>404</h1>
      <p>Page not found</p>
      <UButton @click="navigateTo('/')">Go to home</UButton>
    </div>
  </NuxtLayout>
</template>

