<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  tableName?: string
  schema?: any
  recordCount?: number
  loading?: boolean
  hasFilters?: boolean
  filterCount?: number
  enableCreate?: boolean
  enableColumnManagement?: boolean
  enableFilter?: boolean
  customActions?: Array<{
    label: string
    icon?: string
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
    onClick: () => void
    disabled?: boolean
  }>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasFilters: false,
  filterCount: 0,
  enableCreate: true,
  enableColumnManagement: true,
  enableFilter: true,
  customActions: () => []
})

const emit = defineEmits(['create-record', 'add-column', 'manage-columns', 'open-filter', 'refresh'])

const filterButtonType = computed(() => {
  return props.hasFilters ? 'warning' : 'default'
})

const filterButtonText = computed(() => {
  const baseText = 'Filter'
  return props.hasFilters ? `${baseText} (${props.filterCount})` : baseText
})

function handleCreateRecord() {
  emit('create-record')
}

function handleAddColumn() {
  emit('add-column')
}

function handleManageColumns() {
  emit('manage-columns')
}

function handleOpenFilter() {
  emit('open-filter')
}

function handleRefresh() {
  emit('refresh')
}
</script>

<template>
  <div class="table-controls">
    <div class="table-info">
      <h2 v-if="schema">{{ schema.tableName || tableName }}</h2>
      <span v-if="recordCount && recordCount > 0" class="record-count">
        {{ recordCount }} records
      </span>
    </div>
    
    <div class="controls-actions">
      <!-- Create Record Button -->
      <ElButton 
        v-if="enableCreate"
        type="success"
        @click="handleCreateRecord"
        :disabled="!schema || loading"
        :loading="loading"
      >
        <template #icon>
          <span>➕</span>
        </template>
        Add New Record
      </ElButton>
      
      <!-- Add Column Button -->
      <ElButton 
        v-if="enableColumnManagement"
        type="primary" 
        @click="handleAddColumn"
        :loading="loading"
      >
        <template #icon>
          <span>📋</span>
        </template>
        Add Column
      </ElButton>
      
      <!-- Manage Columns Button -->
      <ElButton 
        v-if="enableColumnManagement"
        type="info" 
        @click="handleManageColumns"
        :loading="loading"
      >
        <template #icon>
          <span>⚙️</span>
        </template>
        Manage Columns
      </ElButton>
      
      <!-- Filter Button -->
      <ElButton 
        v-if="enableFilter"
        @click="handleOpenFilter"
        :type="filterButtonType"
      >
        <template #icon>
          <span>🔍</span>
        </template>
        {{ filterButtonText }}
      </ElButton>
      
      <!-- Custom Actions -->
      <ElButton 
        v-for="action in customActions"
        :key="action.label"
        :type="action.type || 'default'"
        @click="action.onClick"
        :disabled="action.disabled || loading"
        :loading="loading && action.disabled"
      >
        <template v-if="action.icon" #icon>
          <span>{{ action.icon }}</span>
        </template>
        {{ action.label }}
      </ElButton>
      
      <!-- Refresh Button -->
      <ElButton 
        @click="handleRefresh"
        :loading="loading"
      >
        <template #icon>
          <span>🔄</span>
        </template>
        Refresh
      </ElButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .table-info {
    h2 {
      margin: 0;
      color: var(--el-text-color-primary);
    }
    
    .record-count {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }
  
  .controls-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    
    .el-button {
      &:first-child {
        font-weight: 500;
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    
    .controls-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
}
</style>