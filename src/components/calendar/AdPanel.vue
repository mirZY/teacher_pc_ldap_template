<template >
    <div :class="`panel ${['class']}`">
        <div :class="`panel_header header_${color}`">
            <div> <i v-if="icon" :class="`${icon}`"></i>
            <span>{{name}}</span>
            </div>
        </div>
        <div class="kong" v-if="JSON.stringify(data) == '{}'|| !data.class_day&&data.stop_class_day.length == 0">该季度还没有停课日哟！</div>
        <ul class="panel_part_1" v-if="format== 'normal' || format== 'complex'">
            <!-- <div v-if="JSON.stringify(data)  !== '{}'&&class_day.length === 0">0</div> -->
            <li v-for="(item,index) in class_day" :key="index" :class="`${class_day.length === 1 ? 'special':''}`">
                <label v-if="format== 'normal'">第{{mark == "special"?index:index+1}}期</label> <label v-else for="">-</label>
                <div><span>{{`${item.begin_time == item.end_time?item.begin_time:item.begin_time+'至'+item.end_time}`}}</span></div>
            </li>
        </ul>
        <div class="panel_part_2">
            <slot></slot>
            <ad-panel-item :color="color" :disabled="disabled" @opear="opear" :order="index" v-for="(item,index) in stop_class_day" :key="index"> 
                <el-tooltip class="item" effect="dark" popper-class="popperClass" :content="`${typeof item.begin_time === 'string'?item.begin_time:formatTime(item.begin_time,'yyyy-MM-dd')}至${typeof item.end_time === 'string'?item.end_time:formatTime(item.end_time,'yyyy-MM-dd')} ${item.remark}`" placement="top-start">
                    <div>
                        {{typeof item.begin_time === 'string'?item.begin_time:formatTime(item.begin_time,'yyyy-MM-dd')}}至{{typeof item.end_time === 'string'?item.end_time:formatTime(item.end_time,'yyyy-MM-dd')}} {{item.remark}}
                    </div> 
                </el-tooltip>
            </ad-panel-item>
        </div>
    </div>
</template>
<script>
import   AdPanelItem  from './AdPanelItem'
import {formatTime} from "@tools"
    export default{
       name:"adPanel",
       components: {
           AdPanelItem,
       },
        props: {
             mark:{
                type:String, // simple,complex，auto，normal
                default:''
            },
            format:{
                type:String, // simple,complex，auto，normal
                default:'normal'
            },
            disabled:{
                type:Boolean,
                default:true
            },
            name: {
                type: String,
                default: ""
            },
            color:{
                type:String,
                default:''
            },
            icon: {
                type:String,
                default:""
            },
            data: {
                type:Object,
                default(){
                    return {}
                }
            }

        },
        computed: {
            timeList() {
                return this.data 
            },
            class_day(){
                return this.data.class_day || []
            },
             stop_class_day(){
                return this.data.stop_class_day || []
            }
        },
        data() {
            return {
                tipVisibles:[]
            }
        },
        methods:{
            formatTime,
            opear(val){
                console.log(val);
                this.$emit('opear',val)
            }
        }
       
    }
</script>
<style lang="scss" scoped>
.panel{
    overflow: hidden;
    width: 100%;
    border: 1px solid #eee;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    margin-top: -1px;
    position: relative;
    min-height: 78px;
   
    >.kong{
        position: absolute;
        left: 70px;
        top: 50%;
        line-height: 32px;
        height: 32px;
        margin-top: -16px;
        color: #999;
        font-size: 14px;
    }
    &:first-child{
        margin-top: 0;
    }
    .panel_header{
        width: 64px;
        min-height: 54px;
        border-right: 1px solid #eee;
        position: relative;
        color: #fff;
        font-size: 14px;
        &.header_success{
            background: #C1DB88;
        }
         &.header_warning{
            background: #FFCA6E;
        }
         &.header_primary{
            background:#89ADF9 ;
        }
         &.header_main{
            background: #9F81B1;
        }
        >div{
            height: 30px;
            position: absolute;
            top: 50%;
            width: 100%;
            margin-top: -15px;
            text-align: center;
            span{
                display: block;
                width: 100%;
                text-align: center;
            }
        }
        
        
    }
    .panel_part_1{
        width: 300px;
        float: left;
        position: relative;
        height: auto;
        min-height: 40px;
        border-right: 1px solid #eee;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &:before{
            content: "";
            height: 100%;
            width: 1px ;
            background: #eee;
            position: absolute;
            left: 50px;
        }
        >div{
           position: absolute; 
           height:30px;
           width: 100%;
           text-align: center;
           line-height: 30px;
           margin-top: -15px;
           top: 50%;
           z-index: 9;
        }
        li{
            overflow: hidden;
            border-bottom: 1px solid #eee;
            // border-right: 1px solid #eee;
            line-height: 76px;
            min-height: 76px;
            &.special{
                line-height: 76px;
            }
            &:last-child{
                border-bottom: 0;
            }
            label{
                float: left;
                flex: 1;
                min-width: 50px;
                display: block;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            div{
                text-align: center;
                box-sizing: border-box;
                color:#333;
                font-size: 14px;
                span{
                    padding: 0 10px;
                }
            }
        }
    }
    .panel_part_2{
        overflow: hidden;
        float: left;
        min-height: 40px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        flex:1;
        >div{
            overflow: hidden;
            float: left;
            width: 48%;
            line-height: 54px;
            height: 54px;
            border: 1px solid #eee ;
            border-radius: 4px;
            color: #333;
            font-size: 14px;
            margin-bottom: 10px;
            &:nth-child(2n){
                float: right;
            }
            span{
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
    }
    
}
</style>
<style lang="scss">
.popperClass{
    background: #fff !important;
    color: #333 !important;
    border: 1px solid #eee;
    .popper__arrow{
        background: #fff !important;
    }
}
</style>