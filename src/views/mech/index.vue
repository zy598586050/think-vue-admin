<template>
    <div>
        <!-- 搜索 -->
        <button-search placeholder="要搜索的部门" @search="searchEvent">
            <!-- 左边 -->
            <template #left>
                <el-button type="primary" size="mini" @click="openWindow" v-has="'sys:mech:add'">添加根部门</el-button>
            </template>
            <!-- 高级搜索表单 -->
            <template #form>
                <el-form :inline="true" :model="searchForm">
                    <el-form-item label="部门名称">
                        <el-input style="width:160px" v-model="searchForm.mechName" placeholder="要搜索的部门" size="mini" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="部门编码">
                        <el-input style="width:160px" v-model="searchForm.mechCode" placeholder="要搜索的编码" size="mini" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="部门电话">
                        <el-input style="width:160px" v-model="searchForm.mechPhone" placeholder="要搜索的电话" size="mini" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchEvent" size="mini">搜索</el-button>
                        <el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </button-search>
        <!-- 表格 -->
        <el-table class="table-box" :data="tableData" row-key="id" border default-expand-all>
            <el-table-column prop="name" label="部门名称"/>
            <el-table-column prop="code" label="部门编码"/>
            <el-table-column prop="phone" label="部门电话"/>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="openWindow(scope.row)" v-has="'sys:mech:edit'">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-has="'sys:mech:del'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加、编辑弹窗 -->
        <el-dialog v-model="isShowModel" :title="submitForm.id ? '编辑' : '新增'" :before-close="handleClose">
            <el-form :inline="true" :model="submitForm">
                <el-form-item label="上级部门">
                    <el-cascader v-model="submitForm.pid" :options="tableData" :show-all-levels="false" placeholder="请选择上级部门" :props="{label: 'name',value: 'id',checkStrictly: true}"/>
                </el-form-item>
                <el-form-item label="部门名称">
                    <el-input v-model="submitForm.name" placeholder="请输入部门名称" style="width: 190px" />
                </el-form-item>
                <el-form-item label="部门编码">
                    <el-input v-model="submitForm.code" placeholder="请输入部门编码" style="width: 190px" />
                </el-form-item>
                <el-form-item label="部门电话">
                    <el-input v-model="submitForm.phone" placeholder="请输入部门电话" style="width: 190px" />
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
            searchForm: {
                mechName: '', // 部门名称
                mechCode: '', // 部门编码
                mechPhone: '' // 部门电话
            },
            submitForm: {
                id: '', // 部门ID
                pid: '', // 上级部门ID
                name: '', // 部门名称
                code: '', // 部门编码
                phone: '' // 部门电话
            },
            tableData: [],
            isShowModel: false
        }
    },
    created(){
        // 获取部门列表
        this.getMechList()
    },
    methods: {
        // 搜索
        searchEvent(e = false){
            // 简单搜索
            if(typeof e === 'string'){
                this.searchForm.mechName = e
            }
            // 高级搜索
            this.getMechList()
        },
        // 清空筛选条件
        clearSearch(){
            this.searchForm = {
                mechName: '', // 部门名称
                mechCode: '', // 部门编码
                mechPhone: '' // 部门手机号
            }
        },
        // 获取部门列表
        getMechList(){
            this.$api.getMechList(this.searchForm).then(result => {
                this.tableData = Tools.arrayToTree(result.data)
            })
        },
        // 打开新增/编辑弹窗
        openWindow(item){
            this.isShowModel = true
            if(item.id){
                // 编辑
                this.submitForm = {
                    id: item.id,
                    pid: item.pid,
                    name: item.name,
                    code: item.code,
                    phone: item.phone
                }
            }
        },
        // 编辑或新增按钮点击
        submitButton(){
            this.$api.createOrEditMech(this.submitForm).then(result => {
                this.isShowModel = false
                this.$message({
                    message: result.msg,
                    type: 'success'
                })
                this.getMechList()
            })
        },
        // 弹窗关闭事件
        handleClose(){
            this.isShowModel = false
            this.searchForm = {
                mechName: '', // 部门名称
                mechCode: '', // 部门编码
                mechPhone: '' // 部门电话
            }
        },
        // 删除
        handleDelete(id){
            this.$alert('您确定要删除该部门吗？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteMech({id}).then(result => {
                    this.$message({
                        message: result.msg,
                        type: 'success'
                    })
                    this.getMechList()
                })
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
</style>
