export default defineAppConfig({
  userMenu:[
    {
      name: "client-work-panel"
    },
    {
      name: "client-browse"
    },
    {
      name: "client-search"
    },
    {
      label: "file_uploads",
      icon: "uil:upload",
      children: [
        {
          name: "client-ai-upload"
        },
        {
          name: "client-fileRequest"
        }
      ]
    },
    {
      label: "file_share_module",
      icon: "meteor-icons:share",
      children: [
        {
          name: "client-share"
        },
        {
          name: "client-share-me"
        },
        {
          name: "client-share-other"
        }
      ]
    },
    {
      name: "client-collections"
    },
    // {
    //     name: "client-smartFolder"
    // },
    {
      name: "client-folder-cabinet"
    },
    {
      name: "client-workflow"
    },
    {
      label: "retention_policies",
      icon: "ic:outline-lock-clock",
      children: [
        {
          name: "client-retention"
        },
        {
          name: "client-holdPolicies"
        }
      ]
    },
    {
      name: "client-dashboard"
    },
    {
      name: "client-master-table"
    },
    {
      name: "client-trash"
    },
    {
      name: "client-case-manage"
    },
    {
      name: "client-easy-form"
    },
    {
      name :"user-role-file-action"
    },
    {
      name: "RBAC-client-page"
    }
  ],
  menuItem:{
    "RBAC-client-page":{
      id:"admin-user",
      name: 'admin-user-list',
      label: "adminMenu.User",
      icon: "dp-icon:user",
      hoverIcon: "dp-icon:user",
      component: "LazyAdminUserList",
      feature: "CORE",
      props:{},
      child:[]
    },
  }
})