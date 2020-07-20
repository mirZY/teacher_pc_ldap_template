<template>
  <div class="ad-table">
    <div :class="`schedule-table ${format=='detail'?'detail':''}`" v-if="format=='detail'">
      <div class="scheule-header">
        <span>{{scheduleTitle}}</span>
        <ul>
          <li v-for="(block,index) in scheduleBlock" :key="index">
            <span :class="block.color"></span>
            <label v-html="block.name"></label>
          </li>
        </ul>
      </div>
      <ul class="schedule-tab">
        <li
          v-for="(item,index) in scheduleData"
          :key="item.period"
          @click="markClick(index)"
          :class="`${index==mark?'active':''}`"
        >
        <span :class="`${computedStatusd(item.lesson_data,10)?'confict':'timeout'} `" v-if="computedStatusd(item.lesson_data,10)||computedStatusd(item.lesson_data,9)"></span>{{ scheduleType==2 || scheduleType == 4 ?`${weekChange(item.period)}`:`第${scheduleType == 1?item.period:item.period-1}期`}}</li>
      </ul>
      <section class="schedule-month" >
          <div></div>
          <div v-for="(m,key) in month" :key="key" >{{key}}月</div>
      </section>
      <div class="overview">
        <section>
          <div></div>
          <div v-for="(schedulex,index) in scheduleX" :key="index">
            <span>{{schedulex}}</span>
          </div>
        </section>
         <section class="body" v-for="(m,key) in month" :key="key">
             <div :value="lesson" v-for="(lesson,keys) in m" :key="keys">
                   <div class="block">
                       <!-- <el-tooltip v-if="remakShow(lesson,keys)" class="item" effect="dark" :content="remakShow(lesson,keys)" placement="top-start">
                          <span>{{keys.slice(-2)}}</span>
                        </el-tooltip> -->
                          {{keys.slice(-2)}}
                    </div>
                    <ad-block :value="lesson" :mark="keys" @deleteOpear="callback"></ad-block>
             </div>
        </section>
      </div>
    </div>
    <div class="schedule-table" v-else>
      <div class="scheule-header">
        <span>{{scheduleTitle}}</span>
        <ul>
          <li v-for="(block,index) in scheduleBlock" :key="index">
            <span :class="block.color"></span>
            <label v-html="block.name"></label>
          </li>
        </ul>
      </div>
      <div class="overview">
        <section>
          <div></div>
          <div v-for="(schedulex,index) in scheduleX" :key="index">
            <span>{{schedulex}}</span>
          </div>
        </section>
        <section v-for="(item) in scheduleData" :key="item.period">
          <div>
            <span class="confict" v-if="computedStatus(item.lesson_data,10)">时间冲突</span>
            <span class="timeout" v-if="computedStatus(item.lesson_data,9)">时间紧张</span>
            {{scheduleType==2|| scheduleType==4?`${weekChange(item.period)}`:`第${scheduleType==1?item.period:item.period-1}期`}}
          </div>
          <div>
            <ul class="overview-body" >
                <ad-table-item :value='item.lesson_data' ></ad-table-item>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import AdTableItem from './AdTableItem'
