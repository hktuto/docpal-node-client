# Reusable Table Components

This document explains how to use the new reusable table components that support multiple views for the same table data.

## Architecture Overview

The table functionality has been refactored into three main reusable components:

1. **`DataTable.vue`** - The core table component with filtering and sorting logic
2. **`TableControls.vue`** - Header controls for table management  
3. **`MultiViewTable.vue`** - Example of how to use the components for different view types

## Components

### DataTable Component

**Location**: `components/global/companyMasterTable/DataTable.vue`

A reusable table component that handles:
- Dynamic column rendering based on schema
- Sorting and filtering with query emission
- Column management (edit, show/hide, delete)
- Record actions (edit, delete, custom actions)
- Loading states and empty states

#### Props

```typescript
interface Props {
  tableName: string
  schema?: any              // Table schema from API
  data: any[]              // Table data array
  loading?: boolean        // Loading state
  showActions?: boolean    // Show edit/delete actions
  showColumnManagement?: boolean  // Show column management dropdown
  enableSorting?: boolean  // Enable sorting functionality
  enableFiltering?: boolean // Enable filtering functionality  
  enableColumnVisibility?: boolean // Enable show/hide columns
  customActions?: Array<{  // Custom action buttons
    label: string
    icon?: string
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    onClick: (row: any) => void
  }>
}
```

#### Events

```typescript
// Emitted when query changes (sorting, filtering)
'data-changed': [query: any]

// Record management events
'edit-record': [record: any]
'delete-record': [record: any]

// Column management events  
'column-updated': [column: any]
'column-visibility-changed': [column: any, isVisible: boolean]
'column-deleted': [column: any]
```

#### Usage Example

```vue
<DataTable 
  :table-name="tableName"
  :schema="schema"
  :data="list"
  :loading="isLoading"
  :custom-actions="[{
    label: 'Export',
    icon: '📊', 
    type: 'info',
    onClick: (row) => exportRecord(row)
  }]"
  @data-changed="handleDataChanged"
  @edit-record="editRecord"
  @delete-record="deleteRecord"
/>
```

### TableControls Component

**Location**: `components/global/companyMasterTable/TableControls.vue`

Header controls component that provides:
- Table title and record count display
- Action buttons (create, add column, manage columns, filter, refresh)
- Customizable action buttons
- Responsive design

#### Props

```typescript
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
```

#### Events

```typescript
'create-record': []
'add-column': []
'manage-columns': []
'open-filter': []
'refresh': []
```

#### Usage Example

```vue
<TableControls 
  :table-name="tableName"
  :schema="schema"
  :record-count="list.length"
  :loading="isLoading"
  :custom-actions="[{
    label: 'Import Data',
    icon: '📥',
    type: 'success', 
    onClick: () => openImportDialog()
  }]"
  @create-record="handleCreateNew"
  @refresh="getData"
/>
```

### MultiViewTable Component

**Location**: `components/examples/MultiViewTable.vue`

Example component showing how to use the reusable components for different view types:
- Table view (default)
- Kanban view 
- Calendar view
- Gantt view

#### Props

```typescript
interface Props {
  tableName: string
  viewType?: 'table' | 'kanban' | 'calendar' | 'gantt'
  customFilters?: any[]    // Pre-applied filters
  readOnly?: boolean       // Read-only mode
}
```

## Usage Patterns

### 1. Basic Table View

```vue
<script setup lang="ts">
import DataTable from './DataTable.vue'
import TableControls from './TableControls.vue'

const schema = ref(null)
const list = ref([])
const isLoading = ref(false)

function handleDataChanged(query) {
  // Fetch data with new query
  fetchDataWithQuery(query)
}
</script>

<template>
  <div>
    <TableControls 
      :table-name="tableName"
      :schema="schema"
      :record-count="list.length"
      :loading="isLoading"
      @refresh="loadData"
    />
    
    <DataTable 
      :table-name="tableName"
      :schema="schema"
      :data="list"
      :loading="isLoading"
      @data-changed="handleDataChanged"
    />
  </div>
</template>
```

### 2. Read-Only View

```vue
<DataTable 
  :table-name="tableName"
  :schema="schema"
  :data="list"
  :loading="isLoading"
  :show-actions="false"
  :show-column-management="false"
  :enable-filtering="false"
  @data-changed="handleDataChanged"
/>
```

### 3. Custom Actions

```vue
<DataTable 
  :table-name="tableName"
  :schema="schema"
  :data="list"
  :custom-actions="[
    {
      label: 'Approve',
      icon: '✅',
      type: 'success',
      onClick: (row) => approveRecord(row)
    },
    {
      label: 'Reject', 
      icon: '❌',
      type: 'danger',
      onClick: (row) => rejectRecord(row)
    }
  ]"
  @data-changed="handleDataChanged"
/>
```

### 4. Different View Types

```vue
<!-- Table View -->
<MultiViewTable 
  :table-name="tableName"
  view-type="table"
/>

<!-- Kanban View with Custom Filters -->
<MultiViewTable 
  :table-name="tableName"
  view-type="kanban"
  :custom-filters="[{
    column: 'status',
    operator: 'in',
    value: ['todo', 'in-progress', 'done']
  }]"
/>

<!-- Read-only Calendar View -->
<MultiViewTable 
  :table-name="tableName"
  view-type="calendar"
  :read-only="true"
/>
```

## Event Handling

### Data Changes

When sorting or filtering changes, the `DataTable` component emits a `data-changed` event with the new query object:

```typescript
{
  select: string[],    // Visible column names
  sorts: Array<{       // Sort configuration
    column: string,
    direction: 'asc' | 'desc'  
  }>,
  filters: Array<{     // Filter configuration
    column: string,
    operator: string,
    value: any
  }>,
  groups: any[]        // Group configuration
}
```

### API Integration

The query object is designed to work directly with the API endpoints:

```typescript
// Table view
apiClient.companies.postCompaniesDataRecordsTablenameQuerytable(tableName, query)

// Kanban view  
apiClient.companies.postCompaniesDataRecordsTablenameQuerykanban(tableName, query)

// Calendar view
apiClient.companies.postCompaniesDataRecordsTablenameQuerycalendar(tableName, query)

// Gantt view
apiClient.companies.postCompaniesDataRecordsTablenameQuerygantt(tableName, query)
```

## Benefits

1. **Reusability**: Components can be used across different pages and views
2. **Consistency**: Uniform behavior and styling across the application
3. **Maintainability**: Changes to table logic only need to be made in one place
4. **Flexibility**: Easy to customize with props and custom actions
5. **Multiple Views**: Same data can be displayed in different formats
6. **Event-Driven**: Clean separation between data fetching and UI components

## Migration from Old Components

To migrate from the old `detail.vue` component:

1. Replace the table template with `<DataTable>` and `<TableControls>`
2. Move data fetching logic to the parent component  
3. Handle the `data-changed` event to fetch new data
4. Move column management logic to event handlers
5. Remove old sorting/filtering state from parent component

The old `detail.vue` component is now a good example of how to integrate the new components while maintaining all the existing functionality like column management dialogs and record editing.