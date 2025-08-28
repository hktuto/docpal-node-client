<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  tableName: string
  schema?: any
  data: any[]
  loading?: boolean
  showActions?: boolean
  showColumnManagement?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnVisibility?: boolean
  customActions?: Array<{
    label: string
    icon?: string
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    onClick: (row: any) => void
  }>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  showColumnManagement: true,
  enableSorting: true,
  enableFiltering: true,
  enableColumnVisibility: true,
  customActions: () => []
})

const emit = defineEmits(['data-changed', 'edit-record', 'delete-record', 'column-updated', 'column-visibility-changed', 'column-deleted'])

// Reactive data
const sorting = ref<any[]>([])
const filtering = ref<any[]>([])
const groups = ref<any[]>([])
const showFilterDialog = ref(false)
const filterForm = ref<any>({})
const filterFormRef = ref<FormInstance>()

// Computed properties
const visibleColumns = computed(() => {
  return props.schema?.columns?.filter((col: any) => col.is_visible || col.column_name === 'id') || []
})

const sortableColumns = computed(() => {
  return props.schema?.columns?.filter((col: any) => col.can_sort) || []
})

const filterableColumns = computed(() => {
  return props.schema?.columns?.filter((col: any) => col.can_filter) || []
})

const hasFilters = computed(() => {
  return filtering.value.length > 0
})

const hasSorts = computed(() => {
  return sorting.value.length > 0
})

const queryObject = computed(() => {
  const select = visibleColumns.value.map((s: any) => s.column_name)
  
  // Convert our sorting format to API format
  const sorts = sorting.value.map(sort => ({
    column: sort.field,
    direction: sort.order as 'asc' | 'desc'
  }))
  
  // Convert our filtering format to API format
  const filters = filtering.value.map(filter => ({
    column: filter.field,
    operator: getApiOperator(filter.operator),
    value: filter.value
  }))
  
  return {
    select,
    sorts,
    filters,
    groups: groups.value
  }
})

// Watch for query changes and emit events
watch(queryObject, (newQuery) => {

  emit('data-changed', newQuery)
}, { deep: true })

// Initialize filter form when schema changes
watch(() => props.schema, (newSchema) => {
  if (newSchema) {
    initializeFilterForm()
  }
}, { immediate: true })

function initializeFilterForm() {
  const form: any = {}
  filterableColumns.value.forEach((col: any) => {
    form[col.column_name] = ''
  })
  filterForm.value = form
}

// Sorting functions
function addSort(column: any) {
  if (!props.enableSorting) return
  
  const existingIndex = sorting.value.findIndex(s => s.field === column.column_name)
  
  if (existingIndex >= 0) {
    // Toggle sort direction
    const currentSort = sorting.value[existingIndex]
    if (currentSort.order === 'asc') {
      currentSort.order = 'desc'
    } else {
      // Remove sort
      sorting.value.splice(existingIndex, 1)
    }
  } else {
    // Add new sort
    sorting.value.push({
      field: column.column_name,
      order: 'asc'
    })
  }
}

function removeSort(index: number) {
  sorting.value.splice(index, 1)
}

function clearSorts() {
  sorting.value = []
}

function getSortIcon(columnName: string) {
  const sort = sorting.value.find(s => s.field === columnName)
  if (!sort) return ''
  return sort.order === 'asc' ? '↑' : '↓'
}

// Filtering functions
function openFilterDialog() {
  if (!props.enableFiltering) return
  showFilterDialog.value = true
}

function applyFilters() {
  const filters: any[] = []
  
  Object.keys(filterForm.value).forEach(key => {
    const value = filterForm.value[key]
    if (value && value.toString().trim()) {
      const column = props.schema.columns.find((col: any) => col.column_name === key)
      if (column) {
        filters.push({
          field: key,
          operator: getDefaultOperator(column.filter_type),
          value: value,
          type: column.filter_type
        })
      }
    }
  })
  
  filtering.value = filters
  showFilterDialog.value = false
}

function getDefaultOperator(filterType: string): 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'not_in' | 'is_null' | 'is_not_null' | 'between' {
  switch (filterType) {
    case 'text': return 'ilike' // Case insensitive LIKE
    case 'number': return 'eq'
    case 'date':
    case 'datetime': return 'eq'
    case 'boolean': return 'eq'
    default: return 'ilike'
  }
}