import AdBlock from './AdBlock'
export default {
  name: "adTable",
  components:{
      AdTableItem,
      AdBlock
  },
  props: {
    scheduleData: {
      type: Array,
      default() {
        return {};
      }
    },
    scheduleTitle: {
      type: String,
      default: ""
    },
    scheduleBlock: {
      type: Array,
      default() {
        return [];
      }
    },
    scheduleX: {
      type: Array,
      default() {
        return [
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00"
        ];
      }
    },
    format: {
      type: String,
      default: ""
    },

    // scheduleY:{
    //     type: Object,
    //     default(){
    //         return []
    //     }
    // },
    scheduleType: {
      type: [String,Number],
      default: ""
    }
  },
  watch:{
      scheduleData:{
          deep:true,
          immediate:true,
          handler(newvalue,oldvalue){
              this.handleData()
              this.mark = 0
          }
      }
  },
  data() {
    return {
      mark: 0,
      month:{}
    };
  },
  methods: {
    remakShow(lesson,key){
      let data =lesson.length>0 
      return lesson.length>0&& lesson.filter(data =>{
        return data.schedule_id == '4' && data.remark
      }).length>0
    },
    callback(obj){
      this.$emit('deletedOpear',obj)
    },
    weekChange(index){
      const week = {
        '1':"周一",
         '2':"周二",
          '3':"周三",
           '4':"周四",
            '5':"周五",
             '6':"周六",
              '7':"周日",
      }
      return week[index]
    },
     computedStatusd(val,mark){
      let data = Object.keys(val)
      let status = data.some(item => {
        return val[item]&& val[item].some(it =>{
          return it.conflict_type == mark
        })
      })
      return  status
    },
    computedStatus(val,mark){
      if(val.length>0){
            let status = val.some(item => {
              return item.conflict_type&&item.conflict_type.split(',').some(item =>{
               return  item == mark
              })
            })
      return  status
      } else {
        return false
      }
     
    },
    markClick(index) {
      this.mark = index;
      this.handleData(index)
    },
    handleData(mark = 0){
        if(this.scheduleData.length == 0){
            return false
        }
      let data = this.scheduleData[mark].lesson_data
      let keys = Object.keys(data)
      let month = {}
      keys.forEach(item=>{
          let m =  new Date(item).getMonth()+1
          if(!month[m]){
            month[m] ={}
          } 
      })
  
    for (const key in data) {
       let d =  new Date(key).getMonth()+1
       month[d][key] = data[key]
    }
      this.month = month
    }
  }
};
</script>
<style lang="scss" scoped>
ul,
li {
  list-style: none;
}
.schedule-month{
    display: flex;
    border: 1px solid #ddd;
    margin-bottom: -1px;
    div{
        width: 100%;
        text-indent: 1em;
        line-height: 25px;
        height: 25px;
        border-left: 1px solid #ddd;
        &:nth-child(2){
            border: 0;
        }
        color: #333;
        font-size: 12px;
        &:first-child{
            flex: 0 0 90px;
            border-left: 0;
        }
    }
}
.overview-body{
    display: flex;
    flex-direction: column;
    
}
.ad-table {
  overflow: hidden;
  .lesson {
    background: #a9c1ff;
  }
  .booklesson {
    background: #dde6ff;
  }
  .city {
    background: #dddddd;
  }
  .nobook {
    background: #ececec;
  }
  .confict {
    background: #e77878;
  }
  .timeout {
    background: #ffb154;
  }
  .schedule-tab {
    overflow: hidden;
    li {
      float: left;
      cursor: pointer;
      line-height: 40px;
      width: 130px;
      border-radius: 10px 10px 0pt 0pt;
      border: 1px solid #ddd;
      text-align: center;
      margin-right: 10px;
      color: #999;
      font-size: 16px;
      margin-bottom: -1px;
      position: relative;
      span{
        display: inline-block;
        width: 8px;
        height: 8px;
        position: absolute;
        right: 8px;
        top: 8px;
        border-radius: 50%;
      }
      &.active {
        color: #6c37a0;
        font-weight: 500;
        position: relative;
        &::before {
          content: "";
          bottom: 0;
          left: 50%;
          width: 40px;
          height: 2px;
          background: #6c37a0;
          margin-left: -20px;
          position: absolute;
        }
      }
    }
  }
  .overview {
    overflow: hidden;
    border: 1px solid #ddd;
    display: flex;
    >section {
      &:first-child{
     font-size: 14px;
        div:first-child{
          height: 40px !important;
        }
      }
      border-right: 1px solid #ddd;
      &.body{
          border-right:1px solid #ddd !important;
          &:last-child{
              border: 0 !important;
          }
          display: flex;
          flex-direction: row !important;
          >div{
              width: 100%;
              overflow: hidden;
              height: auto !important;
              display: flex;
              flex-direction: column;
              border-right: 1px #ccc dotted;
              border-bottom:0;
              &:last-child{
                border-right: 0;
                  .adblock{
                      border-right: 0;
                  }
              }
          }
      }
      &:last-child{
          border-right:0;
      }

      display: flex;
      flex-direction: column;
      &:first-child {
        flex: 0 0 200px;
        >div{
            height: auto;
            &:nth-child(2){
                line-height: 80px;
                border-bottom-style: solid;
            }
             &:nth-child(3){
                line-height: 80px;
                border-bottom-style: solid;
            }
            &:last-child{
                height: 40px;
            }
        }
        span {
          top: -13px;
        }
      }
      width: 100%;
      >div {
        line-height: 40px;
        height: 80px;
        justify-content: center;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #ddd;
        display: flex;
        &:first-child {
          position: relative;
          height: 40px;
          color: #999;
          span {
            position: absolute;
            left: 0;
            height: 20px;
            line-height: 20px;
            width: 56px;
            color: #fff;
            font-size: 12px;
            &:first-child {
              top: 0;
            }
            &:last-child {
              bottom: 0;
            }
          }
        }
        ul {
          width: 100%;
          li {
            line-height: 40px;
            height: 40px;
            border-bottom: 1px solid #ddd;
          }
        }
        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
  .schedule-table {
    margin-top: 20px;
    overflow: hidden;
    box-sizing: border-box;
    &.detail {
      .overview {
        >section{
        border-right-style: dotted;
         >div{
             height: 40px;
             box-sizing: border-box;
            color: #666;
            // border: 0;
         }
          &:first-child {
          flex: 0 0 90px;
          >div {
            border-color: #fff;
            height: 40px;
            position: relative;
            box-sizing: border-box;
            &:first-child{
                height: 40px;
                span{
                    background: #fff;
                    font-size: 16px;
                }
            
            }
            &:nth-child(2){
             height: 40px!important;
             line-height: 40px;
            }
            &:nth-child(3){
             height: 40px!important;
             line-height: 40px;
            }
            span {
              position: absolute;
              line-height: 30px;
              color: #666;
            }
          }
        }
      }
    }
    }
    .scheule-header {
      overflow: hidden;
      line-height: 38px;
      > span {
        font-size: 22px;
        color: #333;
      }
      ul {
        overflow: hidden;
        float: right;
        line-height: 46px;
        li {
          float: left;
          overflow: hidden;
          color: #666;
          label{
            font-size: 14px;
          }
          span {
            width: 20px;
            height: 20px;
            float: left;
            display: block;
            margin: 0 10px;
            margin-top: 14px;
          }
        }
      }
    }
  }
}
</style>