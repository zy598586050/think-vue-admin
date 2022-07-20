import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'
import store from './store'
import request from './utils/request'
import storage from './utils/localStorage'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'virtual:svg-icons-register'

const app = createApp(App)

import * as ElIcons from '@element-plus/icons-vue'
for (const name in ElIcons){
	app.component(name,ElIcons[name])
}

// 全局引入AVG组件
import SvgIcon from '@/components/SvgIcon.vue'
app.component('svg-icon',SvgIcon)

// 全局挂载接口
app.config.globalProperties.$api = api
// 全局挂载请求
app.config.globalProperties.$axios = request
// 全局挂载本地存储
app.config.globalProperties.$storage = storage

// 自定义按钮权限校验
app.directive('has',{
    beforeMount: (el,binding) => {
        // 获取按钮权限
        const btnList = storage.getItem('auth_array')
        const value = binding.value
        const hasPermission = btnList.includes(value)
        if(!hasPermission){
            setTimeout(() => {
                el.parentNode.removeChild(el)
            },0)
        }
    }
})

app
.use(router)
.use(store)
.use(ElementPlus,{
    locale: zhCn
})
.mount('#app')
