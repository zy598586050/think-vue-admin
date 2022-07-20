import request from "@/utils/request";

export default {
    // 登录
    login(params){
        return request({
            url: '/login',
            method: 'post',
            data: params,
        })
    },
    // 修改密码
    reset(params){
        return request({
            url: '/reset',
            method: 'post',
            data: params,
        })
    },
    // 获取用户菜单和权限列表
    getMenuAuth(params = {}){
        return request({
            url: '/get_menu_auth',
            method: 'post',
            data: params,
        })
    },
    // 根据部门查用户列表
    getUserByMech(params){
        return request({
            url: '/get_user_by_mech',
            method: 'post',
            data: params,
        })
    },
    // 新增或编辑用户
    createOrEditUser(params){
        return request({
            url: '/user_create_or_edit',
            method: 'post',
            data: params,
        })
    },
    // 删除用户
    deleteUser(params){
        return request({
            url: '/user_delete',
            method: 'post',
            data: params,
        })
    }
}