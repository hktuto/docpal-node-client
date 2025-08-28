<template>
  <div ref="containerRef" class="responsive-table-container">
    <!-- View Toggle Header -->

    <!-- Desktop View: VxeGrid -->
    <VxeGrid
      v-if="!isCardView"
      v-bind="tableConfig"
      v-on="tableEvent"
      ref="tableRef"
    >
      <!-- Pass through all slots to VxeGrid -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <template v-if="name === 'toolbar_buttons'">
          <div class="parent-container">
            <div class="slot-container">
              <slot :name="name" v-bind="slotData" />
            </div>
            <ResponsiveToggleView style="margin-top: 6px;" v-model="manualView" :isCardView="isCardView" />
          </div>
        </template>
        <template v-else>
          <slot :name="name" v-bind="slotData" />
        </template>

      </template>
    </VxeGrid>

    <!-- Mobile View: Card List -->
    <ResponsiveCardList
      v-else
      :card-template-settings="cardTemplateSettings"
      :table-config="tableConfig"
      @action-click="handleCardAction"
      @card-click="handleCardClick"
    >
      <!-- Pass through all slots to CardList -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <template v-if="name === 'toolbar_buttons'">
          <slot :name="name" v-bind="slotData" />
          <ResponsiveToggleView v-model="manualView" :isCardView="isCardView" />
        </template>
        <template v-else>
          <slot :name="name" v-bind="slotData" />
        </template>
      </template>
    </ResponsiveCardList>
  </div>
</template>

<script lang="ts" setup>
import type { VxeGridInstance } from 'vxe-table'
import { useCardTemplate } from '../../composables/useCardTemplate'
import { useResponsiveContainer } from '../../composables/useResponsiveContainer'
import ResponsiveToggleView from './toggleView.vue'

const props = defineProps<{
  // Accept the result from useVxeTable
  tableConfig: any
  tableEvent: any
}>()

const emits = defineEmits<{
  'action-click': [params: { action: any; row: any; event: any }]
  'card-click': [params: { row: any; event: any }]
  'view-change': [view: 'auto' | 'table' | 'card']
}>()

// Use container-based responsive detection
const { containerRef, isMobile: containerIsMobile } = useResponsiveContainer(640)

// Manual view toggle state
const manualView = ref<'auto' | 'table' | 'card'>('auto')

// Computed mobile state - manual override takes precedence
const isCardView = computed(() => {
  if (manualView.value === 'table') return false
  if (manualView.value === 'card') return true
  return containerIsMobile.value
})

// Watch for manual view changes and emit events
watch(manualView, (newView) => {
  emits('view-change', newView)
})

// Internal table ref
const tableRef = ref<VxeGridInstance<any>>()

// Card template settings from user preferences
const { getCardTemplateSettings } = useCardTemplate()
const cardTemplateSettings = computed(() => getCardTemplateSettings(props.tableConfig?.id || 'default'))

// Handle card actions
function handleCardAction(params: { action: any; row: any; event: any }) {
  emits('action-click', params)
}

// Handle card clicks
function handleCardClick(params: { row: any; event: any }) {
  if (props.tableConfig?.dblClickAction) {
    props.tableConfig.dblClickAction({ row: params.row, column: null, event: params.event })
  }
  emits('card-click', params)
}

// Expose all methods from the internal table ref
defineExpose({
  // View control methods
  setView: (view: 'auto' | 'table' | 'card') => {
    manualView.value = view
  },
  getCurrentView: () => manualView.value,

  // Core table methods
  reload: () => tableRef.value?.commitProxy('reload'),
  query: (params: any) => tableRef.value?.commitProxy('query', params),

  // Data methods
  getData: () => tableRef.value?.getData(),
  loadData: (data: any) => tableRef.value?.loadData(data),

  // Checkbox methods
  getCheckboxRecords: () => tableRef.value?.getCheckboxRecords(),
  clearCheckboxRow: () => tableRef.value?.clearCheckboxRow(),
  setCheckboxRow: (row: any, checked: boolean) => tableRef.value?.setCheckboxRow(row, checked),

  // Selection methods
  clearSelected: () => tableRef.value?.clearSelected?.(),

  // Current row methods
  setCurrentRow: (row: any) => tableRef.value?.setCurrentRow?.(row),

  // Scroll methods
  scrollTo: (options: any) => tableRef.value?.scrollTo?.(options),
  scrollToRow: (row: any) => tableRef.value?.scrollToRow?.(row),
  scrollToColumn: (column: any) => tableRef.value?.scrollToColumn?.(column),

  // Sort and filter methods
  sort: (field: string, order: any) => tableRef.value?.sort?.(field, order),
  clearSort: () => tableRef.value?.clearSort?.(),
  setFilter: (field: string, values: any[]) => tableRef.value?.setFilter?.(field, values),
  clearFilter: () => tableRef.value?.clearFilter?.(),

  // Column methods
  showColumn: (field: string) => tableRef.value?.showColumn?.(field),
  hideColumn: (field: string) => tableRef.value?.hideColumn?.(field),

  // Export methods
  exportData: (options: any) => tableRef.value?.exportData?.(options),

  // Utility methods
  updateData: () => tableRef.value?.updateData?.(),

  // Proxy methods
  commitProxy: (type: string, params?: any) => tableRef.value?.commitProxy(type, params),

  // Expose the internal tableRef for advanced usage
  tableRef: tableRef,

  // Additional methods from useVxeTable
  cleanSelectedRows: () => {
    tableRef.value?.clearCheckboxRow()
    tableRef.value?.clearSelected()
  }
})
</script>

<style lang="scss" scoped>
.responsive-table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.parent-container {
  width: 100%;
  display: flex;
}

.slot-container {
  width: 96.5%;
  min-width: 500px;
  display: flex;
}

</style> 
