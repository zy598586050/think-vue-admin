/**
 * Mutations业务层
 */
import storage from "../utils/localStorage";

export default {
    LOGIN(state,item){
        state.userInfo = {
            name: item.name || '',
            avatar: item.avatar || '',
            token: item.token || ''
        }
        state.auth_array = item.auth_array || ''
        state.menu_tree = item.menu_tree || ''
        storage.setItem('userInfo',state.userInfo)
        storage.setItem('auth_array',item.auth_array)
        storage.setItem('menu_tree',item.menu_tree)
    },
    LOGOUT(state){
        state.userInfo = {}
        state.auth_array = []
        state.menu_tree = []
        storage.setItem('userInfo',{})
        storage.setItem('auth_array',[])
        storage.setItem('menu_tree',[])
    }
}