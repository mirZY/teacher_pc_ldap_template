<template>
  <section class="btn-group">
    <div
      :class="`${mt === item.id? 'active':''}`"
      v-for="(item,index) in value"
      :key="index"
      @click="clickHandle(item.id)"
    >{{ item.name }}</div>
  </section>
</template>
<script>
export default {
  name: "AdButtonGroup",
  props:{
      mark:{
          type:[Number,String],
          default:0
      },
      value:{
          type:Array,
          default(){
              return []
          }
      }
  },
  data() {
    return {
        mt:0
    };
  },
  watch:{
      mark:{
          deep:true,
          immediate:true,
          handler(n,o){
              this.mt = this.mark
          }
      }
  },
  methods: {
    clickHandle(index) {
        this.mt = index
        this.$emit('callback',index)
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-group{
    overflow: hidden;
    width: 100%;
    display: flex;
    font-size: 14px;
    div{
        width: 100%;
        height: 32px;
        line-height: 32px;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid #eee;
        margin-left: -1px;
        cursor: pointer;
        color: #666;
        &.active{
            border-color: #3C0060;
            margin-right: 1px;
            color: #3C0060;
        }
        &:last-child{
           border-top-right-radius: 4px; 
           border-bottom-right-radius: 4px; 
        }
         &:first-child{
           border-top-left-radius: 4px; 
           border-bottom-left-radius: 4px; 
           margin-left: 0;
        }
    }
}
</style>