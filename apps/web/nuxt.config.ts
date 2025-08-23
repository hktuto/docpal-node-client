// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from 'nuxt/config'
import dotenv from 'dotenv'
dotenv.config({
  path: '../../.env'
})


export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  css: ['~/assets/styles/main.scss'],
  compatibilityDate: '2025-08-24',
  ssr: false,
  modules: ['@nuxtjs/i18n', '@nuxtjs/color-mode', '@nuxt/icon'],
  debug : process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale:'en-US',
    langDir:'locales',
    locales: [
      {
        code:'en-US',
        file:'en-US.json'
      },
      {
        code:'zh-CN',
        file:'zh-CN.json'
      },
      {
        code : 'zh-HK',
        file:'zh-HK.json'
      }
    ],
    strategy:'no_prefix',
    compilation:{
      strictMessage: false,
      escapeHtml: true,
    }
  },
  runtimeConfig: {
    public: {
      updateInterval: 300000,
      apiUrl: process.env.API_URL,
    }
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // api: "modern-compiler",
          quietDeps: true,
        },
      },
    },
    vue: {
      features: {
        propsDestructure: true,
      },
      script:{
        defineModel:true
      },
    },    
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.warn', 'console.debug', 'console.trace', 'console.info'],
    },
  }
})