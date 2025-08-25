<script lang="ts" setup>
import { EventType, useEventBus } from 'eventbus'
import { TabManagerKey, createError, inject} from '#imports'

const tabProvider = inject(TabManagerKey)
if(!tabProvider) {
    throw createError('tab manger not found')
}

function handleOpen() {
  try {
    const newItem: any = {
      id: 'client-user-setting',
      name: 'client-user-setting',
      icon: 'lucide:user',
      label: 'admin.setting.title',
      component: 'Setting',
      props: {}
    }
    tabProvider?.openInCurrentTab(newItem)
  } catch (e) {
    console.log(e)
  }
}

const bus = useEventBus(EventType.OPEN_SETTINGS)
bus.on(handleOpen)
onUnmounted(() => {
  bus.off(handleOpen)
})

</script>


<template>
 <!-- // no ui -->
</template>