// Convert our internal operator names to API operator names
function getApiOperator(operator: string): 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'not_in' | 'is_null' | 'is_not_null' | 'between' {
  const operatorMap: Record<string, 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'not_in' | 'is_null' | 'is_not_null' | 'between'> = {
    'contains': 'ilike',
    'equals': 'eq',
    'not_equals': 'ne',
    'greater_than': 'gt',
    'greater_equal': 'gte',
    'less_than': 'lt',
    'less_equal': 'lte',
    'ilike': 'ilike',
    'eq': 'eq',
    'ne': 'ne',
    'gt': 'gt',
    'gte': 'gte',
    'lt': 'lt',
    'lte': 'lte',
    'like': 'like',
    'in': 'in',
    'not_in': 'not_in',
    'is_null': 'is_null',
    'is_not_null': 'is_not_null',
    'between': 'between'
  }
  return operatorMap[operator] || 'ilike'
}

function removeFilter(index: number) {
  filtering.value.splice(index, 1)
}

function clearFilters() {
  filtering.value = []
  filterForm.value = {}
  initializeFilterForm()
}

// Record management functions
function editRecord(record: any) {
  emit('edit-record', record)
}

function deleteRecord(record: any) {
  emit('delete-record', record)
}

// Column management functions
function editColumn(column: any) {
  emit('column-updated', column)
}

function toggleColumnVisibility(column: any, isVisible?: boolean) {
  const newVisibility = isVisible !== undefined ? isVisible : !column.is_visible
  emit('column-visibility-changed', column, newVisibility)
}

