<template>
    <div class="container">
        <el-header/>
        <div class="main-info">
            <div class="leftAside">
                <el-aside/>
            </div>

            <div class="main">
                <!-- <navigation> -->
                    <router-view/>
                <!-- </navigation> -->
            </div>
        </div>
    </div>
</template>

<script>
import elHeader from './Header'
import elAside from './Aside'
export default {
    name: "Layout",
    components: {
        elHeader,
        elAside
    }
}
</script>

<style lang="scss">
.container {
    height: 100vh;
    background: #F9FAFB;

    .main-info {
        display: flex;

        .leftAside {
            width: 200px;
        }

        .main {
            width: 80%;
            margin-left: 60px;
            padding-top: 30px;
        }
    }
}
</style>