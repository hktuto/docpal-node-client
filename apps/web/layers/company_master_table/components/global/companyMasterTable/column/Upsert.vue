<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { apiClient } from 'api'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  tableName: string
  schema?: any
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'column-saved': [column: any]
  'refresh-schema': []
}>()

// Reactive data
const isVisible = ref(false)
const isLoading = ref(false)
const editingColumn = ref<any>(null)
const formRef = ref<FormInstance>()

const columnForm = ref<any>({
  // Database column definition
  column: {
    name: '',
    type: 'varchar',
    primaryKey: false,
    notNull: false,
    unique: false,
    default: undefined,
    defaultRandom: false,
    defaultNow: false,
    withTimezone: false,
    foreignKey: undefined
  },
  // UI metadata
  metadata: {
    column_name: '',
    display_name: '',
    data_type: 'text',
    can_sort: true,
    can_filter: true,
    can_group: false,
    filter_type: 'text',
    is_visible: true,
    is_system: false,
    is_virtual: false,
    foreign_key_info: null,
    virtual_config: null,
    display_order: 0
  }
})

// Computed properties
const dialogTitle = computed(() => {
  return editingColumn.value ? 'Edit Column' : 'Add Column'
})

const buttonText = computed(() => {
  return editingColumn.value ? 'Update' : 'Add'
})

// Data type options (for UI)
const dataTypeOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Date', value: 'date' },
  { label: 'DateTime', value: 'datetime' },
  { label: 'UUID', value: 'uuid' },
  { label: 'JSON', value: 'json' },
  { label: 'Email', value: 'email' },
  { label: 'URL', value: 'url' }
]

// Database column type options (for database schema)
const dbColumnTypeOptions = [
  { label: 'VARCHAR(255)', value: 'varchar' },
  { label: 'TEXT', value: 'text' },
  { label: 'INTEGER', value: 'integer' },
  { label: 'BIGINT', value: 'bigint' },
  { label: 'DECIMAL', value: 'decimal' },
  { label: 'BOOLEAN', value: 'boolean' },
  { label: 'DATE', value: 'date' },
  { label: 'TIMESTAMP', value: 'timestamp' },
  { label: 'TIME', value: 'time' },
  { label: 'UUID', value: 'uuid' },
  { label: 'JSON', value: 'json' },
  { label: 'JSONB', value: 'jsonb' }
]

// Filter type options
const filterTypeOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
  { label: 'DateTime', value: 'datetime' },
  { label: 'Select', value: 'select' },
  { label: 'Boolean', value: 'boolean' }
]

// Foreign key cascade options
const cascadeOptions = [
  { label: 'CASCADE', value: 'cascade' },
  { label: 'RESTRICT', value: 'restrict' },
  { label: 'SET NULL', value: 'set null' }
]

// Form validation rules
const columnRules = ref<FormRules>({
  'metadata.column_name': [
    { required: true, message: 'Column name is required', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: 'Column name must start with letter and contain only letters, numbers, and underscores', trigger: 'blur' }
  ],
  'metadata.display_name': [
    { required: true, message: 'Display name is required', trigger: 'blur' }
  ],
  'metadata.data_type': [
    { required: true, message: 'Data type is required', trigger: 'change' }
  ],
  'column.type': [
    { required: true, message: 'Database type is required', trigger: 'change' }
  ]
})

// Watch for column name changes to sync with metadata
watch(() => columnForm.value.metadata.column_name, (newValue) => {
  columnForm.value.column.name = newValue
})

// Component methods
function openForAdd() {
  editingColumn.value = null
  columnForm.value = {
    // Database column definition
    column: {
      name: '',
      type: 'varchar',
      primaryKey: false,
      notNull: false,
      unique: false,
      default: undefined,
      defaultRandom: false,
      defaultNow: false,
      withTimezone: false,
      foreignKey: undefined
    },
    // UI metadata
    metadata: {
      column_name: '',
      display_name: '',
      data_type: 'text',
      can_sort: true,
      can_filter: true,
      can_group: false,
      filter_type: 'text',
      is_visible: true,
      is_system: false,
      is_virtual: false,
      foreign_key_info: null,
      virtual_config: null,
      display_order: (props.schema?.columns?.length || 0) + 1
    }
  }
  isVisible.value = true
}

