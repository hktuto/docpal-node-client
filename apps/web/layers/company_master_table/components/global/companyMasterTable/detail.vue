<script lang="ts" setup>
import { apiClient } from 'api'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import NewDataDialog from './newDataDialog.vue'
import { DataViewTable } from '#components'
import TableControls from './TableControls.vue'

const props = defineProps<{
  tableName: string
}>()

// Reactive data
const schema = ref<any>(null)
const list = ref<any[]>([])
const pageSetting = ref({
  page: 1,
  pageSize: 10,
  includeVirtualColumns: true,
})

const isLoading = ref(false)
const showEditRecordDialog = ref(false)
const editingRecord = ref<any>(null)
const editRecordForm = ref<any>({})

// Form refs
const editRecordFormRef = ref<FormInstance>()
const newDataDialogRef = ref<InstanceType<typeof NewDataDialog>>()
const dataTableRef = ref<InstanceType<typeof DataViewTable>>()

// Form validation rules

// Edit record validation rules
const editRecordRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  
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

// Edit record validation rules
const visibleColumns = computed(() => {
  return schema.value?.columns?.filter((col: any) => col.is_visible || col.column_name === 'id') || []
})

const editableColumnsForRecord = computed(() => {
  if (!schema.value?.columns) return []
  return schema.value.columns.filter((col: any) => 
    col.is_visible && !col.is_system
    // Allow created_by to be editable for admin purposes
  )
})

async function getData() {
  if (!schema.value?.tableName) return
  
  // Get the query from DataTable component if available
  const query = dataTableRef.value?.queryObject || {
    select: schema.value.columns?.filter((col: any) => col.is_visible || col.column_name === 'id').map((col: any) => col.column_name) || [],
    sorts: [],
    filters: [],
    groups: [],
    ...pageSetting.value
  }
  console.log("query", query)
  await fetchDataWithQuery(query)
}

async function getSchema() {
  try {
    isLoading.value = true
    const { data, success } = await apiClient.companies.getDataRecordsTablenameMetadata(props.tableName)
    
    if (success && data) {
      schema.value = data
      await getData()
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

// Record management functions
function handleCreateNew() {
  if (!schema.value) {
    ElMessage.warning('Please wait for the table schema to load before adding records')
    return
  }
  newDataDialogRef.value?.open()
}

function handleNewDataSuccess(newRecord: any) {
  // Refresh data after successful record creation
  getData()
  ElMessage.success('Record added successfully')
}

// Event handlers for DataTable component
function handleDataChanged(query: any) {
  // Update pagination settings with the new query
  const updatedQuery = {
    ...query,
    ...pageSetting.value
  }
  
  // Make API call with the updated query
  fetchDataWithQuery(updatedQuery)
}

async function fetchDataWithQuery(query: any) {
  if (!schema.value?.tableName) return
  
  try {
    isLoading.value = true
    const { data, success } = await apiClient.companies.postDataRecordsTablenameQuerytable(
      schema.value.tableName,
      query
    )
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

function editRecord(record: any) {
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

async function saveEditRecord() {
  if (!editRecordFormRef.value || !editingRecord.value) return
  
  try {
    // Validate form
    const isValid = await editRecordFormRef.value.validate()
    if (!isValid) return
    
    isLoading.value = true
    
    // Prepare data for submission - only send changed fields
    const submitData = { ...editRecordForm.value }
    
    // Process data based on column types
    editableColumnsForRecord.value.forEach((column: any) => {
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
      }
    })
    
    // Make API call to update the record
    const { success, data } = await apiClient.companies.putDataRecordsTablenameRecordsRecordid(
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
      
      // Refresh the data to show updated record
      await getData()
    } else {
      ElMessage.error('Failed to update record. Please check your data and try again.')
    }
  } catch (error: any) {
    console.error('Error updating record:', error)
    
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
      ElMessage.error(error.message || 'Failed to update record. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

function handleEditRecordClose() {
  showEditRecordDialog.value = false
  editingRecord.value = null
  editRecordForm.value = {}
  editRecordFormRef.value?.clearValidate()
}

async function deleteRecord(record: any) {
  if (!record || !record.id) {
    ElMessage.error('Invalid record selected for deletion')
    return
  }
  
  try {
    // Show confirmation dialog
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
    
    // Make API call to delete the record
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
      
      // Refresh the data to remove deleted record
      await getData()
    } else {
      ElMessage.error('Failed to delete record. Please try again.')
    }
  } catch (error: any) {
    if (error === 'cancel') {
      // User cancelled the operation
      return
    }
    
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

// Utility functions
function formatCellValue(value: any, column: any): string {
  if (value == null || value === '') return '-'
  
  switch (column.data_type) {
    case 'datetime':
    case 'timestamp':
      return new Date(value).toLocaleString()
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'json':
      return typeof value === 'object' ? JSON.stringify(value) : value
    default:
      return value.toString()
  }
}

onMounted(async () => {
  await getSchema()
})
</script>


<template>
  <AppPageContainer>
    <!-- Table Controls -->
    <TableControls 
      :table-name="tableName"
      :schema="schema"
      :record-count="list.length"
      :loading="isLoading"
      :has-filters="dataTableRef?.queryObject?.filters?.length > 0"
      :filter-count="dataTableRef?.queryObject?.filters?.length || 0"
      :enable-column-management="false"
      @create-record="handleCreateNew"
      @open-filter="dataTableRef?.openFilterDialog"
      @refresh="getData"
    />
    
    <!-- Data Table -->
    <DataViewTable 
      ref="dataTableRef"
      :table-name="tableName"
      :schema="schema"
      :data="list"
      :loading="isLoading"
      @data-changed="handleDataChanged"
      @edit-record="editRecord"
      @delete-record="deleteRecord"
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
        <!-- Dynamic form based on schema -->
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
      @submit="getData"
    />
  </AppPageContainer>
</template>

<style lang="scss" scoped>
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

// Column management dialog styling
.column-management {
  .bulk-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    background-color: var(--el-fill-color-extra-light);
    border-radius: 8px;
  }
  
  .column-list {
    margin-bottom: 16px;
    
    .column-properties {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    
    .column-actions {
      display: flex;
      gap: 8px;
    }
    
    .display-order {
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }
  
  .column-summary {
    .summary-stats {
      display: flex;
      justify-content: space-around;
      gap: 16px;
      
      :deep(.el-statistic) {
        text-align: center;
        
        .el-statistic__head {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
        
        .el-statistic__content {
          font-size: 20px;
          font-weight: 600;
          color: var(--el-color-primary);
        }
      }
    }
  }
}

// Dialog and alert styling
.no-record,
.no-columns,
.no-schema {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--app-space-s);
}

// Dropdown icon styling
.dropdown-icon {
  margin-right: 6px;
  font-size: 14px;
}

// Dropdown menu item color coding
:deep(.el-dropdown-menu__item.danger) {
  color: var(--el-color-danger);
}

:deep(.el-dropdown-menu__item.warning) {
  color: var(--el-color-warning);
}

:deep(.el-dropdown-menu__item.success) {
  color: var(--el-color-success);
}

:deep(.el-dropdown-menu__item) {
  .dropdown-icon {
    margin-right: 8px;
    width: 16px;
    display: inline-block;
  }
}
</style>