import request from "@/utils/request";

interface createOrEditAuthParams {
    id: string;
}

export default {
    // 获取权限列表
    getAuthList(params = {}){
        return request({
            url: '/auth_list',
            method: 'post',
            data: params,
        })
    },
    // 新增/编辑权限
    createOrEditAuth(params: createOrEditAuthParams){
        return request({
            url: '/auth_create_or_edit',
            method: 'post',
            data: params,
        })
    },
    // 删除权限
    deleteAuth(params){
        return request({
            url: '/auth_delete',
            method: 'post',
            data: params,
        })
    }
}