/**
 * Vuex状态管理
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import storage from '../utils/localStorage'

const state = {
    userInfo: storage.getItem('userInfo') || '',
    auth_array: storage.getItem('auth_array') || '',
    menu_tree: storage.getItem('menu_tree') || '',
    cachedViews: []
}

export default createStore({
    state,
    mutations
})