function openForEdit(column: any) {
  editingColumn.value = column
  
  // Map existing column data to the new structure
  columnForm.value = {
    column: {
      name: column.column_name || '',
      type: column.db_type || 'varchar',
      primaryKey: column.is_primary_key || false,
      notNull: !column.is_nullable || false,
      unique: column.is_unique || false,
      default: column.default_value,
      defaultRandom: column.default_random || false,
      defaultNow: column.default_now || false,
      withTimezone: column.with_timezone || false,
      foreignKey: column.foreign_key_info ? {
        table: column.foreign_key_info.table || '',
        column: column.foreign_key_info.column || '',
        onDelete: column.foreign_key_info.on_delete || 'restrict'
      } : undefined
    },
    metadata: {
      column_name: column.column_name || '',
      display_name: column.display_name || '',
      data_type: column.data_type || 'text',
      can_sort: column.can_sort !== undefined ? column.can_sort : true,
      can_filter: column.can_filter !== undefined ? column.can_filter : true,
      can_group: column.can_group !== undefined ? column.can_group : false,
      filter_type: column.filter_type || 'text',
      is_visible: column.is_visible !== undefined ? column.is_visible : true,
      is_system: column.is_system || false,
      is_virtual: column.is_virtual || false,
      foreign_key_info: column.foreign_key_info || null,
      virtual_config: column.virtual_config || null,
      display_order: column.display_order || 0
    }
  }
  
  isVisible.value = true
}

function openForDuplicate(column: any) {
  editingColumn.value = null
  
  // Map existing column data but create a new column
  columnForm.value = {
    column: {
      name: `${column.column_name}_copy`,
      type: column.db_type || 'varchar',
      primaryKey: false, // Never duplicate primary key
      notNull: column.is_nullable === false,
      unique: false, // Never duplicate unique constraint
      default: column.default_value,
      defaultRandom: column.default_random || false,
      defaultNow: column.default_now || false,
      withTimezone: column.with_timezone || false,
      foreignKey: undefined // Don't duplicate foreign keys
    },
    metadata: {
      column_name: `${column.column_name}_copy`,
      display_name: `${column.display_name} (Copy)`,
      data_type: column.data_type || 'text',
      can_sort: column.can_sort !== undefined ? column.can_sort : true,
      can_filter: column.can_filter !== undefined ? column.can_filter : true,
      can_group: column.can_group !== undefined ? column.can_group : false,
      filter_type: column.filter_type || 'text',
      is_visible: true,
      is_system: false,
      is_virtual: false,
      foreign_key_info: null,
      virtual_config: null,
      display_order: (props.schema?.columns?.length || 0) + 1
    }
  }
  
  isVisible.value = true
}

function close() {
  isVisible.value = false
  editingColumn.value = null
  formRef.value?.clearValidate()
}

