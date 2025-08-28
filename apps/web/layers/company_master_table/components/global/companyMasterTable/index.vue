
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { apiClient } from 'api'
import NewDialog from '../../companyMasterTable/newDialog.vue'

const routerProvider = inject<any>(MenuRouterKey)

const list = ref<any>([])
const isLoading = ref(false)
const newDialogRef = ref<InstanceType<typeof NewDialog>>()

async function getAllMasterTable() {
  try {
    isLoading.value = true
    const { data, success } = await apiClient.companies.getDataSchema()
    if (success && data) {
      list.value = data
    } else {
      list.value = []
      ElMessage.error('Failed to load data schemas')
    }
  } catch (error: any) {
    console.error('Error loading master tables:', error)
    list.value = []
    ElMessage.error('Failed to load data schemas')
  } finally {
    isLoading.value = false
  }
}

function cardClickHandler(item:any) {
  routerProvider.navigateTo({
     name: 'master_table_detail',
    label: "master_table_detail " + item.table_name,
    component: 'LazyCompanyMasterTableDetail',
    props: {
      tableName: item.table_name
    }
  })
}

function handleCreateNew() {
  newDialogRef.value?.open()
}

function handleDialogSubmit() {
  // Refresh the list after successful creation
  getAllMasterTable()
}

onMounted(() => {
  getAllMasterTable()
})
</script>


<template>
  <AppPageContainer>
    <div class="company-master-table">
      <div class="header">
        <div class="header__title">
          <h1>Data Schema Management</h1>
          <p class="header__subtitle">Manage your custom data schemas and table structures</p>
        </div>
        <div class="header__actions">
          <ElButton 
            type="primary" 
            :icon="'Plus'"
            @click="handleCreateNew"
          >
            Create New Schema
          </ElButton>
        </div>
      </div>
      
      <div class="content">
        <div v-if="isLoading" class="loading-state">
          <ElSkeleton :rows="5" animated />
        </div>
        
        <div v-else-if="list.length === 0" class="empty-state">
          <div class="empty-state__content">
            <ElEmpty description="No data schemas found">
              <ElButton type="primary" @click="handleCreateNew">
                Create Your First Schema
              </ElButton>
            </ElEmpty>
          </div>
        </div>
        
        <div v-else class="data-list">
          <div class="data-list__header">
            <h3>Existing Data Schemas ({{ list.length }})</h3>
          </div>
          <div class="schema-grid">
            <div 
              v-for="schema in list" 
              :key="schema.id || schema.table_name"
              class="schema-card"
              @click="cardClickHandler(schema)"
            >
              <div class="schema-card__header">
                <h4 class="schema-card__title">{{ schema.display_name || schema.table_name }}</h4>
                <div class="schema-card__meta">
                  <ElTag :type="schema.is_active ? 'success' : 'info'" size="small">
                    {{ schema.is_active ? 'Active' : 'Inactive' }}
                  </ElTag>
                </div>
              </div>
              <div class="schema-card__body">
                <p class="schema-card__table-name">
                  <strong>Table:</strong> {{ schema.table_name }}
                </p>
                <p v-if="schema.description" class="schema-card__description">
                  {{ schema.description }}
                </p>
                <p class="schema-card__dates">
                  <small>
                    <strong>Created:</strong> {{ new Date(schema.created_at).toLocaleDateString() }}
                    <br>
                    <strong>Updated:</strong> {{ new Date(schema.updated_at).toLocaleDateString() }}
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- New Schema Dialog -->
    <NewDialog 
      ref="newDialogRef"
      @submit="handleDialogSubmit"
    />
  </AppPageContainer>
</template>

<style scoped lang="scss">
.company-master-table {
  &__header {
    margin-bottom: var(--app-space-l);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--app-space-l);
  
  &__title {
    flex: 1;
    
    h1 {
      margin: 0 0 var(--app-space-xs) 0;
      color: var(--el-text-color-primary);
      font-size: 24px;
      font-weight: 600;
    }
  }
  
  &__subtitle {
    margin: 0;
    color: var(--el-text-color-regular);
    font-size: 14px;
    line-height: 1.5;
  }
  
  &__actions {
    flex-shrink: 0;
    margin-left: var(--app-space-m);
  }
}

.content {
  min-height: 400px;
}

.loading-state {
  margin-top: var(--app-space-m);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  
  &__content {
    text-align: center;
  }
}

.data-list {
  &__header {
    margin-bottom: var(--app-space-m);
    
    h3 {
      margin: 0;
      color: var(--el-text-color-primary);
      font-size: 18px;
      font-weight: 500;
    }
  }
}

.schema-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--app-space-m);
}

.schema-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: var(--app-space-m);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--el-box-shadow-light);
    border-color: var(--el-color-primary-light-7);
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--app-space-s);
  }
  
  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    line-height: 1.4;
    flex: 1;
    margin-right: var(--app-space-s);
  }
  
  &__meta {
    flex-shrink: 0;
  }
  
  &__body {
    p {
      margin: 0 0 var(--app-space-xs) 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  &__table-name {
    color: var(--el-text-color-regular);
    font-size: 14px;
    font-family: var(--el-font-family-mono, 'Monaco', 'Menlo', monospace);
    background: var(--el-fill-color-light);
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: var(--app-space-s) !important;
  }
  
  &__description {
    color: var(--el-text-color-regular);
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: var(--app-space-s) !important;
  }
  
  &__dates {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.4;
    
    small {
      font-size: inherit;
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: var(--app-space-m);
    
    &__actions {
      margin-left: 0;
      align-self: stretch;
    }
  }
  
  .schema-grid {
    grid-template-columns: 1fr;
  }
}
</style>
