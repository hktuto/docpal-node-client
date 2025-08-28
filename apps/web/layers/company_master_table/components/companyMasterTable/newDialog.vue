<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { apiClient } from 'api'
import type { FormInstance, FormRules } from 'element-plus'
import { displayNameToTableName, validateDisplayName, validateDescription } from '../../utils/stringUtils'

const routerProvider = inject<any>(MenuRouterKey)

const emits = defineEmits(['submit'])

const opened = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const formRef = ref<FormInstance>()

const form = reactive({
  definition: {
    table_name: '',
    display_name: '',
    description: '',
    table_type: "data",
    columns: [
      
    ]
  },
  metadata: [
    
  ]
})

// Form validation rules
const rules = ref<FormRules>({
  display_name: [
    { required: true, message: 'Display name is required', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const validation = validateDisplayName(value)
        if (!validation.isValid) {
          callback(new Error(validation.error))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  description: [
    {
      validator: (rule, value, callback) => {
        const validation = validateDescription(value)
        if (!validation.isValid) {
          callback(new Error(validation.error))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// Watch for display_name changes to auto-generate table_name
watch(
  () => form.definition.display_name,
  (newValue) => {
    if (newValue) {
      form.definition.table_name = displayNameToTableName(newValue)
    } else {
      form.definition.table_name = ''
    }
  }
)

function open() {
  resetForm()
  opened.value = true
  errorMessage.value = ''
}

function resetForm() {
  form.definition.display_name = ''
  form.definition.description = ''
  form.definition.table_name = ''
  // Keep the default columns and metadata
  formRef.value?.clearValidate()
}

function handleClose() {
  resetForm()
  opened.value = false
}

async function checkTableNameAvailability() {
  if (!form.definition.table_name) return
  
  try {
    const { data, success } = await apiClient.companies.getDataSchemaValidateNameTablename(
      form.definition.table_name
    )
    
    if (success && data) {
      if (!data.isValid || !data.isAvailable) {
        errorMessage.value = data.error || 'Table name is not available'
        return false
      }
    }
    return true
  } catch (error: any) {
    console.error('Error checking table name:', error)
    errorMessage.value = 'Unable to validate table name'
    return false
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  
  try {
    // Validate form
    const isValid = await formRef.value.validate()
    if (!isValid) return
    
    isLoading.value = true
    errorMessage.value = ''
    
    // Check table name availability
    const isTableNameValid = await checkTableNameAvailability()
    if (!isTableNameValid) {
      isLoading.value = false
      return
    }
    
    // Submit form
    const response = await apiClient.companies.postDataSchema(form)
    
    if (response?.success) {
      // Success - close dialog and emit event
      opened.value = false
      routerProvider.navigateTo({
        name: 'master_table_detail',
        label: "master_table_detail " + form.definition.table_name,
        component: 'LazyCompanyMasterTableDetail',
        props: {
          tableName: form.definition.table_name
        }
      })
      ElMessage.success('Data schema created successfully')
      resetForm()
    } else {
      errorMessage.value = 'Failed to create data schema. Please try again.'
    }
  } catch (error: any) {
    console.error('Error creating schema:', error)
    const errorBody = error?.response?.data
    if (errorBody?.message) {
      errorMessage.value = errorBody.message
    } else {
      errorMessage.value = error.message || 'Failed to create data schema. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Handle Enter key press for form submission
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

defineExpose({
  open
})

</script>

<style scoped lang="scss">
.form-help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

.error-alert {
  margin-bottom: var(--app-space-s);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--app-space-s);
}

:deep(.el-form-item) {
  margin-bottom: var(--app-space-m);
}

:deep(.el-input__count) {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

:deep(.el-textarea__count) {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>

<template>
  <ElDialog
    v-model="opened"
    title="Create New Data Schema"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <ElForm
      ref="formRef"
      :model="form.definition"
      :rules="rules"
      label-width="120px"
      @keydown="handleKeyDown"
    >
      <ElFormItem label="Display Name" prop="display_name">
        <ElInput
          v-model="form.definition.display_name"
          placeholder="Enter a descriptive name for your data schema"
          maxlength="200"
          show-word-limit
          autocomplete="off"
          :aria-label="'Display name input'"
        />
        <div class="form-help-text">
          This will be displayed in the interface. Can contain spaces and common punctuation.
        </div>
      </ElFormItem>

      <ElFormItem label="Table Name">
        <ElInput
          v-model="form.definition.table_name"
          placeholder="Auto-generated from display name"
          readonly
          :aria-label="'Table name (auto-generated)'"
        />
        <div class="form-help-text">
          Auto-generated database table name. This will be used internally.
        </div>
      </ElFormItem>

      <ElFormItem label="Description" prop="description">
        <ElInput
          v-model="form.definition.description"
          type="textarea"
          :rows="3"
          placeholder="Optional description of what this data schema will store..."
          maxlength="200"
          show-word-limit
          resize="none"
          :aria-label="'Description input'"
        />
        <div class="form-help-text">
          Optional description to help others understand the purpose of this data schema.
        </div>
      </ElFormItem>

      <ElAlert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        :closable="false"
        show-icon
        class="error-alert"
      />
    </ElForm>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="handleClose">Cancel</ElButton>
        <ElButton
          type="primary"
          :loading="isLoading"
          @click="handleSubmit"
        >
          Create Schema
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

