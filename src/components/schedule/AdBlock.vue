<template >
  <section class="adblock">
    <div
      :class="`show-block ${color(item.schedule_type)} ${item&&item.other_city&&item.other_city == 5 ?'city':''}`"
      :style="{top:item.y+'px',height:item.h+'px',zIndex:color(item.schedule_type)== 9||color(item.schedule_type)== 9==10?2+index:indexShow(item.schedule_type)}"
      v-for="(item,index) in zuhe"
      :key="item.id"
    > <div
      @click="getData(item)"
        :class="` show-blockt ${item.conflict_type == '9'?'timeout ':'confict'}`"
        :style="{top:item.ys-item.y+'px',height:(item.hs)+'px',zIndex:2+index}"
        v-if="item.conflict_type == '9'|| item.conflict_type == '10'"
      >
       <el-popover>
      <section class="blockBody width-400">
        <div class="title">
          <span  :class="`${item.conflict_type == 10 ?'confict':'timeout'}`"></span>
          <span
          >
           {{`${item.conflict_type == '10'?formatTime(new Date(item.start_at*1000),'hh:mm'):''}${item.conflict_type == '10'?'~':''}${item.conflict_type == '10'?formatTime(new Date((parseInt(item.start_at)+item.conflict_time)*1000),'hh:mm'):''}`}}{{item.conflict_type == '10' ?'【时间冲突】':'两校区课程间隔不足30分钟'}}
          </span>
        </div>
        <section class="body-content">
          <div >
             <el-row class="body-li">
              <el-col :span="24">{{item.schedule_type == 1?item.class_name:''}}{{item.schedule_type == 2?'预约排课':''}}{{item.schedule_type == 3?item.remark:''}} </el-col>
            </el-row>
             <el-row class="body-li">
              <el-col
                :span="24"
              > {{item.class_no?item.class_no:'--'}}</el-col>
            </el-row>
            <el-row class="body-li">
              <el-col
                :span="24"
              > {{item.school_name?item.school_name:'--'}}</el-col>
            </el-row>
             <el-row class="body-li">
              <el-col
                :span="24"
              > {{item.campus_name?item.campus_name:'--'}}</el-col>
            </el-row>
             <el-row class="body-li">
              <el-col
                :span="24"
              > {{item.campus_position_name?item.campus_position_name:'--'}}</el-col>
            </el-row>
          </div>
           <div >
              <el-row class="body-li">
              <el-col :span="24">{{conflictData.schedule_type == 1?conflictData.class_name:''}}{{conflictData.schedule_type == 2?'预约排课':''}}{{conflictData.schedule_type == 3?conflictData.remark:''}} </el-col>
            </el-row>
             <el-row class="body-li">
              <el-col
                :span="24"
              > {{conflictData.class_no?conflictData.class_no:'--'}}</el-col>
            </el-row>
            <el-row class="body-li">
              <el-col
                :span="24"
              > {{conflictData.school_name?conflictData.school_name:'--'}}</el-col>
            </el-row>
             <el-row class="body-li">
              <el-col
                :span="24"
              > {{conflictData.campus_name?conflictData.campus_name:'--'}}</el-col>
            </el-row>
             <el-row class="body-li">
              <el-col
                :span="24"
              > {{conflictData.campus_position_name?conflictData.campus_position_name:'--'}}</el-col>
            </el-row>
          </div>
        </section>
      </section>
      <span slot="reference" class="font-block"  :style="{top:item.ys-item.y+'px',height:(item.hs)+'px',zIndex:2+index}">
      </span>
    </el-popover>
      </div>
       <el-tooltip class="item" effect="dark" :content="item.remark" placement="top" v-if="item.schedule_type == 4">
       <span :style="{height:item.h+'px'}" class="block-remark" ></span>
    </el-tooltip>
    <el-popover v-if="item.schedule_type != 4">
      <section class="blockBody">
        <div class="title">
          <span :class="`${color(item.schedule_type)} ${item.ohter_city == 5?'city':''}`"></span>
          <p v-if="item.lesson_type ==1">
            线上直播 {{item.class_no}}
          </p>
          <p
          v-else
          > {{item.schedule_type == 4 ? '停课日':''}}
            {{item.schedule_type == 1 || item.schedule_type == 5  ? item.class_name:''}}<i>{{item.class_no}}</i>
            {{item.schedule_type == 2 ?'预约排课':''}}
            {{item.schedule_type == 3 ?item.remark:''}}
          </p>
        </div>
        <section class="body-content kong">
          <div >
             <el-row class="body-li" v-if="item.schedule_type==3">
              <el-col :span="8" >不排课城市</el-col>
              <el-col :span="16">全部城市 </el-col>
            </el-row>
            <el-row class="body-li" v-if="item.schedule_type!=3">
              <el-col :span="8" >上课地点</el-col>
              <el-col :span="16">{{`${item.school_name?item.school_name:''} ${item.campus_name?item.campus_name:''} ${item.campus_position_name?item.campus_position_name:''} `}} </el-col>
            </el-row>
            <el-row class="body-li">
              <el-col :span="8">上课时间</el-col>
              <el-col
                :span="16"
              > {{weekStatus(item)}}{{formatTime(new Date(item.begin_time*1000),'hh:mm')}}~{{formatTime(new Date(item.end_time*1000),'hh:mm')}}</el-col>
            </el-row>
            <el-row class="body-li">
              <el-col :span="8">开课日期</el-col>
              <el-col :span="16">{{item.begin_date}}</el-col>
            </el-row>
             <el-row class="body-li" v-if="item.schedule_type != 2 && item.schedule_type!=3">
              <el-col :span="8" >年级</el-col>
              <el-col :span="16">{{item.grade_name}}</el-col>
            </el-row>
               <el-row class="body-li" v-if="item.schedule_type == 2 && item.schedule_sort_name ">
              <el-col :span="8">预约位置</el-col>
              <el-col :span="16">{{item.schedule_sort_name}}</el-col>
            </el-row>
            <el-row class="body-li" v-if="item.schedule_type != 2">
              <el-col :span="8">担任角色</el-col>
              <el-col :span="16">{{item.role}} {{item.schedule_sort_name?'|':''}} {{item.schedule_sort_name}}</el-col>
            </el-row>
            <el-row class="body-li" v-if="item.schedule_type != 3">
              <el-col :span="8">负责课节</el-col>
              <el-col :span="16">{{item.lesson_nums}}</el-col>
            </el-row>
            <el-row class="body-li"  v-if="item.schedule_type == 3">
              <el-col :span="8">天数</el-col>
              <el-col :span="16">{{item.lesson_nums}}</el-col>
            </el-row>
          </div>
        </section>
        <el-row class="body-li" v-if="item.schedule_type == 2 || item.schedule_type == 3">
          <el-col :span="6" :offset="5">
            <el-button plain @click="deleteOpear(item)" size="mini">删除</el-button>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button type="primary" class="el-button--main" size="mini" @click="linkTo(item)">修改</el-button>
          </el-col>
        </el-row>
      </section>
       <!-- <span  v-if="item.schedule_type == 4" :style="{height:item.h+'px'}" :class="`font-12 ${font(item.schedule_type)}`">{{item.campus_name}}</span> -->
      <span slot="reference"  :style="{height:item.h+'px'}" :class="`font-12 ${font(item.schedule_type)} ${item&&item.other_city&&item.other_city?'city':''}`">{{item.lesson_type == 1?"线上直播": item.schedule_type!=3&&item.campus_name?item.campus_name:item.schedule_type!=3&&item.school_name?item.school_name:''}}{{item.schedule_type==3 ? item.remark:''}}</span>
    </el-popover>
    </div>
    <div
      :class="`block ${i == 5 || i == 10 ?'border':''}`"
      v-for="(item,i) in block"
      :key="i"
    ></div>
  </section>
