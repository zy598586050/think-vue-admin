<template>
    <div class="layout-wrapper">
        <!-- 左侧 -->
        <div :class="['sidebar-wrapper', isCollapse ? 'fold' : 'unfold']">
            <!-- LOGO -->
            <div class="logo" v-if="isCollapse == false">
                <span>ThinkJSAdmin</span>
            </div>
            <!-- 导航菜单 -->
            <el-menu
                :default-active="$route.path"
                background-color="#304156"
                text-color="#fff"
                router
                :collapse="isCollapse"
                class="nav-menu"
            >
                <tree-menu :menuList="menuList" />
            </el-menu>
        </div>
        <!-- 右侧 -->
        <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
            <!-- 右侧顶部 -->
            <div class="nav-top">
                <div class="nav-left">
                    <el-icon class="open-close-btn" @click="toggle"><fold /></el-icon>
                    <!-- 面包屑 -->
                    <BreadCrumb class="bread-crumb" />
                </div>
                <el-dropdown class="nav-right" @command="handleLogout">
                    <div class="nav-right-box">
                        <img class="avatar" :src="userInfo.avatar"/>
                        <span class="user-name">{{userInfo.name}}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="reset">修改密码</el-dropdown-item>
                            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <!-- 右侧内容区域 -->
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import TreeMenu from './components/TreeMenu/index.vue'
import BreadCrumb from './components/BreadCrumb/index.vue'
export default {
    name: 'Layout',
    components: { TreeMenu,BreadCrumb },
    data(){
        return {
            isCollapse: false
        }
    },
    computed: {
        cachedViews() {
            return this.$store.state.cachedViews
        },
        key() {
            return this.$route.path
        },
        userInfo(){
            return this.$store.state.userInfo
        },
        menuList(){
            return this.$store.state.menu_tree
        }
    },
    mounted(){
        this.activeMenu = location.hash.slice(2)
    },
    methods: {
        toggle(){
            this.isCollapse = !this.isCollapse
        },
        handleLogout(key){
            if(key == 'logout'){
                this.$confirm('您确定要退出登录？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.commit('LOGOUT')
                    this.$router.push('login')
                }).catch(() => {
                    console.log('取消了操作')
                })
            }else{
                this.$prompt('请输入新密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    // eslint-disable-next-line no-useless-escape
                    inputPattern: /^[\w_\.\-]{1,18}$/,
                    inputType: 'password',
                    inputErrorMessage: '密码格式不正确'
                }).then((value) => {
                }).catch(() => {
                    console.log('取消了操作')
                })
            }
        }
    }
}
</script>

<style lang="scss">
.layout-wrapper{
    position: relative;
    .sidebar-wrapper{
        position: fixed;
        width: 200px;
        height: 100vh;
        background: #304156;
        color: #FFFFFF;
        overflow-y: auto;
        transition: width .5s;
        .logo{
            display: flex;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            height: 50px;
            line-height: 50px;
        }
        .nav-menu{
            height: calc(100vh - 50px);
            border-right: none;
        }
        // 合并
        &.fold {
            width: 64px;
        }
        // 展开
        &.unfold {
            width: 200px;
        }
    }
    .content-right{
        margin-left: 200px;
        // 合并
        &.fold {
            margin-left: 64px;
        }
        // 展开
        &.unfold {
            margin-left: 200px;
        }
        .nav-top{
            height: 50px;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            border-bottom: 1px solid #e5e5e5;
            .nav-left{
                display: flex;
                align-items: center;
                .open-close-btn:hover{
                    cursor: pointer;
                }
                .bread-crumb{
                    margin-left: 15px;
                }
            }
            .nav-right{
                display: flex;
                align-items: center;
                .nav-right-box{
                    display: flex;
                    align-items: center;
                    .avatar{
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                    }
                    .user-name{
                        font-size: 14px;
                        color: #606266;
                        margin-left: 8px;
                    }
                }
            }
            .nav-right:hover{
                cursor: pointer;
            }
        }
        .content{
            padding: 13px 13px;
        }
    }
}
</style>