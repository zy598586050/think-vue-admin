<template>
    <div>
        <!-- 搜索 -->
        <button-search placeholder="要搜索的角色" @search="searchEvent">
            <!-- 左边 -->
            <template #left>
                <el-button type="primary" size="mini" v-has="'sys:role:add'" @click="openWindow">添加角色</el-button>
            </template>
        </button-search>
        <!-- 表格 -->
        <el-table class="table-box" :data="tableData" border>
            <el-table-column prop="name" label="角色名称"/>
            <el-table-column prop="remarks" label="角色备注"/>
            <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                    <el-button type="primary" size="mini" v-has="'sys:role:edit'" @click="openWindow(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" v-has="'sys:role:del'" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加、编辑弹窗 -->
        <el-dialog v-model="isShowModel" :title="submitForm.id ? '编辑' : '新增'" :before-close="handleClose">
            <el-form :inline="true" :model="submitForm">
                <el-form-item label="角色名称">
                    <el-input v-model="submitForm.name" placeholder="请输入角色名称" style="width: 190px" />
                </el-form-item>
                <el-form-item label="角色备注">
                    <el-input v-model="submitForm.remarks" placeholder="请输入角色备注" style="width: 190px" />
                </el-form-item>
            </el-form>
            <div class="menu-box" v-has="'sys:role:dist'">
                <div class="menu-box-label">权限列表</div>
                <div class="menu-box-tree">
                    <el-tree 
                    :props="{label: 'name',children: 'children'}"
                    :data="authTree"
                    ref="tree"
                    node-key="id"
                    show-checkbox
                    default-expand-all
                    ></el-tree>
                </div>
            </div>
            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitButton">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import buttonSearch from '@/components/ButtonSearch.vue'
export default{
    components: { buttonSearch },
    data(){
        return {
            authTree: [],
            tableData: [],
            searchForm: {
                name: ''
            },
            submitForm: {
                id: '',
                name: '',
                remarks: '',
                auth_ids: ''
            },
            isShowModel: false
        }
    },
    created(){
        this.getRoleList()
        this.getAuthList()
    },
    methods: {
        // 获取权限列表
        getAuthList(){
            this.$api.getAuthList().then(result => {
                this.authTree = result.data
            })
        },
        // 打开弹窗
        openWindow(item){
            this.isShowModel = true
            if(item.id){
                // 编辑
                this.submitForm = {
                    id: item.id,
                    name: item.name,
                    remarks: item.remarks,
                    auth_ids: item.auth_ids
                }
                this.$nextTick(() => {
                    item.auth_ids.split(',').forEach(item => {
                        const node = this.$refs.tree.getNode(item)
                        if(node.isLeaf){
                            this.$refs.tree.setChecked(node,true)
                        }
                    })
                })
            }
        },
        // 删除角色
        handleDelete(id){
            this.$alert('您确定要删除该角色吗？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteRole({id}).then(result => {
                    this.$message({
                        message: result.msg,
                        type: 'success'
                    })
                    this.getRoleList()
                })
            })
        },
        // 搜索
        searchEvent(e = false){
            // 简单搜索
            if(typeof e === 'string'){
                this.searchForm.name = e
            }
            // 高级搜索
            this.getRoleList()
        },
        getRoleList(){
            this.$api.getRoleList(this.searchForm).then(result => {
                this.tableData = result.data
            })
        },
        handleClose(){
            this.isShowModel = false
            this.submitForm = {
                id: '',
                name: '',
                remarks: '',
                auth_ids: ''
            }
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys([])
            })
        },
        // 编辑或新增按钮点击
        submitButton(){
            const hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            const checkedKeys = this.$refs.tree.getCheckedKeys()
            this.submitForm.auth_ids = checkedKeys.concat(hafCheckedKeys).join(',')
            this.$api.createOrEditRole(this.submitForm).then(result => {
                this.isShowModel = false
                this.$message({
                    message: result.msg,
                    type: 'success'
                })
                this.getRoleList()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.table-box{
    margin-top: 20px;
    height: 80vh;
    border-bottom: 1px solid #ebeef5;
}
.menu-box{
  display: flex;
  .menu-box-label{
    font-size: 14px;
    color: #606266;
  }
  .menu-box-tree{
    width: 300px;
    padding: 8px 0;
    margin-left: 13px;
    border: 1px solid #eee;
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>