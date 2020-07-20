<template>
     <div class="panel_type">
        <span :class="`block_${color}`" ></span> <slot></slot>
        <i class="el-icon-delete el-text--main last" v-if="!disabled" v-popover:popover1></i>
        <i class="el-icon-edit-outline el-text--main" @click="opearHander('edit')"  v-if="!disabled"></i>
        <el-popover
        v-if="!disabled"
        ref="popover1"
        placement="top-start"
        width="200"
        trigger="click"
        v-model="pop"
        >
        <p class="pop_title"><i class="el-icon-warning"></i>确定删除该段停课日吗?</p>
        <div style="text-align: right; margin: 0">
            <el-button type="info" class="el-button--main" size="mini" @click="popClick">确定</el-button>
            <el-button size="mini"   isplain @click="pop = false">取消</el-button>
        </div>
        </el-popover>
    </div>
</template>
<script>
export default {
    name:"AdPanelItem",
    props:{
        noshow:{
            type:Boolean,
            default:true
        },
        order:{
            type: Number,
            default:''
        },
        color:{
                type:String,
                default:''
            },
       text:{
           type:String,
           default:''
       },
       disabled:{
           type:Boolean,
           default:false
       } 
    },
    data(){
        return {
            pop:false
        }
    },
    methods: {
        opearHander(status) {
               this.$emit("opear",{type:status,order:this.order}) 
        },
        popClick(){
            this.pop= false
            this.$emit("opear",{type:'deleted',order:this.order}) 
        }
    },
}
</script>
<style lang="scss" scoped>
    div.panel_type{
            &:hover{
                background: rgba(#FFAC18, 0.2);
            }
            >div{
                width: 80%;
                float: left;
            }
            overflow: hidden;
            cursor: pointer;
            float: left;
            width: 100%;
            line-height: 54px;
            height: 54px;
            border: 1px solid #eee ;
            border-radius: 4px;
            color: #333;
            font-size: 14px;
            margin-bottom: 10px;
            >i{
                float: right;
                line-height: 54px;
                margin: 0 6px;
                cursor: pointer;
                &.last{
                    margin-right: 26px;
                }
            }
            &:nth-child(2n){
                float: right;
            }
            p{
                line-height: 32px;
            }
            >span{
                &:last-child{
                    display: none;
                }
                 &.block_success{
                    background: #C1DB88;
                }
                &.block_warning{
                    background: #FFCA6E;
                }
                &.block_primary{
                    background:#89ADF9 ;
                }
                &.block_main{
                    background: #9F81B1;
                }
                height: 40px;
                width: 3px;
                background: #ccc;
                float: left;
                margin-right:7px ;
                margin-top: 7px;
               
            }
        }
</style>
<style lang="scss">
 .pop_title{
     line-height: 32px;
     padding-bottom: 10px;
     i{
         color:#FFCA6E ;
         margin-right: 6px;
     }
 }
</style>