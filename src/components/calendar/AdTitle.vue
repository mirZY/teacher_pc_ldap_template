<template>
      <div class="title_show">
      <h2>{{title}}</h2>
      <div class="opear">
        <slot></slot>
      </div>
    </div>
</template>
<script>
export default {
    name:'adTitle',
    props: {
        title: {
            type: String,
            default: ''
        },
    },
    
}
</script>
<style lang="scss" scoped>
     .title_show{
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
    background: #ffffff;
    font-size: 20px;
    >h2{
      min-width: 200px;
      font-size: 24px;
      float: left;
      line-height: 60px;
    }
    >div{
      min-width:300px ;
      float: right;
      height: 32px;
      padding-top: 16px;
      button{
        float: right;
        margin-left: 10px;
      }
    }
  }
</style>