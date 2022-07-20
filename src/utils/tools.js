export default {
    // 菜单变树结构
    arrayToTree(array,id = 'id',pid = 'pid'){
        return array.filter(father => {
            // 返回每一项的子项
            const children = array.filter(child => father[id] == child[pid])
            children.length > 0 ? father['children'] = children : father['children'] = []
            return father[pid] == 0 // 返回第一层
        })
    }
}