function deleteColumn(column: any) {
  emit('column-deleted', column)
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

// Expose methods for parent component
defineExpose({
  clearFilters,
  clearSorts,
  applyFilters,
  getSortIcon,
  queryObject
})
</script>

<template>
  <div class="data-table-wrapper">
    <!-- Filter and Sort Controls -->
    <div v-if="hasFilters || hasSorts" class="active-controls">
      <!-- Active filters display -->
      <div v-if="hasFilters" class="active-filters">
        <span class="filter-label">Active Filters:</span>
        <ElTag 
          v-for="(filter, index) in filtering" 
          :key="index"
          closable
          @close="removeFilter(index)"
          type="warning"
          class="filter-tag"
        >
          {{ filter.field }}: {{ filter.value }}
        </ElTag>
        <ElButton 
          size="small" 
          type="danger" 
          link
          @click="clearFilters"
        >
          Clear All Filters
        </ElButton>
      </div>
      
      <!-- Active sorts display -->
      <div v-if="hasSorts" class="active-sorts">
        <span class="sort-label">Active Sorts:</span>
        <ElTag 
          v-for="(sort, index) in sorting" 
          :key="index"
          closable
          @close="removeSort(index)"
          type="info"
          class="sort-tag"
        >
          {{ sort.field }} {{ sort.order === 'asc' ? '↑' : '↓' }}
        </ElTag>
        <ElButton 
          size="small" 
          type="danger" 
          link
          @click="clearSorts"
        >
          Clear All Sorts
        </ElButton>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <ElTable 
        :data="data" 
        style="width: 100%" 
        stripe
        border
        :empty-text="'No data found'"
        table-layout="auto"
        v-loading="loading"
      >
        <!-- Dynamic columns -->
        <ElTableColumn 
          v-for="column in visibleColumns" 
          :key="column.id"
          :prop="column.column_name"
          :label="column.display_name"
          :min-width="120"
          :sortable="column.can_sort && enableSorting"
          show-overflow-tooltip
        >
          <template #header="{ column: tableColumn }">
            <div class="column-header">
              <span>{{ tableColumn.label }}</span>
              <div class="header-actions" v-if="showColumnManagement">
                <!-- Sort icon -->
                <span 
                  v-if="column.can_sort && enableSorting" 
                  class="sort-icon"
                  :class="{ active: getSortIcon(column.column_name) }"
                  @click.stop="addSort(column)"
                >
                  {{ getSortIcon(column.column_name) || '⇅' }}
                </span>
                
                <!-- Column management -->
                <ElDropdown trigger="click">
                  <span class="column-menu">⋯</span>
                  <template #dropdown>
                    <ElDropdownMenu>
                      <ElDropdownItem @click="editColumn(column)">
                        <span class="dropdown-icon">✏️</span>
                        Edit Column
                      </ElDropdownItem>
                      
                      <ElDropdownItem 
                        v-if="enableColumnVisibility"
                        @click="toggleColumnVisibility(column)"
                        :class="{ 'success': !column.is_visible }"
                      >
                        <span class="dropdown-icon">{{ column.is_visible ? '👁️' : '👁️‍🗨️' }}</span>
                        {{ column.is_visible ? 'Hide Column' : 'Show Column' }}
                      </ElDropdownItem>
                      
                      <ElDropdownItem 
                        v-if="!column.is_system"
                        @click="deleteColumn(column)"
                        class="danger"
                      >
                        <span class="dropdown-icon">🗑️</span>
                        Delete Column
                      </ElDropdownItem>
                    </ElDropdownMenu>
                  </template>
                </ElDropdown>
              </div>
            </div>
          </template>
          
          <template #default="{ row }">
            <span>{{ formatCellValue(row[column.column_name], column) }}</span>
          </template>
        </ElTableColumn>
        
        <!-- Actions column -->
        <ElTableColumn 
          v-if="showActions || customActions.length > 0"
          label="Actions" 
          :width="showActions ? 140 : 80 + (customActions.length * 60)" 
          fixed="right"
        >
          <template #default="{ row }">
            <div class="action-buttons">
              <!-- Default actions -->
              <template v-if="showActions">
                <ElButton 
                  size="small" 
                  type="primary" 
                  link
                  @click="editRecord(row)"
                  :disabled="loading"
                >
                  <template #icon>
                    <span>✏️</span>
                  </template>
                  Edit
                </ElButton>
                <ElButton 
                  size="small" 
                  type="danger" 
                  link
                  @click="deleteRecord(row)"
                  :disabled="loading"
                >
                  <template #icon>
                    <span>🗑️</span>
                  </template>
                  Delete
                </ElButton>
              </template>
              
              <!-- Custom actions -->
              <ElButton 
                v-for="action in customActions"
                :key="action.label"
                size="small" 
                :type="action.type || 'default'" 
                link
                @click="action.onClick(row)"
                :disabled="loading"
              >
                <template v-if="action.icon" #icon>
                  <span>{{ action.icon }}</span>
                </template>
                {{ action.label }}
              </ElButton>
            </div>
          </template>
        </ElTableColumn>
        
        <!-- Empty state -->
        <template #empty>
          <ElEmpty description="No data found" />
        </template>
      </ElTable>
    </div>

    <!-- Filter Dialog -->
    <ElDialog 
      v-model="showFilterDialog" 
      title="Filter Data"
      width="600px"
      destroy-on-close
    >
      <ElForm 
        ref="filterFormRef"
        :model="filterForm"
        label-width="120px"
      >
        <ElFormItem 
          v-for="column in filterableColumns" 
          :key="column.id"
          :label="column.display_name"
        >
          <ElInput 
            v-if="column.filter_type === 'text'"
            v-model="filterForm[column.column_name]"
            :placeholder="`Filter by ${column.display_name}`"
          />
          
          <ElInputNumber 
            v-else-if="column.filter_type === 'number'"
            v-model="filterForm[column.column_name]"
            :placeholder="`Filter by ${column.display_name}`"
            style="width: 100%"
          />
          
          <ElDatePicker 
            v-else-if="column.filter_type === 'date'"
            v-model="filterForm[column.column_name]"
            type="date"
            :placeholder="`Filter by ${column.display_name}`"
            style="width: 100%"
          />
          
          <ElDatePicker 
            v-else-if="column.filter_type === 'datetime'"
            v-model="filterForm[column.column_name]"
            type="datetime"
            :placeholder="`Filter by ${column.display_name}`"
            style="width: 100%"
          />
          
          <ElSelect 
            v-else-if="column.filter_type === 'boolean'"
            v-model="filterForm[column.column_name]"
            :placeholder="`Filter by ${column.display_name}`"
            clearable
            style="width: 100%"
          >
            <ElOption label="Yes" :value="true" />
            <ElOption label="No" :value="false" />
          </ElSelect>
          
          <ElInput 
            v-else
            v-model="filterForm[column.column_name]"
            :placeholder="`Filter by ${column.display_name}`"
          />
        </ElFormItem>
      </ElForm>
      
      <template #footer>
        <ElButton @click="clearFilters">Clear All</ElButton>
        <ElButton @click="showFilterDialog = false">Cancel</ElButton>
        <ElButton type="primary" @click="applyFilters">
          Apply Filters
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.data-table-wrapper {
  .active-controls {
    margin-bottom: 16px;
    
    .active-filters, .active-sorts {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      
      .filter-label, .sort-label {
        font-weight: 500;
        color: var(--el-text-color-regular);
      }
      
      .filter-tag, .sort-tag {
        margin-right: 4px;
      }
    }
  }
  
  .table-container {
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
        
        .sort-icon {
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 2px;
          transition: all 0.2s;
          
          &:hover {
            background-color: var(--el-fill-color-light);
          }
          
          &.active {
            color: var(--el-color-primary);
            font-weight: bold;
          }
        }
        
        .column-menu {
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 2px;
          transition: all 0.2s;
          
          &:hover {
            background-color: var(--el-fill-color-light);
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  }
}

.dropdown-icon {
  margin-right: 6px;
  font-size: 14px;
}

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