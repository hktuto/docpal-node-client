<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { apiClient } from 'api'

interface Props {
  tableName: string
  schema?: any
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'column-updated': [column: any]
  'column-visibility-changed': [column: any, isVisible: boolean]
  'column-deleted': [column: any]
  'refresh-schema': []
}>()

// Reactive data
const isVisible = ref(false)
const isLoading = ref(false)

// Computed properties
const visibleColumns = computed(() => {
  return props.schema?.columns?.filter((col: any) => col.is_visible) || []
})

const hiddenColumns = computed(() => {
  return props.schema?.columns?.filter((col: any) => !col.is_visible) || []
})

// Component methods
function open() {
  if (!props.schema) {
    ElMessage.warning('Please wait for the table schema to load before managing columns')
    return
  }
  isVisible.value = true
}

function close() {
  isVisible.value = false
}

async function toggleColumnVisibility(column: any, newVisibility: boolean) {
  try {
    isLoading.value = true
    
    // Create the updated column data
    const updatedColumnData = {
      column: {
        name: column.column_name,
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
        ...column,
        is_visible: newVisibility
      }
    }
    
    // Use the column update API
    const { success } = await apiClient.companies.postDataSchemaTablenameColumns(
      props.tableName,
      updatedColumnData
    )
    
    if (success) {
      ElNotification.success({
        title: 'Success',
        message: `Column ${newVisibility ? 'shown' : 'hidden'} successfully`,
        duration: 3000
      })
      
      emit('column-visibility-changed', column, newVisibility)
      emit('refresh-schema')
    } else {
      ElMessage.error('Failed to update column visibility. Please try again.')
    }
  } catch (error: any) {
    console.error('Error updating column visibility:', error)
    
    const errorBody = error?.response?.data
    if (errorBody?.message) {
      ElMessage.error(errorBody.message)
    } else {
      ElMessage.error('Failed to update column visibility. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

function bulkToggleColumnVisibility(columns: any[], newVisibility: boolean) {
  columns.forEach(column => {
    if (!column.is_system || newVisibility) { // Allow showing system columns
      toggleColumnVisibility(column, newVisibility)
    }
  })
}

function editColumn(column: any) {
  emit('column-updated', column)
}

async function deleteColumn(column: any) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to ${column.is_system ? 'hide' : 'delete'} column "${column.display_name}"?`,
      `${column.is_system ? 'Hide' : 'Delete'} Column`,
      {
        confirmButtonText: column.is_system ? 'Hide' : 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    if (column.is_system) {
      // For system columns, hide them
      await toggleColumnVisibility(column, false)
    } else {
      // For non-system columns, emit delete event
      emit('column-deleted', column)
    }
  } catch (error: any) {
    if (error === 'cancel') return
    console.error('Error deleting column:', error)
    ElMessage.error('Failed to delete column')
  }
}

// Expose methods for parent component
defineExpose({
  open,
  close
})
</script>

<template>
  <ElDialog 
    v-model="isVisible" 
    title="Manage Columns"
    width="800px"
    destroy-on-close
    @close="close"
  >
    <div v-if="!schema" class="no-schema">
      <ElAlert 
        title="Schema Not Loaded" 
        description="Please ensure the table schema is loaded before managing columns."
        type="warning" 
        show-icon 
        :closable="false"
      />
    </div>
    
    <div v-else class="column-management">
      <!-- Bulk Actions -->
      <div class="bulk-actions">
        <ElButton 
          size="small"
          @click="bulkToggleColumnVisibility(visibleColumns, false)"
          :disabled="isLoading"
        >
          Hide All Visible
        </ElButton>
        <ElButton 
          size="small"
          @click="bulkToggleColumnVisibility(hiddenColumns, true)"
          :disabled="isLoading"
        >
          Show All Hidden
        </ElButton>
      </div>
      
      <!-- Column List -->
      <div class="column-list">
        <ElTable 
          :data="schema.columns" 
          style="width: 100%" 
          stripe
          size="small"
          v-loading="isLoading"
        >
          <ElTableColumn 
            label="Visibility" 
            width="80"
            align="center"
          >
            <template #default="{ row }">
              <ElSwitch 
                :model-value="row.is_visible"
                @update:model-value="(val: boolean) => toggleColumnVisibility(row, val)"
                :disabled="isLoading"
                size="small"
              />
            </template>
          </ElTableColumn>
          
          <ElTableColumn 
            prop="display_name" 
            label="Display Name" 
            min-width="120"
          />
          
          <ElTableColumn 
            prop="column_name" 
            label="Column Name" 
            min-width="120"
          />
          
          <ElTableColumn 
            prop="data_type" 
            label="Data Type" 
            width="100"
          />
          
          <ElTableColumn 
            label="Properties" 
            width="120"
          >
            <template #default="{ row }">
              <div class="column-properties">
                <ElTag v-if="row.is_system" type="info" size="small">System</ElTag>
                <ElTag v-if="row.can_sort" type="success" size="small">Sort</ElTag>
                <ElTag v-if="row.can_filter" type="warning" size="small">Filter</ElTag>
              </div>
            </template>
          </ElTableColumn>
          
          <ElTableColumn 
            label="Order" 
            width="80"
            align="center"
          >
            <template #default="{ row }">
              <span class="display-order">{{ row.display_order || 0 }}</span>
            </template>
          </ElTableColumn>
          
          <ElTableColumn 
            label="Actions" 
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <div class="column-actions">
                <ElButton 
                  size="small" 
                  type="primary" 
                  link
                  @click="editColumn(row)"
                  :disabled="isLoading"
                >
                  Edit
                </ElButton>
                
                <ElButton 
                  v-if="!row.is_system"
                  size="small" 
                  type="danger" 
                  link
                  @click="deleteColumn(row)"
                  :disabled="isLoading"
                >
                  Delete
                </ElButton>
              </div>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      
      <!-- Summary Info -->
      <div class="column-summary">
        <ElDivider />
        <div class="summary-stats">
          <ElStatistic 
            title="Total Columns" 
            :value="schema.columns.length"
          />
          <ElStatistic 
            title="Visible Columns" 
            :value="visibleColumns.length"
          />
          <ElStatistic 
            title="System Columns" 
            :value="schema.columns.filter((c: any) => c.is_system).length"
          />
          <ElStatistic 
            title="Sortable Columns" 
            :value="schema.columns.filter((c: any) => c.can_sort).length"
          />
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="close">
          Close
        </ElButton>
        <ElButton 
          type="primary" 
          @click="emit('refresh-schema')"
          :loading="props.loading || isLoading"
        >
          Refresh Table
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.no-schema {
  padding: 20px 0;
}

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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--app-space-s);
}
</style>