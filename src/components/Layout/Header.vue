<template>
    <div class="header">
        <img src="../../assets/logo.png" alt="">
        <span class="header-line"></span>
        <span class="header-name">教务管理系统</span>
        <div class="header-right">
            <!-- <img src="../../assets/logo.png" alt=""> -->
            <span>{{userInfo.sn}}{{userInfo.givenName}}</span>
            <el-button type="text" class="logout" @click="LoginOut">退出登录</el-button>
        </div>
    </div>
</template>
<script>
import { teacherLogin } from '@/api/index'
import { removeToken } from '@/utils/tools';
export default {
    name: 'Header',
    data() {
        return {
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfols;
        },
    },
    methods: {
        LoginOut() {
            this.$confirm("请确认是否要退出登录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                this.$store.dispatch('Logout');
                window.location.href = `${process.env.VUE_APP_API_MANAGER}/teacherauth/ldap/logout`;
            })
            .catch(() => {});
            }
        }
}
</script>
<style lang="scss">
    .header{
        overflow: hidden;
        background: #fff;
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
        border: 1px solid #e5e6ed;
        box-shadow: 0px 2px 3px 0px rgba(233,232,244,0.59); 
        position: relative;

        img {
            width: 126px;
            height: 37px;
            vertical-align: middle;
        }

        .header-name {
            vertical-align: middle;
            color: #3C0060;
            font-size: 14px;
        }

        .header-line {
            margin: 0 10px;
            display: inline-block;
            width: 1px;
            height: 13px;
            background: #3c0060;
            vertical-align: middle;
        }

        .header-right {
            position: absolute;
            right: 30px;
            top: 0;
            height: 60px;
            line-height: 60px;
            font-size: 14px;


            img {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                vertical-align: middle;
                margin-right: 30px;
            }

            .logout {
                margin-left: 30px;
                border: none !important;
                font-size: 14px !important;
                font-weight: normal !important;
            }
        }
    }
</style>