<template>
  <div class="detaillist">
    <div class="choose">
      <el-row :gutter="10">
        <el-col :span="3">
          <el-select v-model="teacher.begin_year" placeholder size="small" @change="getCalendarList">
            <el-option
              v-for="item in year"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="teacher.term_id" placeholder size="small">
            <el-option
              v-for="item in sumary"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="teacher.calendar_id" placeholder size="small">
            <el-option
              v-for="item in calendarList"
              :key="item.calendar_id"
              :label="item.name"
              :value="item.calendar_id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="6">
              <div class="btn-zu">
                <ad-button-group :mark="teacher.school_id" :value="schoolList"  @callback="operHandle"></ad-button-group>
              </div>
          </el-col>
          <el-col :span="18" class="add">
            <el-button v-if="scheduleJurisdiction.book" type="primary" size="small" class="el-button--main" @click="bookSchedule">预约排课</el-button>
            <el-button v-if="scheduleJurisdiction.nobook" plain class="el-button--main" size="small" @click="nomarkSchedule">不排课标记</el-button>
          </el-col>
      </el-row>
      
      <div class="detailBody">
      <ad-table :scheduleType="teacher.term_id" scheduleTitle="排课概览" :scheduleBlock="scheduleBlock" :scheduleData="scheduleList" :scheduleX="scheduleX" ></ad-table>
      <ad-table :scheduleType="teacher.term_id" format="detail" @deletedOpear="callbackHandler" scheduleTitle="详细课表" :scheduleBlock="scheduleBlock1" :scheduleData="blockList"  ></ad-table>
      </div>
    </div>
  </div>
</template>
<script>
import {AdTable,AdButtonGroup} from "@UI";
import {summary,schoollist,calendarlist,blockdetail,lessondeleted,deletednoschedule} from "@/api/schedule"
import {mapGetters} from 'vuex'
let month = new Date().getMonth()+1
if(6<=month && month<10 ){
  month = 3
} else
if(8<=month ){
  month = 4
} else
if(month ==12 ||month<3 ){
  month = 1
}else
if(2<=month && month<8 ){
  month = 2
}
export default {
  name: "detailblock",
  components: {
    AdTable,
    AdButtonGroup
  },
  props:{
    teacherId:{
      type:String,
      default:""
    }
  },
  data() {
    let year = new Date().getFullYear();
    return {
      scheduleX:['上午','下午','晚上'],
      scheduleBlock:[{color:"lesson",name:"有课"},{color:"booklesson",name:"预约排课"},{color:"city",name:"其他城市课程"},{color:"nobook",name:"不排课标记"}],
      scheduleBlock1:[{color:"lesson",name:"有课"},{color:"booklesson",name:"预约排课"},{color:"city",name:"其他城市课程"},{color:"nobook",name:"不排课标记"},{color:"timeout",name:"时间紧张"},{color:"confict",name:"时间冲突"}],
      year: [
        { value: year, label: `${year}~${year + 1}` },
        { value: year + 1, label: `${year + 1}~${year + 2}` }
      ],
      lesson: [
        { value: 0, label: "全部课程类型" },
        { value: 1, label: "线上" },
        { value: 2, label: "线下" }
      ],
      sumary: [
                { value: 3, label: "暑假" },
        { value: 4, label: "秋季" },
        { value: 1, label: "寒假" },
        { value: 2, label: "春季" }
            ],
      teacher: {
        school_id: "",
        begin_year: new Date().getFullYear(),
        end_year: "",
        term_id: month,
        teacher_id: "",
        calendar_id:""
      },
      schoolList:[],
      scheduleList: [],
      calendarList:[],
      blockList:[]
    };
  },
  computed:{
    ...mapGetters(['scheduleJurisdiction'])
  },
   watch:{
     teacherId:{
       deep:true,
       immediate:true,
       handler(n,o){
         if(n){
           this.teacher.teacher_id = n
          this.getSchoolList()
         }
       }
     },
     'teacher.begin_time':{
      immediate:true,
      deep:true,
      handler(n,o){
           this.teacher.end_year =this.teacher.begin_year + 1
      }
    },
    teacher:{
      deep:true,
      handler(n,o){
        if(n.calendar_id){
          this.getTeacherSchedule()
          this.getBlockDetail()
        }
      }
    }
  },
  created(){
    this.getCalendarList()
  },
  methods: {
    // 操作回调
    callbackHandler(obj){
      const {id,types} = obj
      if(types==2){
        lessondeleted({schedule_id:id}).then(res =>{
         this.getTeacherSchedule()
        this.getBlockDetail()
        })
      } else {
          deletednoschedule({schedule_id:id}).then(res =>{
           this.getTeacherSchedule()
        this.getBlockDetail()
        })
      }
    },
    // 获取校历
    async getCalendarList(){
      const {teacher_id,begin_year} = this.teacher
      const data = await calendarlist({teacher_id,study_year:begin_year})
      this.calendarList = [...data.calendar]
      this.teacher.calendar_id = data.default
    },
      //城市回调
    operHandle(index){
      this.teacher.school_id = index
    },
    // 获取老师负责的城市分校列表
    async getSchoolList(){
      const {teacher_id} = this.teacher
      let data = await schoollist({teacher_id})
       this.schoolList =data.length>0&& data.map(item =>{
        return item
      })
      this.schoolList.unshift({id:0,name:'全部'})
      this.teacher.school_id = 0
    },
    // 获取教师排课详细
     async getTeacherSchedule(){
    //     let teacher ={
    //   begin_year:2020,end_year:2021,term_id:3,calendar_id:243,teacher_id:5288
    // }
       const data = await summary(this.teacher)
       this.scheduleList = [...data]
     },

     // 获取色块
     async getBlockDetail(){
       const data = await blockdetail(this.teacher)
       this.blockList = [...data]
     },
      //预约排课
      bookSchedule() {
        const {teacher_name,account} = this.$route.query
        const {term_id,begin_year,teacher_id} = this.teacher
            this.$router.push({
              name:"bookschedule",
              query:{
                year:begin_year,
                term_id,
                teacher_id,
                teacher_name,
                account
              }
            })
      },
      // 不排课标记
      nomarkSchedule() {
        const {teacher_name,account} = this.$route.query
        const {term_id,begin_year,teacher_id} = this.teacher
           this.$router.push({
              name:"noschedule",
               query:{
                year:begin_year,
                term_id,
                teacher_id,
                teacher_name,
                account
              }
            })
      }
  },
};
</script>
<style lang="scss" scoped>
ul,li{
  list-style: none;
}
.btn-zu{
  margin-top: 20px;
  overflow: hidden;
}

