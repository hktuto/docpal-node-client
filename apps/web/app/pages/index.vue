
<script setup lang="ts">
import { useGlobalSetting } from "#imports";
import { TabApp } from "#components";
const tabAppRef = ref<InstanceType<typeof TabApp>>();
const emits = defineEmits(["ready"]);

const props = defineProps<{
  mode: 'client' | 'admin',
  defaultTab?: any
}>()

async function getTabsFromServer() {
  // check if new tab
  const route = useRoute();

  let storageTabs = localStorage.getItem('app-tab');

  sessionStorage.removeItem('temp-path')
  // storageTabs = null
  try {
    if (storageTabs) {
      const newLayout = JSON.parse(storageTabs);
      // check and set layout
      newLayout.forEach((item:any) => {
        const tabId = item.id;
        item.tabs.forEach((child:any) => {
          child.parent = tabId
        })
      })
      // TODO : check if storageTabs is array, and handle restore other tabs
      tabAppRef.value?.setLayout(newLayout);
    } else {
      // init a basic layout
      tabAppRef.value?.setHightLightPanel("dummy-tab-container");
      const config = useRuntimeConfig() as any;
      const defaultTab = props.defaultTab || config.public.defaultTab
      defaultTab.parent = "dummy-tab-container";

      tabAppRef.value?.setLayout([
        {
          id: "dummy-tab-container",
          parent: "root",
          showingTabIndex: 0,
          size: 100,
          tabs: [defaultTab],
        },
      ]);
    }
  } catch (error) {
    const config = useRuntimeConfig() as any;
    const defaultTab = config.public.defaultTab || {
      id: "new-tab-001",
      label: "New Tab",
      name: "new-tab-001",
      parent: "dummy-tab-container",
      component: "LazyTabEmpty",
    };
    tabAppRef.value?.setLayout([
      {
        id: "dummy-tab-container",
        parent: "root",
        showingTabIndex: 0,
        size: 100,
        tabs: [defaultTab],
      },
    ]);
    console.log("getTabsFromServer", error);
  }
  const router = useRouter();

  router.push({
    hash: "",
    query: {},
  });
}

function saveHighlightPanel(panelID: string) {
  localStorage.setItem("app-tab-hightLightPanel", panelID);
}

async function saveTabsToLocalStorage(layout: TabPanel[]) {
  const saveData = JSON.parse(JSON.stringify(layout));
  // loop all panel and tabs to reset all initized to false
  saveData.forEach((panel: any) => {
    panel.tabs.forEach((tab: any) => {
      tab.initized = false;
    });
  });
  localStorage.setItem(props.mode + '-app-tab', JSON.stringify(saveData));
}
const { t } = useI18n();

const { globalSlots } = useGlobalSetting();

</script>


<template>
  <TabApp 
    @ready="getTabsFromServer"
      @layoutChanged="saveTabsToLocalStorage"
      @highlightPanelChanged="saveHighlightPanel"
  >
    <template #sidebar>
        <slot name="sidebar" />
        <component
          v-for="s in globalSlots"
          v-show="s.show"
          :key="s.name"
          :is="s.component"
          v-bind="$props"
        />
      </template>
    </TabApp>
    <AppContextmenu />
</template>
