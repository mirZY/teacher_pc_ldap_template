<template>
<div>
<div :class="`${format === 'normal'?'adstep':'adstepspecial'}`" v-if="format === 'normal'">
    <section class="step" v-for="(item,index) in stepData" :key="index" >
      <span v-if="step>index">
        <i :class="`${step > index?'active_index el-icon-check':''} `"></i>
      </span>
      <span v-if="step!==index&&step<index">
        <i>{{index+1}}</i>
      </span>
      <span v-if="step==index">
        <i :class="`${step === index?'active':''}`">{{step==index?index+1:''}}</i>
      </span>
      <label for :class="`${step === index?'active':''}`">{{item.label|| item}}</label>
    </section>
  </div>
  <div :class="`${format === 'normal'?'adstep':'adstepspecial'}`" v-else>
    <section
      class="stepspecial"
      v-for="(item,index) in stepData"
      :key="index"
      v-show="format === 'special'"
    >
      <div :class="`${step < index ?'hui':'' }`">
        <span  v-if="index>step" >{{index+1}}</span>
        <span v-else :class="`${step>index?'el-icon-check active':''}`"> {{step>index?'':index+1}}</span>
        {{item.label|| item}}
      </div>
      <span class="remark-right" v-if="index!==stepData.length-1"></span>
    </section>
  </div>
</div>
  
</template>
<script>
export default {
  name: "adStep",
  props: {
    format: {
      type: String,
      default: "normal"
    },
    step: {
      type: Number,
      default: 0
    },
    stepData: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>

.adstep {
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
  justify-content: space-between;
  &:before {
    content: "";
    width: 100%;
    height: 1px;
    position: absolute;
    background: #ccc;
    z-index: 0;
    left: 0;
    top: 50%;
  }
  .step {
    overflow: hidden;
    height: 38px;
    width: 260px;
    color: #ccc;
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
    span {
      text-align: center;
      width: 50px;
      height: 36px;
      display: block;
      font-size: 16px;
      background: #fff;
      line-height: 36px;
      i {
        width: 36px;
        height: 36px;
        display: block;
        font-style: normal;
        border-radius: 50%;
        border: 1px solid #cccccc;
        margin: 0 auto;
        &.active {
          color: #fff;
          background: #774c90;
          border: 1px solid #774c90;
          font-weight: 500;
        }
        &.active_index {
          border-color: #774c90;
          color: #774c90;
          font-size: 24px;
          line-height: 36px;
        }
      }
    }
    label {
      padding-right: 12px;
      line-height: 36px;
      background: #fff;
      color: #999;

      &.active {
        font-weight: 600;
        color: #333;
      }
    }
    &:first-child {
      overflow: hidden;
      display: flex;
      justify-content: flex-start;
    }
    &:last-child {
      overflow: hidden;
      display: flex;
      justify-content: flex-end;
      div {
        width: 0;
      }
    }
  }
}
.adstepspecial {
  overflow: hidden;
  display: flex;
  .stepspecial {
    width: 50%;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    margin-right: 68px;
    background: #e6e4f3;
    display: flex;
    position: relative;
    &:first-child {
      margin-right: 0;
      .remark-right {
      position: absolute;
      right: -20px;
      border-top: 24px solid #fff;
      border-right: 24px solid #fff;
      top: -12px;
      width: 60px;
      z-index: 9;
      height: 60px;
      display: block;
      background: #e6e4f3;
      transform: rotate(45deg);
    }
    }
    &:last-child {
      margin-right: 0;
    }
    > div {
      text-align: center;
      width: 100%;
      font-size: 22px;
      color: #333;
      span{
        width: 34px;
        height: 34px;
        display: inline-block;
        background: #3c0060;
        color: #fff;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        line-height: 30px;
        margin-right: 6px;
        box-sizing: border-box;
        border: 1px solid #3c0060;
        &.el-icon-check{
          background: rgba(#000,0);
          color:#3c0060 ;
        }
      }
      &.hui {
        background: #ececec;
        color: #999;
          span {
            width: 34px;
            height: 34px;
            display: inline-block;
            text-align: center;
            color: #999;
            border-radius: 50%;
            line-height: 30px;
            margin-right: 6px;
            border: 1px solid #999;
            background: rgba(#000,0);
            &.active {
              background: rgba(0, 0, 0, 0);
              border: 1px solid #3c0060;
              color: #3c0060;
            }
          }
        }
  }
}
}
</style>