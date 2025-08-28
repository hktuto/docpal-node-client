<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { apiClient } from 'api'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { DataViewTable } from '#components'
import TableControls from './TableControls.vue'
import NewDataDialog from './newDataDialog.vue'
import ColumnManagement from './column/Management.vue'
import ColumnUpsert from './column/Upsert.vue'

interface Props {
  tableName: string
  viewType?: 'table' | 'kanban' | 'calendar' | 'gantt'
  customFilters?: any[]
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  viewType: 'table',
  customFilters: () => [],
  readOnly: false
})

// Reactive data
const schema = ref<any>(null)
const list = ref<any[]>([])
const isLoading = ref(false)
const showEditRecordDialog = ref(false)
const editingRecord = ref<any>(null)
const editRecordForm = ref<any>({})

const pageSetting = ref({
  page: 1,
  pageSize: 10,
  includeVirtualColumns: true,
})

// Component refs
const dataTableRef = ref<InstanceType<typeof DataViewTable>>()
const newDataDialogRef = ref<InstanceType<typeof NewDataDialog>>()
const columnManagementRef = ref<InstanceType<typeof ColumnManagement>>()
const columnUpsertRef = ref<InstanceType<typeof ColumnUpsert>>()
const editRecordFormRef = ref<FormInstance>()

// Computed properties
const editableColumnsForRecord = computed(() => {
  if (!schema.value?.columns) return []
  return schema.value.columns.filter((col: any) => 
    col.is_visible && 
    col.column_name !== 'id' &&
    col.column_name !== 'created_at' &&
    col.column_name !== 'updated_at'
  )
})

