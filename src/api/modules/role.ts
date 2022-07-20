import request from "@/utils/request";

export default {
    // 获取角色列表
    getRoleList(params = {}){
        return request({
            url: '/role_list',
            method: 'post',
            data: params,
        })
    },
    // 新增/编辑角色
    createOrEditRole(params){
        return request({
            url: '/role_create_or_edit',
            method: 'post',
            data: params,
        })
    },
    // 删除角色
    deleteRole(params){
        return request({
            url: '/role_delete',
            method: 'post',
            data: params,
        })
    }
}