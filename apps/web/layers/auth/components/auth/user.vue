<script lang="ts" setup>
import {emitBus, EventType} from 'eventbus';

import {logout} from '#imports'
const routerProvider = inject(MenuRouterKey)
const user = useUser()
const config = useRuntimeConfig()
const { locales, locale, setLocale } = useI18n()
// const { uploadState } = useUploadAIStore()
const isDesktop = useDesktopMode()

async function changeLanguage(langCode:'en-US' | 'zh-CN' | 'zh-HK') {
    // const perference = useUserPreference()
    // perference.value.language = langCode
    // await clientApi.api.putUserSetting(perference.value as any)
    setLocale(langCode);
    window.location.reload()
}
function removeBaseUrl(){
   const ev = new CustomEvent('removeBaseUrl')
    window.dispatchEvent(ev)
}


function openHelp(){
    const url = "https://docpal-admin-guide.vercel.app/"
    window.open(url, "_blank");
}

function openSetting(){
// TODO: 根據不同的環境進入不同的頁面
//   const newItem = {
//     id: "user-profile-setting-" + new Date().getTime(),
//     name: "user-profile-setting",
//     icon: 'lucide:file-sliders',
//     label: "user-profile-setting",
//     component: 'LazySettingUserProfileSetting',
//     props: {
//     }
//   }
//   routerProvider?.navigateTo(newItem)

    emitBus(EventType.OPEN_SETTINGS, "");
}

function handleOpenUpload(show: boolean = false, action: 'upload' | 'ai' | '' = 'upload') {
    const ev = new CustomEvent('openUploadDrawer', { detail: action })
    document.dispatchEvent(ev)
}

</script>

<template>
    <div class="userMenuWidgetContainer">
        <AppLogo />
        <div v-if="user" class="username">
            {{ user.username }}
        </div>
        <div class="actions">
            <!-- TODO: upgrade UploadStructureButton to use new upload structure -->
            <!-- <UploadStructureButton v-if="uploadState.uploadRequestList && uploadState.uploadRequestList.length > 0" @click="handleOpenUpload(true, 'upload')"></UploadStructureButton> -->
            <!-- <Notification  /> -->
            <ElDropdown id="authUserSettingDropdown">
                <ElButton size="small" link >
                    <ElIcon><SvgIcon class="dropdownIcon" src="/icons/dots.svg"/></ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownItem @click="openSetting">{{ $t('adminMenu.setting') }}</ElDropdownItem>
                    <!-- TODO: remove this part from prodction, or mark it avalible only for super admin -->
                    <Language />
                    <ElDropdownItem @click="openHelp">{{ $t('adminMenu.help') }}</ElDropdownItem>
                    <ElDivider />
                    <ElDropdownItem v-for="lang in locales" :key="lang.code"
                        :disabled="lang.code === locale" @click="changeLanguage(lang.code)">
                        {{$t(lang.code)}}
                    </ElDropdownItem>
                    <ElDivider />
                    <ElDropdownItem v-if="isDesktop" @click="removeBaseUrl">Reset Desktop</ElDropdownItem>
                    <ElDropdownItem @click="logout">{{ $t('login_loginOut')}}</ElDropdownItem>
                </template>
            </ElDropdown>
        </div>
    </div>

</template>

<style scoped lang="scss">
.userMenuWidgetContainer{
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--app-space-s);
    line-height: 1;
    padding-right: var(--app-space-xs);

}
.dropdownIcon{
    --icon-size: var(--app-font-size-m);
}
.username{
    flex: 1 0 auto;
}
</style>
