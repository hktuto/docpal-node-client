
<script setup lang="ts">


definePageMeta({
  public: true,
  layout: 'blank'
})
const isLoading = ref(false)
const form = ref({
  email: '',
  password: ''
})

const rules = ref({
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' }
  ]
})
const handleLogin = async () => {
  try {
    isLoading.value = true
    const response = await loginApi(form.value.email, form.value.password)
    if(response.success){
      navigateTo('/')
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container"> 
 
    <ElCard class="cardContainer">
      <ElForm :model="form" :rules="rules" label-position="top">
        <ElFormItem label="Email" prop="email">
          <ElInput v-model="form.email" />
        </ElFormItem>
        <ElFormItem label="Password" prop="password">
          <ElInput v-model="form.password" type="password" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton type="primary" @click="handleLogin">Login</ElButton>
      </template>
    </ElCard>
    <LoadingBg />
   </div>
</template>


<style scoped>
.container{
  width: 100vw;
  height: 100vh;
  position: relative;
  display: grid;
  place-items: center;
}
.cardContainer{
  min-width: 260px;
  max-width: 600px;
  width: 100%;
}
</style>