async function saveColumn() {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    isLoading.value = true
    
    // Ensure column name and metadata column_name are synchronized
    columnForm.value.column.name = columnForm.value.metadata.column_name
    
    // Prepare the API payload according to the schema
    const apiPayload = {
      column: {
        name: columnForm.value.column.name,
        type: columnForm.value.column.type,
        primaryKey: columnForm.value.column.primaryKey,
        notNull: columnForm.value.column.notNull,
        unique: columnForm.value.column.unique,
        default: columnForm.value.column.default || undefined,
        defaultRandom: columnForm.value.column.defaultRandom,
        defaultNow: columnForm.value.column.defaultNow,
        withTimezone: columnForm.value.column.withTimezone,
        foreignKey: columnForm.value.column.foreignKey || undefined
      },
      metadata: {
        column_name: columnForm.value.metadata.column_name,
        display_name: columnForm.value.metadata.display_name,
        data_type: columnForm.value.metadata.data_type,
        can_sort: columnForm.value.metadata.can_sort,
        can_filter: columnForm.value.metadata.can_filter,
        can_group: columnForm.value.metadata.can_group,
        filter_type: columnForm.value.metadata.filter_type,
        is_visible: columnForm.value.metadata.is_visible,
        is_system: columnForm.value.metadata.is_system,
        is_virtual: columnForm.value.metadata.is_virtual,
        foreign_key_info: columnForm.value.metadata.foreign_key_info,
        virtual_config: columnForm.value.metadata.virtual_config,
        display_order: columnForm.value.metadata.display_order
      }
    }
    
    // Make the API call
    const { success, data } = await apiClient.companies.postDataSchemaTablenameColumns(
      props.tableName,
      apiPayload
    )
    
    if (success) {
      ElNotification.success({
        title: 'Success',
        message: editingColumn.value ? 'Column updated successfully' : 'Column added successfully',
        duration: 3000
      })
      
      isVisible.value = false
      emit('column-saved', data)
      emit('refresh-schema')
    } else {
      ElMessage.error('Failed to save column. Please check your data and try again.')
    }
  } catch (error: any) {
    console.error('Error saving column:', error)
    
    const errorBody = error?.response?.data
    if (errorBody?.message) {
      ElMessage.error(errorBody.message)
    } else if (errorBody?.errors) {
      // Handle validation errors
      const errors = Object.entries(errorBody.errors)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
        .join('; ')
      ElMessage.error(`Validation errors: ${errors}`)
    } else {
      ElMessage.error(error.message || 'Failed to save column. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

// Expose methods for parent component
defineExpose({
  openForAdd,
  openForEdit,
  openForDuplicate,
  close
})
</script>

<template>
  <ElDialog 
    v-model="isVisible" 
    :title="dialogTitle"
    width="600px"
    destroy-on-close
    @close="close"
  >
    <ElForm 
      ref="formRef"
      :model="columnForm" 
      :rules="columnRules"
      label-width="140px"
    >
      <!-- Basic Information -->
      <ElDivider content-position="left">Basic Information</ElDivider>
      
      <ElFormItem label="Column Name" prop="metadata.column_name">
        <ElInput 
          v-model="columnForm.metadata.column_name" 
          placeholder="Enter column name (e.g., user_email)"
          :disabled="editingColumn && editingColumn.is_system"
        />
        <div class="form-help-text">Use snake_case format. This will be the actual database column name.</div>
      </ElFormItem>
      
      <ElFormItem label="Display Name" prop="metadata.display_name">
        <ElInput 
          v-model="columnForm.metadata.display_name" 
          placeholder="Enter display name (e.g., Email Address)"
        />
        <div class="form-help-text">Human-readable name shown in the UI.</div>
      </ElFormItem>
      
      <!-- Database Configuration -->
      <ElDivider content-position="left">Database Configuration</ElDivider>
      
      <ElFormItem label="Database Type" prop="column.type">
        <ElSelect 
          v-model="columnForm.column.type" 
          placeholder="Select database column type"
          style="width: 100%"
        >
          <ElOption 
            v-for="option in dbColumnTypeOptions" 
            :key="option.value"
            :label="option.label" 
            :value="option.value"
          />
        </ElSelect>
        <div class="form-help-text">The actual database column type.</div>
      </ElFormItem>
      
      <ElFormItem label="Data Type" prop="metadata.data_type">
        <ElSelect 
          v-model="columnForm.metadata.data_type" 
          placeholder="Select UI data type"
          style="width: 100%"
        >
          <ElOption 
            v-for="option in dataTypeOptions" 
            :key="option.value"
            :label="option.label" 
            :value="option.value"
          />
        </ElSelect>
        <div class="form-help-text">How the data should be displayed and validated in the UI.</div>
      </ElFormItem>
      
      <ElFormItem label="Filter Type" prop="metadata.filter_type">
        <ElSelect 
          v-model="columnForm.metadata.filter_type" 
          placeholder="Select filter type"
          style="width: 100%"
        >
          <ElOption 
            v-for="option in filterTypeOptions" 
            :key="option.value"
            :label="option.label" 
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>
      
      <!-- Database Constraints -->
      <ElDivider content-position="left">Database Constraints</ElDivider>
      
      <ElFormItem label="Default Value">
        <ElInput 
          v-model="columnForm.column.default" 
          placeholder="Enter default value (optional)"
        />
      </ElFormItem>
      
      <ElFormItem label="Constraints">
        <div class="checkbox-group">
          <ElCheckbox v-model="columnForm.column.primaryKey">Primary Key</ElCheckbox>
          <ElCheckbox v-model="columnForm.column.notNull">Not Null</ElCheckbox>
          <ElCheckbox v-model="columnForm.column.unique">Unique</ElCheckbox>
          <ElCheckbox v-model="columnForm.column.defaultRandom">Default Random</ElCheckbox>
          <ElCheckbox v-model="columnForm.column.defaultNow">Default Now</ElCheckbox>
          <ElCheckbox v-model="columnForm.column.withTimezone">With Timezone</ElCheckbox>
        </div>
      </ElFormItem>
      
      <!-- Foreign Key Configuration -->
      <ElFormItem label="Foreign Key">
        <div class="foreign-key-config">
          <ElCheckbox 
            :model-value="!!columnForm.column.foreignKey"
            @update:model-value="(val: boolean) => columnForm.column.foreignKey = val ? { table: '', column: '', onDelete: 'restrict' } : undefined"
          >
            Is Foreign Key
          </ElCheckbox>
          
          <div v-if="columnForm.column.foreignKey" class="foreign-key-fields">
            <ElInput 
              v-model="columnForm.column.foreignKey.table" 
              placeholder="Referenced table name"
              style="margin-top: 8px;"
            />
            <ElInput 
              v-model="columnForm.column.foreignKey.column" 
              placeholder="Referenced column name"
              style="margin-top: 8px;"
            />
            <ElSelect 
              v-model="columnForm.column.foreignKey.onDelete" 
              placeholder="On Delete Action"
              style="width: 100%; margin-top: 8px;"
            >
              <ElOption 
                v-for="option in cascadeOptions" 
                :key="option.value"
                :label="option.label" 
                :value="option.value"
              />
            </ElSelect>
          </div>
        </div>
      </ElFormItem>
      
      <!-- UI Options -->
      <ElDivider content-position="left">UI Options</ElDivider>
      
      <ElFormItem label="Display Options">
        <div class="checkbox-group">
          <ElCheckbox v-model="columnForm.metadata.is_visible">Visible</ElCheckbox>
          <ElCheckbox v-model="columnForm.metadata.can_sort">Sortable</ElCheckbox>
          <ElCheckbox v-model="columnForm.metadata.can_filter">Filterable</ElCheckbox>
          <ElCheckbox v-model="columnForm.metadata.can_group">Groupable</ElCheckbox>
        </div>
      </ElFormItem>
      
      <ElFormItem label="Display Order">
        <ElInputNumber 
          v-model="columnForm.metadata.display_order" 
          :min="0"
          :max="999"
          placeholder="Display order"
          style="width: 100%"
        />
        <div class="form-help-text">Lower numbers appear first. Leave 0 for automatic ordering.</div>
      </ElFormItem>
    </ElForm>
    
    <template #footer>
      <ElButton @click="close">Cancel</ElButton>
      <ElButton 
        type="primary" 
        @click="saveColumn"
        :loading="isLoading"
      >
        {{ buttonText }}
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
// Checkbox groups for form layouts
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// Foreign key configuration styling
.foreign-key-config {
  .foreign-key-fields {
    padding-left: 24px;
    border-left: 2px solid var(--el-border-color-lighter);
  }
}

// Form help text
.form-help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.4;
  
  &:empty {
    display: none;
  }
}
</style>