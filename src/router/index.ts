import { createRouter, createWebHashHistory } from 'vue-router'
import storage from '../utils/localStorage'
import api from '../api'

// 主体页面
import Layout from '@/layout/index.vue'

// 路由配置
const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Layout,
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: 'welcome',
                meta: {
                    title: '欢迎页'
                },
                component: () => import('@/views/home/index.vue')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/login/index.vue')
    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: '404'
        },
        component: () => import('@/views/home/404.vue')
    }
]

// 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 动态加载路由
const loadAsyncRoutes = async () => {
    const userInfo = storage.getItem('userInfo') || {}
    if(userInfo.token){
        try{
            const result = await api.getMenuAuth()
            storage.setItem('auth_array',result.data.auth_array)
            storage.setItem('menu_tree',result.data.menu_tree)
            const getMenuAuth = result.data.menu_tree
            // 递归加载component
            const deep = (item) => {
                item.forEach(v => {
                    let url = ''
                    if(v.component){
                        url = `../views/${v.component}.vue`
                    }else{
                        url = '../layout/route-view.vue'
                    }
                    v.component = () => import(url)
                    if(v.children.length > 0){
                        deep(v.children)
                    }
                })
            }
            deep(getMenuAuth)
            // 动态添加路由
            getMenuAuth.forEach(v => {
                router.addRoute('home',v)
            })
        }catch(err){
            console.log(err)
        }
    }
}
await loadAsyncRoutes()

// 判断当前地址是否可以访问
const checkPremission = (path) => {
    const hasPermission = router.getRoutes().filter(route => route.path == path).length
    if(hasPermission){
        return true
    }else{
        return false
    }
}

// 路由守卫
router.beforeEach((to,from,next) => {
    console.log('TO',to)
    console.log('FROM',from)
    if(checkPremission(to.path)){
        document.title = to.meta.title
        const userInfo = storage.getItem('userInfo') || {}
        if(userInfo.token){
            // 防止重复登录
            if(to.path == '/login'){
                return next({ name: from.name ? (from.name == '404' ? 'home' : from.name) : 'home' })
            }
            next()
        }else{
            if(to.path == '/welcome'){
                return next({name: 'welcome'})
            }
            next()
        }
    }else{
        next('/404')
    }
})

export default router