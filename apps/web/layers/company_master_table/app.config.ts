export default defineAppConfig({
  appMenu: {
    "admin-master-table": {
      id: "admin-master-table",
      name: 'adminMenu.masterTable',
      label: "adminMenu.masterTable",
      icon: "dp-icon:table",
      hoverIcon: "dp-icon:table",
      component: "LazyCompanyMasterTable",
      feature: "CORE",
      props: {},
    },
  }
})
