<template >
    <div class="adinput">
           <input type="text" v-model="inputdata" :maxlength="number" :class="`input_normal`" :placeholder="placeholder" @input="changeValue">
           <span>{{inputdata.length}}/{{number}}</span>
    </div>
</template>
<script>
    export default{
        name:'adInput',
       
        props: {
            placeholder:{
             type: String,
                default:''
            },
            value:{
                type: String,
                default:''
            },
            size: {
                type: String,
                default: 'small'
            },
            number:{
                type: Number,
                default:10
            }
        },
        watch:{
            value:{
                handler(newValue,oldValue){
                    this.inputdata = newValue
                },
                deep:true,
                immediate:true
            }
        },
        data() {
            return {
                inputdata:''
            }
        },
        methods: {
            changeValue() {
                this.$emit('input',this.inputdata)
            }
        },
    }
</script>
<style lang="scss" scoped>
    .adinput{
        overflow: hidden;
        width: 100%;
        background: #fff;
        line-height: 32px;
        position: relative;
        box-sizing: border-box;
        .input_normal{
            outline: none;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            display: block;
            width: 100%;
            line-height: 32px;
            padding:0 15px;
            box-sizing: border-box;
            padding-right: 50px;
            color:#333;
            &:focus{
               border-color: #409EFF
            }
        }
        span{
            position: absolute;
            right: 0;
            top: 0;
            color: #999;
            line-height: 38px;
            padding: 0 6px;
        }
    }

</style>
<style lang="scss">
    .is-error{
        input {border-color:#F56C6C!important ;}
        .adinput + div{
            margin-top: 6px;
        }
    }
</style>