// Edit record validation rules
const editRecordRules = computed(() => {
  const rules: any = {}
  
  if (!editableColumnsForRecord.value) return rules
  
  editableColumnsForRecord.value.forEach((column: any) => {
    const fieldRules: any[] = []
    
    // Required field validation
    if (!column.is_nullable && !column.default_value) {
      fieldRules.push({
        required: true,
        message: `${column.display_name} is required`,
        trigger: 'blur'
      })
    }
    
    // Type-specific validation
    switch (column.data_type) {
      case 'email':
        fieldRules.push({
          type: 'email',
          message: 'Please enter a valid email address',
          trigger: 'blur'
        })
        break
      case 'number':
      case 'integer':
        fieldRules.push({
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
    }
    
    if (fieldRules.length > 0) {
      rules[column.column_name] = fieldRules
    }
  })
  
  return rules
})

// Data fetching methods
async function fetchData(query: any) {
  if (!schema.value?.tableName) return
  
  try {
    isLoading.value = true
    
    // Merge with custom filters
    const mergedQuery = {
      ...query,
      filters: [...(query.filters || []), ...props.customFilters],
      ...pageSetting.value
    }
    
    // Choose API endpoint based on view type
    let apiCall: Promise<any>
    switch (props.viewType) {
      case 'kanban':
        apiCall = apiClient.companies.postDataRecordsTablenameQuerykanban(
          schema.value.tableName,
          mergedQuery
        )
        break
      case 'calendar':
        apiCall = apiClient.companies.postDataRecordsTablenameQuerycalendar(
          schema.value.tableName,
          mergedQuery
        )
        break
      case 'gantt':
        apiCall = apiClient.companies.postDataRecordsTablenameQuerygantt(
          schema.value.tableName,
          mergedQuery
        )
        break
      default:
        apiCall = apiClient.companies.postDataRecordsTablenameQuerytable(
          schema.value.tableName,
          mergedQuery
        )
    }
    
    const { data, success } = await apiCall
    if (success && data) {
      list.value = Array.isArray(data) ? data : data.records || []
    } else {
      list.value = []
      ElMessage.error('Failed to load data')
    }
  } catch (error: any) {
    console.error('Error loading data:', error)
    list.value = []
    ElMessage.error('Failed to load data')
  } finally {
    isLoading.value = false
  }
}

async function loadSchema() {
  try {
    isLoading.value = true
    const { data, success } = await apiClient.companies.getDataRecordsTablenameMetadata(props.tableName)
    
    if (success && data) {
      schema.value = data
      
      // Initial data load
      const initialQuery = {
        select: data.columns?.filter((col: any) => col.is_visible).map((col: any) => col.column_name) || [],
        sorts: [],
        filters: [],
        groups: []
      }
      
      await fetchData(initialQuery)
    } else {
      ElMessage.error('Failed to load table schema')
    }
  } catch (error: any) {
    console.error('Error loading schema:', error)
    ElMessage.error('Failed to load table schema')
  } finally {
    isLoading.value = false
  }
}

// Event handlers
function handleDataChanged(query: any) {
  fetchData(query)
}

function handleCreateNew() {
  if (!schema.value) {
    ElMessage.warning('Please wait for the table schema to load before adding records')
    return
  }
  if (props.readOnly) {
    ElMessage.warning('This view is read-only')
    return
  }
  newDataDialogRef.value?.open()
}

function handleNewDataSuccess() {
  loadSchema()
}

function handleAddColumn() {
  if (props.readOnly) {
    ElMessage.warning('This view is read-only')
    return
  }
  columnUpsertRef.value?.openForAdd()
}

function handleManageColumns() {
  columnManagementRef.value?.open()
}

function handleEditRecord(record: any) {
  if (props.readOnly) {
    ElMessage.warning('This view is read-only')
    return
  }
  
  if (!record || !record.id) {
    ElMessage.error('Invalid record selected for editing')
    return
  }
  
  // Initialize edit form with current record data
  editingRecord.value = record
  editRecordForm.value = { ...record }
  
  // Filter out system fields and ensure we only edit allowed columns
  const filteredForm: Record<string, any> = {}
  editableColumnsForRecord.value.forEach((column: any) => {
    filteredForm[column.column_name] = record[column.column_name] || ''
  })
  editRecordForm.value = filteredForm
  
  showEditRecordDialog.value = true
}

async function handleDeleteRecord(record: any) {
  if (props.readOnly) {
    ElMessage.warning('This view is read-only')
    return
  }
  
  if (!record || !record.id) {
    ElMessage.error('Invalid record selected for deletion')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete this record? This action cannot be undone.`,
      'Delete Record',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    isLoading.value = true
    
    const { success } = await apiClient.companies.deleteDataRecordsTablenameRecordsRecordid(
      props.tableName,
      record.id
    )
    
    if (success) {
      ElNotification.success({
        title: 'Success',
        message: 'Record deleted successfully',
        duration: 3000
      })
      
      await loadSchema()
    } else {
      ElMessage.error('Failed to delete record. Please try again.')
    }
  } catch (error: any) {
    if (error === 'cancel') return
    
    console.error('Error deleting record:', error)
    
    const errorBody = error?.response?.data
    if (errorBody?.message) {
      ElMessage.error(errorBody.message)
    } else {
      ElMessage.error(error.message || 'Failed to delete record. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

function handleColumnUpdated(column: any) {
  if (props.readOnly) {
    ElMessage.warning('This view is read-only')
    return
  }
  columnUpsertRef.value?.openForEdit(column)
}

function handleColumnVisibilityChanged() {
  // Refresh schema when column visibility changes
  loadSchema()
}

async function handleColumnDeleted(column: any) {
  if (props.readOnly) {
    ElMessage.warning('This view is read-only')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete column "${column.display_name}"?`,
      'Delete Column',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    ElMessage.warning('Column deletion API endpoint is not yet implemented. Please contact your administrator.')
    
    if (process.env.NODE_ENV === 'development') {
      ElNotification.info({
        title: 'Development Mode',
        message: 'Column would be deleted',
        duration: 3000
      })
    }
  } catch (error: any) {
    if (error === 'cancel') return
    console.error('Error deleting column:', error)
    ElMessage.error('Failed to delete column')
  }
}

function handleEditRecordClose() {
  showEditRecordDialog.value = false
  editingRecord.value = null
  editRecordForm.value = {}
  editRecordFormRef.value?.clearValidate()
}

async function saveEditRecord() {
  if (!editRecordFormRef.value || !editingRecord.value) return
  
  try {
    const isValid = await editRecordFormRef.value.validate()
    if (!isValid) return
    
    isLoading.value = true
    
    const submitData = { ...editRecordForm.value }
    
    // Process data based on column types
    editableColumnsForRecord.value.forEach((column: any) => {
      const value = submitData[column.column_name]
      
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
      }
    })
    
    const { success } = await apiClient.companies.putDataRecordsTablenameRecordsRecordid(
      props.tableName,
      editingRecord.value.id,
      submitData
    )
    
    if (success) {
      ElNotification.success({
        title: 'Success',
        message: 'Record updated successfully',
        duration: 3000
      })
      
      showEditRecordDialog.value = false
      editingRecord.value = null
      
      await loadSchema()
    } else {
      ElMessage.error('Failed to update record. Please check your data and try again.')
    }
  } catch (error: any) {
    console.error('Error updating record:', error)
    
    const errorBody = error?.response?.data
    if (errorBody?.message) {
      ElMessage.error(errorBody.message)
    } else if (errorBody?.errors) {
      const errors = Object.entries(errorBody.errors)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
        .join('; ')
      ElMessage.error(`Validation errors: ${errors}`)
    } else {
      ElMessage.error(error.message || 'Failed to update record. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

// Utility functions for edit record form
function getEditInputComponent(column: any) {
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
      return 'textarea'
    default:
      return 'input'
  }
}

function getEditPlaceholder(column: any): string {
  switch (column.data_type) {
    case 'email':
      return 'Enter email address'
    case 'url':
      return 'Enter URL (e.g., https://example.com)'
    case 'json':
      return 'Enter JSON object (e.g., {"key": "value"})'
    case 'date':
      return 'Select date'
    case 'datetime':
    case 'timestamp':
      return 'Select date and time'
    default:
      return `Enter ${column.display_name.toLowerCase()}`
  }
}

// Custom actions based on view type
const customActions = computed(() => {
  const actions: any[] = []
  
  if (props.readOnly) return actions
  
  switch (props.viewType) {
    case 'kanban':
      actions.push({
        label: 'Move to Stage',
        icon: '📋',
        type: 'info',
        onClick: (row: any) => {
          console.log('Move to stage:', row)
        }
      })
      break
    case 'calendar':
      actions.push({
        label: 'Schedule',
        icon: '📅',
        type: 'warning',
        onClick: (row: any) => {
          console.log('Schedule:', row)
        }
      })
      break
    case 'gantt':
      actions.push({
        label: 'Dependencies',
        icon: '🔗',
        type: 'info',
        onClick: (row: any) => {
          console.log('Manage dependencies:', row)
        }
      })
      break
  }
  
  return actions
})

// Load schema on mount
onMounted(() => {
  loadSchema()
})
</script>

<template>
  <div class="data-view">
    <!-- Table Controls -->
    <TableControls 
      :table-name="`${tableName} (${viewType.toUpperCase()})`"
      :schema="schema"
      :record-count="list.length"
      :loading="isLoading"
      :enable-create="!readOnly"
      :enable-column-management="!readOnly"
      @create-record="handleCreateNew"
      @add-column="handleAddColumn"
      @manage-columns="handleManageColumns"
      @open-filter="dataTableRef?.openFilterDialog"
      @refresh="loadSchema"
    />
    
    <!-- Data Table -->
    <DataViewTable 
      ref="dataTableRef"
      :table-name="tableName"
      :schema="schema"
      :data="list"
      :loading="isLoading"
      :show-actions="!readOnly"
      :enable-column-visibility="true"
      :custom-actions="customActions"
      @data-changed="handleDataChanged"
      @edit-record="handleEditRecord"
      @delete-record="handleDeleteRecord"
      @column-updated="handleColumnUpdated"
      @column-visibility-changed="handleColumnVisibilityChanged"
      @column-deleted="handleColumnDeleted"
    />

    <!-- Edit Record Dialog -->
    <ElDialog 
      v-model="showEditRecordDialog" 
      :title="`Edit Record - ${schema?.tableName || tableName}`"
      width="600px"
      destroy-on-close
      @close="handleEditRecordClose"
    >
      <div v-if="!editingRecord" class="no-record">
        <ElAlert 
          title="No Record Selected" 
          description="Please select a record to edit."
          type="warning" 
          show-icon 
          :closable="false"
        />
      </div>
      
      <div v-else-if="editableColumnsForRecord.length === 0" class="no-columns">
        <ElAlert 
          title="No Editable Columns" 
          description="This record has no columns that can be edited."
          type="info" 
          show-icon 
          :closable="false"
        />
      </div>
      
      <div v-else class="edit-record-form">
        <ElForm 
          ref="editRecordFormRef"
          :model="editRecordForm" 
          :rules="editRecordRules"
          label-width="140px"
          label-position="top"
          @submit.prevent="saveEditRecord"
        >
          <ElFormItem 
            v-for="column in editableColumnsForRecord" 
            :key="column.id"
            :label="column.display_name"
            :prop="column.column_name"
            :required="!column.is_nullable && !column.default_value"
          >
            <!-- Text Input -->
            <ElInput 
              v-if="getEditInputComponent(column) === 'input'"
              v-model="editRecordForm[column.column_name]"
              :placeholder="getEditPlaceholder(column)"
              :maxlength="column.max_length"
              clearable
            />
            
            <!-- Textarea -->
            <ElInput 
              v-else-if="getEditInputComponent(column) === 'textarea'"
              v-model="editRecordForm[column.column_name]"
              type="textarea"
              :placeholder="getEditPlaceholder(column)"
              :rows="4"
              :maxlength="column.max_length"
              show-word-limit
            />
            
            <!-- Number Input -->
            <ElInputNumber 
              v-else-if="getEditInputComponent(column) === 'number'"
              v-model="editRecordForm[column.column_name]"
              :placeholder="getEditPlaceholder(column)"
              :min="column.min_value"
              :max="column.max_value"
              :precision="column.data_type === 'integer' ? 0 : 2"
              style="width: 100%"
            />
            
            <!-- Boolean Switch -->
            <ElSwitch 
              v-else-if="getEditInputComponent(column) === 'switch'"
              v-model="editRecordForm[column.column_name]"
              :active-text="'Yes'"
              :inactive-text="'No'"
            />
            
            <!-- Date Picker -->
            <ElDatePicker 
              v-else-if="getEditInputComponent(column) === 'date'"
              v-model="editRecordForm[column.column_name]"
              type="date"
              :placeholder="getEditPlaceholder(column)"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
            
            <!-- DateTime Picker -->
            <ElDatePicker 
              v-else-if="getEditInputComponent(column) === 'datetime'"
              v-model="editRecordForm[column.column_name]"
              type="datetime"
              :placeholder="getEditPlaceholder(column)"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            
            <!-- Default Input -->
            <ElInput 
              v-else
              v-model="editRecordForm[column.column_name]"
              :placeholder="getEditPlaceholder(column)"
              :maxlength="column.max_length"
              clearable
            />
            
            <!-- Help text -->
            <div v-if="column.description" class="form-help-text">
              {{ column.description }}
            </div>
          </ElFormItem>
        </ElForm>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="handleEditRecordClose" :disabled="isLoading">
            Cancel
          </ElButton>
          <ElButton 
            type="primary" 
            @click="saveEditRecord"
            :loading="isLoading"
            :disabled="!editingRecord || editableColumnsForRecord.length === 0"
          >
            {{ isLoading ? 'Updating...' : 'Update Record' }}
          </ElButton>
        </div>
      </template>
    </ElDialog>
    
    <!-- New Data Dialog -->
    <NewDataDialog 
      ref="newDataDialogRef"
      :table-name="tableName"
      :schema="schema"
      @success="handleNewDataSuccess"
      @submit="loadSchema"
    />
    
    <!-- Column Management Dialog -->
    <ColumnManagement
      ref="columnManagementRef"
      :table-name="tableName"
      :schema="schema"
      :loading="isLoading"
      @column-updated="handleColumnUpdated"
      @column-visibility-changed="handleColumnVisibilityChanged"
      @column-deleted="handleColumnDeleted"
      @refresh-schema="loadSchema"
    />
    
    <!-- Column Upsert Dialog -->
    <ColumnUpsert
      ref="columnUpsertRef"
      :table-name="tableName"
      :schema="schema"
      :loading="isLoading"
      @column-saved="loadSchema"
      @refresh-schema="loadSchema"
    />
    
    <!-- View Type Badge -->
    <div class="view-badge">
      <ElTag :type="readOnly ? 'info' : 'primary'" size="small">
        {{ viewType.toUpperCase() }} {{ readOnly ? '(Read-only)' : '' }}
      </ElTag>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-view {
  position: relative;
  
  .view-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
}

// Edit record form styling
.edit-record-form {
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

// Dialog and alert styling
.no-record,
.no-columns {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--app-space-s);
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