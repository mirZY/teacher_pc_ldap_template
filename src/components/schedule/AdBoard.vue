<template>
    <div class="adBorad">
        <div class="borad-title">
            {{title}}
        </div> 
        <div class="borad-body">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name:"adBoard",
    props: {
        title: {
            type: String,
            default: ''
        },
    },
}
</script>
<style lang="scss" scoped>
    .adBorad{
        overflow: hidden;
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #eee;
        .borad-title{
            line-height: 50px;
            background:#FAFAFA ;
            font-size:16px ;
            color: #333;
            box-sizing: border-box;
            padding: 0 20px;
        }
         .borad-body{
            box-sizing: border-box;
            min-height: 40px;
            padding: 20px;
        }
    }
</style>