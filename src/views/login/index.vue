<template>
    <el-form class="login-wrapper" ref="userForm" :model="loginForm" :rules="loginRules">
        <div class="title-box">
            <h3>ThinkJSAdmin</h3>
        </div>
        <div class="form-box">
            <el-form-item prop="account">
                <el-input 
                placeholder="账号" 
                type="text" 
                v-model="loginForm.account"
                clearable>
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <svg-icon name="user" color="#c0c4cc"></svg-icon>
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input 
                placeholder="密码" 
                type="text" 
                v-model="loginForm.password"
                show-password>
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <svg-icon name="password" color="#c0c4cc"></svg-icon>
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="handleLogin">登 录</el-button>
        </div>
    </el-form>
</template>

<script>
import router from '../../router'
export default {
    name: 'Login',
    data(){
        return {
            loginForm: {
                account: '',
                password: ''
            },
            loginRules: {
                account: [{ required: true, trigger: 'blur',message: '请输入登录账号' }],
                password: [{ required: true, trigger: 'blur',message: '请输入登录密码' }]
            },
            loading: false
        }
    },
    created(){
        document.onkeyup = e => {
            if (e.keyCode === 13 && e.target.baseURI.match(/login/)) {
                this.handleLogin()
            }
        }
    },
    methods: {
        handleLogin(){
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$api.login(this.loginForm).then(result => {
                        this.$store.commit('LOGIN', result.data)
                        this.loadRoutes(result.data.menu_tree)
                        this.$router.push('/welcome')
                    }).catch(() => {
                        this.loading = false
                    })
                }else{
                    return false
                }
            })
        },
        loadRoutes(array){
            // 递归加载component
            const deep = (item) => {
                item.forEach(v => {
                    let url = ''
                    if(v.component){
                        url = `../${v.component}.vue`
                    }else{
                        url = '../../layout/route-view.vue'
                    }
                    v.component = () => import(url)
                    if(v.children.length > 0){
                        deep(v.children)
                    }
                })
            }
            deep(array)
            // 动态添加路由
            array.forEach(v => {
                router.addRoute('home',v)
            })
        }
    }
}
</script>

<style lang="scss">
.login-wrapper{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #304156;
    .title-box{
        color: #FFFFFF;
        margin-bottom: 60px;
    }
    .form-box{
        width: 400px;
    }
}
</style>