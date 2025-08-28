<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { apiClient } from 'api'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  tableName: string
  schema?: any
}

const props = defineProps<Props>()
const emits = defineEmits(['submit', 'success'])

// Component state
const opened = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const formRef = ref<FormInstance>()
const formData = ref<Record<string, any>>({})

// Computed properties
const editableColumns = computed(() => {
  if (!props.schema?.columns) return []
  return props.schema.columns.filter((col: any) => 
    col.is_visible && 
    !col.is_system && 
    col.column_name !== 'id' &&
    col.column_name !== 'created_at' &&
    col.column_name !== 'updated_at' &&
    col.column_name !== 'created_by'
  )
})

const requiredColumns = computed(() => {
  return editableColumns.value.filter((col: any) => 
    col.is_required || 
    (!col.is_nullable && !col.default_value)
  )
})

// Form validation rules
const rules = computed<FormRules>(() => {
  const formRules: FormRules = {}
  
  editableColumns.value.forEach((column: any) => {
    const columnRules: any[] = []
    
    // Required validation
    if (requiredColumns.value.some((req: any) => req.column_name === column.column_name)) {
      columnRules.push({
        required: true,
        message: `${column.display_name} is required`,
        trigger: 'blur'
      })
    }
    
    // Type-specific validation
    switch (column.data_type) {
      case 'email':
        columnRules.push({
          type: 'email',
          message: 'Please enter a valid email address',
          trigger: 'blur'
        })
        break
      case 'number':
      case 'integer':
        columnRules.push({
          validator: (rule: any, value: any, callback: any) => {
            if (value && isNaN(Number(value))) {
              callback(new Error('Please enter a valid number'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        })
        break
      case 'url':
        columnRules.push({
          pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
          message: 'Please enter a valid URL',
          trigger: 'blur'
        })
        break
    }
    
    // Length validation
    if (column.max_length) {
      columnRules.push({
        max: column.max_length,
        message: `${column.display_name} cannot exceed ${column.max_length} characters`,
        trigger: 'blur'
      })
    }
    
    if (column.min_length) {
      columnRules.push({
        min: column.min_length,
        message: `${column.display_name} must be at least ${column.min_length} characters`,
        trigger: 'blur'
      })
    }
    
    if (columnRules.length > 0) {
      formRules[column.column_name] = columnRules
    }
  })
  
  return formRules
})

// Initialize form data
function initializeFormData() {
  const data: Record<string, any> = {}
  
  editableColumns.value.forEach((column: any) => {
    // Set default values based on column type
    switch (column.data_type) {
      case 'boolean':
        data[column.column_name] = column.default_value !== undefined ? column.default_value : false
        break
      case 'number':
      case 'integer':
        data[column.column_name] = column.default_value !== undefined ? Number(column.default_value) : null
        break
      case 'json':
        data[column.column_name] = column.default_value || {}
        break
      case 'array':
        data[column.column_name] = column.default_value || []
        break
      default:
        data[column.column_name] = column.default_value || ''
    }
  })
  
  formData.value = data
}

// Component methods
function open() {
  if (!props.schema) {
    ElMessage.error('Schema not loaded. Please try again.')
    return
  }
  
  initializeFormData()
  opened.value = true
  errorMessage.value = ''
  
  // Focus first input after dialog opens
  nextTick(() => {
    const firstInput = document.querySelector('.record-form .el-input__inner') as HTMLElement
    if (firstInput) {
      firstInput.focus()
    }
  })
}

function handleClose() {
  opened.value = false
  initializeFormData()
  formRef.value?.clearValidate()
  errorMessage.value = ''
}

async function handleSubmit() {
  if (!formRef.value) return
  
  try {
    // Validate form
    const isValid = await formRef.value.validate()
    if (!isValid) return
    
    isLoading.value = true
    errorMessage.value = ''
    
    // Prepare data for submission
    const submitData = { ...formData.value }
    
    // Process data based on column types
    editableColumns.value.forEach((column: any) => {
      const value = submitData[column.column_name]
      
      // Handle empty values
      if (value === '' || value === null || value === undefined) {
        if (column.is_nullable) {
          submitData[column.column_name] = null
        } else if (column.default_value !== undefined) {
          submitData[column.column_name] = column.default_value
        }
        return
      }
      
      // Type conversion
      switch (column.data_type) {
        case 'number':
        case 'integer':
          submitData[column.column_name] = Number(value)
          break
        case 'boolean':
          submitData[column.column_name] = Boolean(value)
          break
        case 'json':
          if (typeof value === 'string') {
            try {
              submitData[column.column_name] = JSON.parse(value)
            } catch (error) {
              submitData[column.column_name] = value
            }
          }
          break
        case 'array':
          if (typeof value === 'string') {
            try {
              submitData[column.column_name] = JSON.parse(value)
            } catch (error) {
              // Try to split by comma if JSON parsing fails
              submitData[column.column_name] = value.split(',').map(item => item.trim())
            }
          }
          break
      }
    })
    
    // Submit to API
    const { success, data } = await apiClient.companies.postDataRecordsTablenameRecords(
      props.tableName,
      submitData
    )
    
    if (success) {
      ElNotification.success({
        title: 'Success',
        message: 'Record created successfully',
        duration: 3000
      })
      
      opened.value = false
      emits('success', data)
      emits('submit')
    } else {
      errorMessage.value = 'Failed to create record. Please check your data and try again.'
    }
  } catch (error: any) {
    console.error('Error creating record:', error)
    
    const errorBody = error?.response?.data
    if (errorBody?.message) {
      errorMessage.value = errorBody.message
    } else if (errorBody?.errors) {
      // Handle validation errors
      const errors = Object.entries(errorBody.errors)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
        .join('; ')
      errorMessage.value = `Validation errors: ${errors}`
    } else {
      errorMessage.value = error.message || 'Failed to create record. Please try again.'
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

// Get appropriate input component for column type
function getInputComponent(column: any) {
  switch (column.data_type) {
    case 'boolean':
      return 'switch'
    case 'number':
    case 'integer':
      return 'number'
    case 'date':
      return 'date'
    case 'datetime':
    case 'timestamp':
      return 'datetime'
    case 'text':
    case 'varchar':
      if (column.max_length && column.max_length > 255) {
        return 'textarea'
      }
      return 'input'
    case 'json':
    case 'array':
      return 'textarea'
    default:
      return 'input'
  }
}

// Get placeholder text for input
function getPlaceholder(column: any): string {
  const basePlaceholder = `Enter ${column.display_name.toLowerCase()}`
  
  switch (column.data_type) {
    case 'email':
      return 'Enter email address'
    case 'url':
      return 'Enter URL (e.g., https://example.com)'
    case 'json':
      return 'Enter JSON object (e.g., {"key": "value"})'
    case 'array':
      return 'Enter array as JSON (e.g., ["item1", "item2"]) or comma-separated values'
    case 'date':
      return 'Select date'
    case 'datetime':
    case 'timestamp':
      return 'Select date and time'
    default:
      return basePlaceholder
  }
}

// Get form field help text
function getHelpText(column: any): string {
  const hints: string[] = []
  
  if (column.min_length) {
    hints.push(`Min length: ${column.min_length}`)
  }
  if (column.max_length) {
    hints.push(`Max length: ${column.max_length}`)
  }
  if (column.default_value !== undefined) {
    hints.push(`Default: ${column.default_value}`)
  }
  if (column.description) {
    hints.push(column.description)
  }
  
  return hints.join(' • ')
}

// Expose methods for parent component
defineExpose({
  open
})
</script>

<template>
  <ElDialog 
    v-model="opened" 
    :title="`Add New Record - ${schema?.tableName || tableName}`"
    width="600px"
    destroy-on-close
    @close="handleClose"
    @keydown="handleKeyDown"
  >
    <div v-if="!schema" class="no-schema">
      <ElAlert 
        title="Schema Not Loaded" 
        description="Please ensure the table schema is loaded before adding records."
        type="warning" 
        show-icon 
        :closable="false"
      />
    </div>
    
    <div v-else-if="editableColumns.length === 0" class="no-columns">
      <ElAlert 
        title="No Editable Columns" 
        description="This table has no columns that can be edited."
        type="info" 
        show-icon 
        :closable="false"
      />
    </div>
    
    <div v-else class="record-form">
      <!-- Error message display -->
      <ElAlert 
        v-if="errorMessage" 
        :title="errorMessage"
        type="error" 
        show-icon 
        :closable="false"
        class="error-alert"
      />
      
      <!-- Dynamic form based on schema -->
      <ElForm 
        ref="formRef"
        :model="formData" 
        :rules="rules"
        label-width="140px"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <ElFormItem 
          v-for="column in editableColumns" 
          :key="column.id"
          :label="column.display_name"
          :prop="column.column_name"
          :required="requiredColumns.some((req: any) => req.column_name === column.column_name)"
        >
          <!-- Text Input -->
          <ElInput 
            v-if="getInputComponent(column) === 'input'"
            v-model="formData[column.column_name]"
            :placeholder="getPlaceholder(column)"
            :maxlength="column.max_length"
            clearable
          />
          
          <!-- Textarea -->
          <ElInput 
            v-else-if="getInputComponent(column) === 'textarea'"
            v-model="formData[column.column_name]"
            type="textarea"
            :placeholder="getPlaceholder(column)"
            :rows="4"
            :maxlength="column.max_length"
            show-word-limit
          />
          
          <!-- Number Input -->
          <ElInputNumber 
            v-else-if="getInputComponent(column) === 'number'"
            v-model="formData[column.column_name]"
            :placeholder="getPlaceholder(column)"
            :min="column.min_value"
            :max="column.max_value"
            :precision="column.data_type === 'integer' ? 0 : 2"
            style="width: 100%"
          />
          
          <!-- Boolean Switch -->
          <ElSwitch 
            v-else-if="getInputComponent(column) === 'switch'"
            v-model="formData[column.column_name]"
            :active-text="'Yes'"
            :inactive-text="'No'"
          />
          
          <!-- Date Picker -->
          <ElDatePicker 
            v-else-if="getInputComponent(column) === 'date'"
            v-model="formData[column.column_name]"
            type="date"
            :placeholder="getPlaceholder(column)"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
          
          <!-- DateTime Picker -->
          <ElDatePicker 
            v-else-if="getInputComponent(column) === 'datetime'"
            v-model="formData[column.column_name]"
            type="datetime"
            :placeholder="getPlaceholder(column)"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
          
          <!-- Default Input -->
          <ElInput 
            v-else
            v-model="formData[column.column_name]"
            :placeholder="getPlaceholder(column)"
            :maxlength="column.max_length"
            clearable
          />
          
          <!-- Help text -->
          <div v-if="getHelpText(column)" class="form-help-text">
            {{ getHelpText(column) }}
          </div>
        </ElFormItem>
      </ElForm>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="handleClose" :disabled="isLoading">
          Cancel
        </ElButton>
        <ElButton 
          type="primary" 
          @click="handleSubmit"
          :loading="isLoading"
          :disabled="!schema || editableColumns.length === 0"
        >
          {{ isLoading ? 'Creating...' : 'Create Record' }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.record-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--el-fill-color-dark);
    border-radius: 3px;
    
    &:hover {
      background: var(--el-fill-color-darker);
    }
  }
}

.no-schema,
.no-columns {
  padding: 20px 0;
}

.form-help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.4;
  
  &:empty {
    display: none;
  }
}

.error-alert {
  margin-bottom: var(--app-space-m);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--app-space-s);
}

:deep(.el-form-item) {
  margin-bottom: var(--app-space-m);
  
  .el-form-item__label {
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

:deep(.el-form-item__error) {
  font-size: 12px;
  line-height: 1.4;
}

// Responsive adjustments
@media (max-width: 768px) {
  .record-form {
    max-height: 50vh;
  }
}
</style>