<template>
    <div class="content-box">
        <div class="content-box-left">
            <el-tree :data="leftTree" :props="{label: 'name',children: 'children'}" default-expand-all highlight-current :expand-on-click-node="false" @node-click="handleNodeClick" />
        </div>
        <div class="content-box-right">
            <!-- 搜索 -->
            <button-search placeholder="要搜索的账号" @search="searchEvent">
                <!-- 左边 -->
                <template #left>
                    <el-button type="primary" size="mini" v-has="'sys:mech:add'" @click="openWindow">添加</el-button>
                </template>
                <!-- 高级搜索表单 -->
                <template #form>
                    <el-form :inline="true" :model="searchForm">
                        <el-form-item label="姓名">
                            <el-input style="width:160px" v-model="searchForm.name" placeholder="要搜索的姓名" size="mini" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="账号">
                            <el-input style="width:160px" v-model="searchForm.account" placeholder="要搜索的账号" size="mini" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchEvent" size="mini">搜索</el-button>
                            <el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </button-search>
            <!-- 表格 -->
            <el-table class="table-box" :data="tableData" border>
                <el-table-column prop="mech_name" label="所属部门"/>
                <el-table-column prop="name" label="姓名"/>
                <el-table-column prop="account" label="账号"/>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="mini" v-has="'sys:user:edit'" @click="openWindow(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" v-has="'sys:user:del'" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                background
                style="margin-top: 20px"
                :current-page="page.current"
                :page-sizes="page.sizes"
                :page-size="page.size"
                layout="total,sizes,prev,pager,next,jumper"
                :total="page.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="isShowModel" :title="submitForm.id ? '编辑' : '新增'" :before-close="handleClose">
            <el-form :inline="true" :model="submitForm">
                <el-form-item label="所属部门">
                    <el-cascader v-model="submitForm.mech_id" :options="leftTree" :show-all-levels="false" placeholder="请选择所属部门" :props="{label: 'name',value: 'id',checkStrictly: true}"/>
                </el-form-item>
                <el-form-item label="用户姓名">
                    <el-input v-model="submitForm.name" placeholder="请输入用户姓名" style="width: 190px" />
                </el-form-item>
                <el-form-item label="用户账号">
                    <el-input v-model="submitForm.account" placeholder="请输入用户账号" style="width: 190px" />
                </el-form-item>
                <el-form-item label="所属角色" v-has="'sys:user:dist'">
                    <el-select v-model="submitForm.role_id" placeholder="请选择角色">
                        <el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitButton">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import buttonSearch from '@/components/ButtonSearch.vue'
import Tools from '@/utils/tools.js'
export default{
    components: { buttonSearch },
    data(){
        return {
            leftTree: [],
            tableData: [],
            roleList: [],
            page: {
                current: 1, // 当前在第几页
                sizes: [10, 20, 50, 100], // 每页显示多少条数据
                size: 10, // 每页显示多少条
                total: 0 // 共多少条数据
            },
            mech_id: '', // 部门ID
            searchForm: {
                name: '',
                account: ''
            },
            submitForm: {
                id: '',
                mech_id: '',
                name: '',
                account: '',
                role_id: ''
            },
            isShowModel: false
        }
    },
    created(){
        this.getMechList()
        this.getRoleList()
    },
    methods: {
        // 获取部门列表
        getMechList(){
            this.$api.getMechList().then(result => {
                this.leftTree = Tools.arrayToTree(result.data)
            })
        },
        // 获取角色列表
        getRoleList(){
            this.$api.getRoleList().then(result => {
                this.roleList = result.data
            })
        },
        // 打开新增/编辑弹窗
        openWindow(item){
            this.isShowModel = true
            if(item.id){
                // 编辑
                this.submitForm = {
                    id: item.id,
                    name: item.name,
                    account: item.account,
                    mech_id: this.mech_id,
                    role_id: item.role_id
                }
            }
        },
        // 编辑或新增按钮点击
        submitButton(){
            console.log(this.submitForm)
            this.$api.createOrEditUser(this.submitForm).then(result => {
                this.isShowModel = false
                this.$message({
                    message: result.msg,
                    type: 'success'
                })
                this.getUser()
            })
        },
        // 左侧树结构
        handleNodeClick(item){
            this.mech_id = item.id
            this.getUser()
        },
        // 根据部门查询用户
        getUser(){
            this.$api.getUserByMech({
                mech_id: this.mech_id,
                current: this.page.current,
                size: this.page.size
            }).then(result => {
                this.tableData = result.data.list
                this.page.total = result.data.totalCount
            })
        },
        // 搜索
        searchEvent(e = false){
            // 简单搜索
            if(typeof e === 'string'){
                this.searchForm.account = e
            }
            // 高级搜索
            this.getUser()
        },
        handleClose(){
            this.isShowModel = false
            this.submitForm = {
                id: '',
                name: '',
                account: '',
                mech_id: '',
                role_id: ''
            }
        },
        clearSearch(){
            this.searchForm = {
                name: '',
                account: ''
            }
        },
        handleSizeChange(val){
            this.page.size = val
            this.getUser()
        },
        handleCurrentChange(val){
            this.page.current = val
            this.getUser()
        },
        // 删除
        handleDelete(id){
            this.$alert('您确定要删除该用户吗？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteUser({id}).then(result => {
                    this.$message({
                        message: result.msg,
                        type: 'success'
                    })
                    this.getUser()
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.content-box{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 100px);
    .content-box-left{
        width: 210px;
        height: 100%;
        border-right: 1px solid rgb(223, 230, 236);
    }
    .content-box-right{
        width: 80%;
        padding: 0 10px 0 20px;
        .table-box{
            margin-top: 15px;
        }
    }
}
</style>