</template>
<script>
import { formatTime } from "@tools";
import {
  lessondetail
} from "@/api/schedule";
export default {
  name: "AdBlock",
  props: {
    mark: {
      type: String,
      default: ""
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    let block = [];
    block.length = 14;
    return {
      block:block,
      conflictData:{},
      zuhe: []
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.choose();
      }
    }
  },
  methods: {
    formatTime,
    indexShow(key = 0){
      const data = {
         "1": 4,
          "2": 3,
          "3": 3,
          "4": 0,
          "9": 9,
          "10": 10
      }
      return data[key]
    },
    weekStatus(item){
      let week =['每周日','每周一','每周二','每周三','每周四','每周五','每周六']
      let frequency_type = item.frequency_type
      return frequency_type == 1 ? week[item.frequency]:'每天'
    },
    async getData(item){
      let value = {
        schedule_id:item.conflict_id
      }
    let data = await lessondetail(value)
    this.conflictData = Object.assign({},data)
    },
    // 删除
    deleteOpear(item,types) {
      this.$emit('deleteOpear',{
        id:item.schedule_id,
        types:item.schedule_type
      })
    },
    // 跳转
    linkTo(item) {
      let name =
        item.schedule_type == 2 ? "bookschedule" : "noschedule";
      this.$router.push({
        name,
        query: {
          schedule_id: item.schedule_id,
          year:item.begin_date.substring(0,4),
          term_id:item.term_type,
          teacher_id:item.teacher_id
        }
      });
    },
     font(key) {
      let fontClass = {
        "1": "lessonfont",
        "2": "booklessonfont",
        "3": "nolessonfont",
        "4": "nolessonfont1",
        "9": "timeoutfont",
        "10": "confictfont"
      };
      if (key) {
        return fontClass[key];
      } else {
        return "kong";
      }
    },
    color(key) {
      let colorClass = {
        "1": "lesson",
        "2": "booklesson",
        "3": "nolesson", //不排课
        "4": "nolesson1", //停课日
        "9": "timeout",
        "10": "confict"
      };
      if (key) {
        return colorClass[key];
      } else {
        return "kong";
      }
    },
    compuedY(time) {
      let date = new Date(time * 1000);
      let hour = date.getHours() - 8;
      let month = date.getMonth();
      let minute = date.getMinutes()*2/3;
      return hour * 40 + minute;
    },
    compuedX(time) {
      let date = new Date(time * 1000);
      let hour = date.getHours() - 8;
      let minute = date.getMinutes()*2/3;
      return hour * 40 + minute;
    },
    compuedH(item) {
      if(item.schedule_type == 4){
        return 560
      }else
      if (item.begin_time && item.end_time) {
        let begin = this.compuedX(item.begin_time);
        let end = this.compuedX(item.end_time);
        return end - begin;
      } else {
        return 0;
      }
    },
    choose() {
      this.zuhe = this.value.map(item => {
        return {
          y: !item.begin_time ? 0 : this.compuedY(item.begin_time),
          ys:item.start_at?this.compuedY(item.start_at):0,
          h: item && item.begin_time || item.schedule_type == 4 ? this.compuedH(item) : 0,
          hs:item.conflict_time?item.conflict_time/90:0,
          ...item
        };
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.block-remark{
  display: block;
}
.font-12{
   display: block;
  width: 100%;
  line-height: 32px;
  height: auto;
  font-size: 12px;
  overflow: hidden;
}
.font-block{
  display: block;
  width: 100%;
  height: auto;
}
.lessonfont {
  color: #3C569A;
}
.booklessonfont {
  color: #002FB1;
}
.cityfont {
  color: #484848;
}
.nolessonfont {
  color: #999999;
}
.confictfont {
  color: #e77878;
}
.timeoutfont {
  color: #ffb154;
}
.lesson {
  background: #a9c1ff;
  z-index: 2;
}
.booklesson {
  background: #dde6ff;
  z-index: 2;
}
.city {
  background: #cccccc;
  z-index: 2;
}
.nolesson {
  background: #ececec;
  z-index: 0;
}
.nolesson1 {
  background: rgba(#ececec,0.5);
  z-index: 0;
}
.confict {
  background: #e77878;
  z-index: 3;
}
.timeout {
  background: #ffb154;
  z-index: 3;
}
.adblock {
  width: 100%;
  position: relative;
  border-right: 1px #ddd dotted;
  &:last-child {
    div {
      border-right: 0;
    }
  }
  .show-blockt{
       position: absolute;
    cursor: pointer;
    left: 0;
    width: 100%;
    z-index: 2;
  }
  .show-block {
    position: absolute;
    cursor: pointer;
    left: 0;
    width: 100%;
  }
  div.block {
    width: 100%;
    height: 40px;
    border-top: 1px #ccc dotted;
    box-sizing: border-box;
    &.border {
      border-top-style: solid;
    }
  }
}
.blockBody {
  overflow: hidden;
  box-sizing: border-box;
  width: 220px;
  &.width-400{
    width: 460px;
    .body-content{
      >div{
        &:first-child{
          text-align: right;
          box-sizing: border-box;
          padding-right: 15px;
        }
        &:last-child{
          text-align: left;
           box-sizing: border-box;
          padding-left: 15px;
           position: relative;
           &::before{
             width: 1px;
             height: 80%;
             content: '';
             position: absolute;
             top: 10%;
             left: 0;
             border-left:dotted 1px #e7e7e7;
           }
        }
      }
    }
  }
  .title {
    padding-left: 10px;
    line-height: 32px;
    min-height: 32px;
    position: relative;
    span:first-child {
      height: 20px;
      width: 4px;
      border-radius: 2px;
      position: absolute;
      top: 6px;
      left: 0px;
      z-index: 1;
    }
    p{
      line-height: 32px;
      i{
        font-style: normal;
        color:#999 ;
      }
    }
  }
  .body-content {
    overflow: hidden;
    display: flex;
    background: #F7F7F7;
    &.kong{
      background: #fff;
    }
    > div {
      width: 100%;
      position: relative;
      &::before{
        content: '';
        width: 1px;
        height: 70px ;
      }
    }
  }
  .body-li {
    line-height: 32px;
    div {
      color: #333;
      &:first-child {
        color: #999;
      }
    }
  }
}
</style>