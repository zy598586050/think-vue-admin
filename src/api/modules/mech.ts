import request from "@/utils/request";

export default {
    // 获取部门列表
    getMechList(params = {}){
        return request({
            url: '/mech_list',
            method: 'post',
            data: params,
        })
    },
    // 新增/编辑部门
    createOrEditMech(params){
        return request({
            url: '/mech_create_or_edit',
            method: 'post',
            data: params,
        })
    },
    // 删除部门
    deleteMech(params){
        return request({
            url: '/mech_delete',
            method: 'post',
            data: params,
        })
    }
}