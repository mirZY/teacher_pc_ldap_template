<template>
  <div class="detaillist">
    <div class="choose">
      <el-row :gutter="10">
        <el-col :span="3">
          <el-select v-model="teacher.begin_year" placeholder size="small">
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
          <el-select v-model="teacher.lesson_type" placeholder size="small">
            <el-option
              v-for="item in lesson"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="btn-zu">
            <ad-button-group :mark="this.teacher.school_id" :value="cityList" @callback="operHandle"></ad-button-group>
          </div>
        </el-col>
      </el-row>
      <div class="detailBody">
        <ad-board :title="`主讲备课量:${count['back_nums']?count['back_nums']:0}`">
          <el-row :gutter="32">
            <el-col :span="8" v-for="(item,key,index) in count" :key="index" v-show="key!='back_nums'" >
              <ad-panel-item color="main" :disabled="true" :order="index" >
                <div class="panel-context">
                  <span>{{key}}</span>
                  <span>{{count[key]}}个班</span>
                </div>
              </ad-panel-item>
            </el-col>
          </el-row>
        </ad-board>
        <div class="schedule_table">
          <el-table :data="scheduleList" style="width: 100%" border>
            <el-table-column label="班级编码" prop="class_no" fixed="left" align="center"></el-table-column>
            <el-table-column label="班级名称" align="center" prop="class_name"></el-table-column>
            <el-table-column label="城市分校" align="center" prop="school_name"> </el-table-column>
            <el-table-column label="课程类型" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.lesson_type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上课地点" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.campus_name }}-{{scope.row.campus_position_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色" width="200" align="center">
              <template slot-scope="scope">
                <!-- 1主讲，2班主任，3助教，4 导播 10代课老师-->
                <span style="margin-left: 10px">{{scope.row.role}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="item_name"  label="项目" width="100" align="center">
                  
            </el-table-column>
            <el-table-column  label="负责课节" width="100" align="center">
                <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.lesson_nums }}/{{scope.row.course_num}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="上课时间" width="260" align="center" >
                <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.begin_date }}至{{scope.row.end_date}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="课程状态" width="100" align="center">
              <template slot-scope="scope">
              <span :class="`status ${statusShow(scope.row).color}`"></span>{{statusShow(scope.row).name}}
              </template>
            </el-table-column>
          </el-table>
          <div class="paginaion_footer">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="0"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AdBoard, AdPanelItem, AdButtonGroup } from "@UI";
import { teacherlessonlist,schoollist,calendarlist } from "@/api/schedule";
import {formatTime} from "@tools"
let month = new Date().getMonth() + 1;
if (6 <= month && month < 10) {
  month = 3;
} else if (8 <= month) {
  month = 4;
} else if (month == 12 || month < 3) {
  month = 3;
} else if (2 <= month && month < 8) {
  month = 2;
}
export default {
  name: "detaillist",
  components: {
    AdBoard,
    AdPanelItem,
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
     currentPage:5,
     total:null,
      year: [
        { value: year, label: `${year}~${year + 1}` },
        { value: year + 1, label: `${year + 1}~${year + 2}` }
      ],
      lesson: [
        { value: 0, label: "全部课程类型" },
        { value: 1, label: "线上" },
        { value: 2, label: "线下" }
      ],
      teacher: {
        school_id: 0,
        begin_year: new Date().getFullYear(),
        end_year: new Date().getFullYear()+1,
        term_id: month,
        teacher_id: "",
        pageSize:10,
        page:1,
        lesson_type:0,
        calendar_id:''
      },
      sumary: [
        { value: 2, label: "春季" },
        { value: 3, label: "暑假" },
        { value: 4, label: "秋季" },
        { value: 1, label: "寒假" }
      ],
      scheduleList: [],
      cityList: [],
      count:{},
      calendarList:[],
       page:1
    };
  },
  computed:{
    BackClasslist(){
      return this.scheduleList.map(item =>{
        return {
          term_name:item.term_name
        }
      })
    }
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
      // immediate:true,
      handler(n,o){
        this.getLessonList()
      }
    }
  },
  created(){
    this.getCalendarList()
  },
  methods: {
      async getCalendarList(){
      const {teacher_id,begin_year} = this.teacher
      const data = await calendarlist({teacher_id,study_year:begin_year})
      this.calendarList = [...data.calendar]
      this.teacher.calendar_id = data.default
    },
      handleSizeChange(num) {
      this.schedule.pageSize = num
      
    },
    handleCurrentChange(index) {
      this.page =index
        let teacher = Object.assign({},this.teacher)
      teacher.page = index
      this.getLessonList(teacher)
    },
    // 角色显示
    // roleShow(role){
    //   //1主讲，2班主任，3助教，4 导播 10代课老师
    //   const roleData = {
    //     '1': '主讲',
    //     '2': '班主任',
    //     '3': '助教',
    //     '10': '代课老师'
    //   }
    //   return roleData[role]
    // },
    // 状态显示
    statusShow(item){
      let date = formatTime(new Date(), 'yyyy-MM-dd')
      if(item.begin_date > date){
        return {
          color: 'bg-warning',
          name:"待开始"
        }
      }else if(item.begin_date <= date && item.end_date >= date){
      return {
                color: 'bg-blue',
                name:"进行中" }
      } else {
        return {
                color: 'bg-info',
                name:"已结束" }
      }
    },
    //城市回调
    operHandle(index){
      this.teacher.school_id = index
    },
    // 获取排课详细
    async getLessonList(teacher) {
      if(!teacher){
        this.page = 1
      }
      let data = await teacherlessonlist(teacher?teacher:this.teacher);
      this.count = Object.assign({},data.count)
      this.scheduleList = [...data.data]
      this.pageSize = data.pagesize
      this.total =parseInt(data.total)
    },
    // 获取老师负责的城市分校列表
    async getSchoolList() {
      const {teacher_id} = this.teacher
      const data = await schoollist({teacher_id});
      this.cityList = data.length>0&&data.map(item =>{
        return item
      })
      this.cityList.unshift({id:0,name:'全部'})
      this.teacher.school_id = 0
    }
  }
};
</script>
<style lang="scss" scoped>
.detaillist {
  .bg-blue{
    background:#A9C1FF ;
  }
  .bg-warning{
    background: #FFB154;
  }
  .bg-info{
    background: #CCCCCC;
  }
  .status{
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 6px;
    border-radius: 50%;
  }
  .btn-zu {
    overflow: hidden;
    margin: 20px 0;
  }
  .choose {
    margin: 24px 0;
    box-sizing: border-box;
    overflow: hidden;
    .panel-context {
      width: 97%;
      span {
        &:last-child {
          float: right;
          padding: 0 10px;
          position: relative;
          &::before {
            content: "";
            position: absolute;
            left: 0;
            height: 26px;
            width: 2px;
            background: #3c0060;
            border-radius: 1px;
            top: 50%;
            margin-top: -13px;
          }
        }
        &:first-child {
          float: left;
        }
      }
    }
    .btnGroup {
      overflow: hidden;
      box-sizing: border-box;
      padding: 20px;
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
    width: 560px;
    float: right;
  }
  .schedule_table {
    margin-top: 20px;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
<style lang="scss">
.schedule_table {
  .el-table thead th {
    background: #eee;
    color: #333;
    font-weight: normal;
  }
}
</style>