.detaillist {
  .choose {
    margin: 24px 0;
    box-sizing: border-box;
    overflow: hidden;
    .add{
        padding-top: 20px;
        >.el-button{
            float: right;
            margin-right: 20px;

        }
    }
    .btnGroup {
      overflow: hidden;
      box-sizing: border-box;
      padding: 20px 0;
      .el-button {
        float: left;
        margin-left: 0;
        margin-right: -1px;
        border-radius: 0;
        &:hover,
        &:visited,
        &:focus {
          border: 1px solid #6c37a0;
          color: #6c37a0;
          background: rgba(#6c37a0, 0.1);
          z-index: 2;
        }
        &:active {
          border: 1px solid #6c37a0;
          color: #6c37a0;
          background: rgba(#6c37a0, 0.1);
          z-index: 2;
        }
        &:last-child {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &.active {
          border: 1px solid #6c37a0;
          color: #6c37a0;
          position: relative;
          z-index: 2;
        }
      }
    }
    .el-button-text {
      border: 1px solid #6c37a0;
      color: #6c37a0;
    }
    .el-button-group > .el-button:not(:last-child) {
      margin-right: -1px;
    }
    .el-button:active {
      border: 1px solid #6c37a0;
      color: #6c37a0;
    }
    > .el-row {
      padding-left: 20px;
      &:first-child {
        border-bottom: 1px solid #f2f2f2;
        padding-bottom: 24px;
      }
      &:last-child {
        margin-top: 20px;
      }
    }
  }
  .detailBody {
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .paginaion_footer {
    margin-top: 20px;
    width: 400px;
    float: right;
  }
  
}
</style>
