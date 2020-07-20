<template>
  <div id="schedule">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课情况</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="add_title">教师排课情况</h2>
    <div class="schedule_body">
      <div class="choose">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-select v-model="schedule.begin_year" placeholder size="small">
              <el-option
                v-for="item in year"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
           <el-col :span="3">
            <el-select v-model="schedule.term_id" placeholder size="small">
              <el-option label="全部季节" value="0"></el-option>
              <el-option
                v-for="item in sumary"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="schedule.item_id" placeholder size="small">
              <el-option label="全部项目" value></el-option>
              <el-option
                v-for="item in itermList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="schedule.grade" placeholder size="small">
              <el-option label="全部年级" value></el-option>
              <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="schedule.school_id" placeholder size="small">
              <el-option label="全部城市" value></el-option>
              <el-option
                v-for="item in schoolList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="schedule.profit_center_id" placeholder size="small">
              <el-option label="全部利润中心" value></el-option>
              <el-option v-for="item in profitList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="schedule.account" placeholder="请输入姓名/编码" size="small">
              <el-button slot="append" icon="el-icon-search" class="search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="default" plain size="small" class="reset" @click="onReset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="schedule_table">
        <el-table :data="scheduleList" style="width: 100%">
          <el-table-column label="老师" fixed="left" align="center" width="200">
            <template slot-scope="scope">
              <div class="teacherInfo">
                <img v-if="scope.row.picture" :src="scope.row.picture" alt />
                <img v-else src="../../assets/teacher/default.png" alt="">
                <div>
                  <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  <span style="margin-left: 10px">{{ scope.row.account }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="城市" align="left">
            <template slot-scope="scope">
              <div class="scope_zhu">
                <span>主</span>
                {{ scope.row.city_info.main }}
              </div>
              <div class="scope_fu">
                <span>副</span>
                {{ scope.row.city_info.sub?scope.row.city_info.sub:'-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="项目" align="center">
            <template slot-scope="scope">
              <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              :content="`${scope.row.items?scope.row.items:'-'}`">
              <span slot="reference">{{scope.row.items?scope.row.items.substring(0,12):'-'}} </span>
            </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="年级" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.grades?scope.row.grades:'-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.role?scope.row.role:'-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备课量" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.back_nums }}</span>
            </template>
          </el-table-column>
          <el-table-column label="线上班级" width="200" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.online_nums }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="offline_nums" label="线下班级" width="100" align="center"></el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <span v-if="scheduleJurisdiction.look" class="link" @click="handleEdit(scope.$index, scope.row)">查看详细</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginaion_footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AdTitle } from "@UI";
import { adminprofitcenter, admincity, gradelist,itermlist,adminschool,schedulelist } from "@/api/schedule";
import { schoolids } from '../../api';
import {mapGetters} from 'vuex'
let month = new Date().getMonth()+1
if(6<=month && month<10 ){
  month = 3
} else
if(8<=month ){
  month = 4
} else
if(month ==12 ||month<3 ){
  month = 3
}else
if(2<=month && month<8 ){
  month = 2
}
export default {
  name: "scheduleSchedule",
  components: {
    AdTitle
  },
  data() {
    let year =   new Date().getFullYear()
  
    return {
      teacher_name:'',
      currentPage: 1,
      schedule: {
        begin_year:year,
        end_year: year+1,
        term_id: month,
        school_id: "",
        profit_center_id: "",
        item_id: "",
        grade: "",
        class: "",
        account:"",
        pagesize:10,
        page:1
      },
      year: [
        { value: year, label: `${year}~${year+1}`},
        { value: year+1, label: `${year+1}~${year+2}` },
      ],
      sumary: [
        { value: 3, label: "暑假" },
        { value: 4, label: "秋季" },
        { value: 1, label: "寒假" },
        { value: 2, label: "春季" }
      ],
      schoolList: [],
      profitList: [],
      gradeList: [],
      scheduleList: [],
      itermList:[],
      termList:[],
      total:null,
      page:1,
      pagesize:10

    };
  },
  watch:{
    'schedule.begin_year':{
      immediate:true,
      deep:true,
      handler(newValue,oldValue){
        this.schedule.end_year = newValue+1
      }
    },
    schedule:{
      immediate:true,
      deep:true,
      handler(newValue,oldValue){
           this.getScheduleList();
      }
    }
  },
  computed:{
    ...mapGetters(['scheduleJurisdiction'])
  },
  created() {
    this.getScheduleList();
    this.getSchoolList();
    this.getProfitList();
    this.getGradeList();
    this.getItermList()
  },
  methods: {
    handleSizeChange(num) {
      this.schedule.pagesize = num
    },
    handleCurrentChange(index) {
      this.page =index
      let schedule = Object.assign({},this.schedule)
      schedule.page = index
      this.getScheduleList(schedule)
    },
    // 年级
     async getItermList() {
      const data = await itermlist();
      this.itermList = [...data];
    },
    // 年级
     async getGradeList() {
      const data = await gradelist();
      this.gradeList = [...data];
    },
    // 利润中心
    async getProfitList() {
      const data = await adminprofitcenter();
      this.profitList = [...data];
    },
    //城市中心
    async getSchoolList() {
      const data = await adminschool();
      this.schoolList = [...data];
    },
    // 获取排课情况
    async getScheduleList(schedule) {
      console.log("schedule",schedule);
      if(!schedule){
        this.page = 1
      }
      const data = await schedulelist(schedule?schedule:this.schedule);
      this.scheduleList = [...data.data];
      this.total = parseInt(data.total)
    },
    // 重置
    onReset(){
      let year = new  Date().getFullYear()
      this.schedule ={
        begin_year:year,
        end_year: year+1,
        term_id: month,
        school_id: "",
        profit_center_id: "",
        item_id: "",
        grade: "",
        class: "",
        teacher_name: "",
        teacher_code: ""
      }
    },
    // 排课详细
    handleEdit(index, row) {
      this.$router.push({
        name: "detail",
        query: {
          teacher_id: row.teacher_id,
          teacher_name: row.name,
          account:row.account
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#schedule {
  .add_title {
    overflow: hidden;
    line-height: 72px;
    font-size: 20px;
    color: #333;
  }
  .scope_zhu {
    overflow: hidden;
    span {
      color: #3c0060;
      background: #e6e4f3;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 2px;
    }
  }
  .scope_fu {
    overflow: hidden;
    span {
      color: #999;
      background: #f1f1f1;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 2px;
    }
  }
  .teacherInfo {
    overflow: hidden;
    display: flex;
    img {
      flex:0 0 44px;
      display: block;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #ccc;
    }
    div {
      display: flex;
      flex-direction: column;
      span {
        text-align: left;
        color: #333;
        &:last-child {
          color: #999;
        }
      }
    }
  }
  overflow: hidden;
  min-height: 100%;
  box-sizing: border-box;
  div.schedule_body {
    background: #fff;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px 0;
  }

  .choose {
    overflow: hidden;
    box-sizing: border-box;
    margin: 0 20px;
  }
  .reset {
    color: #3c0060;
    border: 1px solid #3c0060;
    cursor: pointer;
  }
  .link {
    color: #3c0060;
    text-decoration: underline;
    cursor: pointer;
  }
  .schedule_table {
    margin-top: 20px;
    overflow: hidden;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .paginaion_footer {
    margin-top: 20px;
    width: 560px;
    float: right;
  }
}
</style>
<style lang="scss">
#schedule {
  .el-breadcrumb__inner {
    color: #333 !important;
    &.is-link{
      color: #999 !important;
    }
  }
  .el-table thead th {
    background: #eee;
    color: #333;
  }

  .el-input-group__append,
  .el-input-group__prepend {
    background: #fafafa !important ;
    color: #fff;
    padding: 0 10px;
    color: #666;
  }
  .el-table th > .cell {
    color: #666;
    font-size: 14px !important;
    font-weight: normal;
  }
}
</style>