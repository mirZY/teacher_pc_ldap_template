<template>
    <div class="aside">
        <el-menu
            :unique-opened="false"
            :collapse-transition="false"
            min-height="550px"
            mode="vertical"
            :default-active="$route.path"
            class="menu-info"
        >
            <div v-for="route in routes"
                :key="route.path"
                class="route-item"
                >
                <el-submenu v-if="route.children">
                    <template slot="title">
                        {{route.tag_name}}
                    </template>
                    <router-link v-for="(item, index) in route.children"  :key="index" :to="item.path" class="link-item">
                        <el-menu-item  :index="item.path">{{item.tag_name}}</el-menu-item>
                    </router-link>
                </el-submenu>   
                
                <router-link v-else :to="route.path === '/lesson'?'/schedule':route.path" class="link-item">
                    <img v-if="route.path == '/user'" src="../../assets/ico-user.png" alt="">
                    <img v-if="route.path == '/role'" src="../../assets/ico-role.png" alt="">
                    <img v-if="route.path == '/teacher'" src="../../assets/ico-teacher.png" alt="">
                    <img v-if="route.path == '/calendar'" src="../../assets/ico-calendar.png" alt="">
                    <img v-if="route.path == '/lesson'" src="../../assets/ico-schedule.png" alt="">
                    <el-menu-item :index="route.path">{{route.tag_name}}</el-menu-item>
                </router-link>
            </div>
        </el-menu>
    </div>
</template>
<script>
export default {
    name: 'Aside',
    data() {
        return {
            // routes: []
        }
    },
    computed: {
        routes() {
            return this.$store.getters.menu;
        },
    },
    created() {
    }
}
    
</script>
<style lang="scss">
.aside {
    width: 240px;
    min-height: 700px;
    padding-top: 20px;

    .el-menu {
        border-right: none !important;
    }

    .menu-info {
        min-height: 700px;
    }
    .route-item {
        position: relative;
        .link-item {
        text-decoration: none;
        // position: relative;

        img {
            display: inline-block;
            vertical-align: middle;
            position: absolute;
            left: 30px;
            top: 20px;
            width: 18px;
            height: 18px;
            z-index: 9999;
        }   
    }
    }
    
}
</style>