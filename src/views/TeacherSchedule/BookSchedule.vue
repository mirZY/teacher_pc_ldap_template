<template>
  <div class="bookschedule">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">班级管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/schedule/detail',query:{
        teacher_id:query.teacher_id,teacher_name:query.teacher_name,account:query.account
      } }">排课详情</el-breadcrumb-item>
      <el-breadcrumb-item>预约排课</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="add_title">预约排课</h2>
    <div class="stop-body">
      <ad-step :step="step" format="special" :stepData="stepData"></ad-step>
    </div>
    <div class="form-body">
      <div v-if="step === 1">
        <el-row>
          <el-col :offset="5" :span="14">
            <div class="listShow">
              <div class="listHeader">
                有
                <span>{{conflic.length}}</span>节课程与老师现有排课冲突
              </div>
              <div class="listBody">
                <ul>
                  <li
                    v-for="(item ,key) in bookList"
                    :class="`${!!item.conflic?'active':''}`"
                    :key="key"
                  >
                    第{{key}}课 ｜ {{item.date}}
                    <el-popover placement="right" width="400" trigger="click" v-if="!!item.conflic">
                      <section class="blockBody">
                        <div class="title" v-if="item.conflic">
                              <span :class="`${color(item.conflic.schedule_type)} ${item.conflic.ohter_city == 5?'city':''}`"></span>
                              <p v-if="item.conflic.lesson_type ==1">
                                线上直播 {{item.conflic.class_no}}
                              </p>
                              <p
                              v-else
                              > {{item.conflic.schedule_type == 4 ? '停课日':''}}
                                {{item.conflic.schedule_type == 1 || item.conflic.schedule_type == 5  ? item.conflic.class_name:''}}<i>{{item.conflic.class_no}}</i>
                                {{item.conflic.schedule_type == 2 ?'预约排课':''}}
                                {{item.conflic.schedule_type == 3 ?item.conflic.remark:''}}
                              </p>
                            </div>
                       <el-row class="body-li" v-if="item.schedule_type==3">
                          <el-col :span="8" >不排课城市</el-col>
                          <el-col :span="16">全部城市 </el-col>
                        </el-row>
                           <el-row class="body-li" v-if="item.conflic.schedule_type!=3">
                            <el-col :span="8" >上课地点</el-col>
                            <el-col :span="16">{{`${item.conflic.school_name?item.conflic.school_name:''} ${item.conflic.campus_name?item.conflic.campus_name:''} ${item.conflic.campus_position_name?item.conflic.campus_position_name:''} `}} </el-col>
                          </el-row>
                          <el-row class="body-li">
                            <el-col :span="8">上课时间</el-col>
                            <el-col
                              :span="16"
                            > {{weekStatus(item)}}{{formatTime(new Date(item.conflic.begin_time*1000),'hh:mm')}}~{{formatTime(new Date(item.conflic.end_time*1000),'hh:mm')}}</el-col>
                          </el-row>
                          <el-row class="body-li">
                            <el-col :span="8">开课日期</el-col>
                            <el-col :span="16">{{item.conflic.begin_date}}</el-col>
                          </el-row>
                          <el-row class="body-li" v-if="item.conflic.schedule_type != 2 && item.conflic.schedule_type!=3">
                            <el-col :span="8" >年级</el-col>
                            <el-col :span="16">{{item.conflic.grade_name}}</el-col>
                          </el-row>
                            <el-row class="body-li" v-if="item.conflic.schedule_type == 2 && item.conflic.schedule_sort_name">
                            <el-col :span="8">预约位置</el-col>
                            <el-col :span="16">{{item.conflic.schedule_sort_name}}</el-col>
                          </el-row>
                          <el-row class="body-li" v-if="item.conflic.schedule_type != 2">
                            <el-col :span="8">担任角色</el-col>
                            <el-col :span="16">{{item.conflic.role}} {{item.conflic.schedule_sort_name?'|':''}} {{item.conflic.schedule_sort_name}}</el-col>
                          </el-row>
                          <el-row class="body-li" v-if="item.conflic.schedule_type != 3">
                            <el-col :span="8">负责课节</el-col>
                            <el-col :span="16">{{item.conflic.lesson_nums}}</el-col>
                          </el-row>
                          <el-row class="body-li"  v-if="item.conflic.schedule_type == 3">
                            <el-col :span="8">天数</el-col>
                            <el-col :span="16">{{item.conflic.lesson_nums}}</el-col>
                          </el-row>
                        <!-- <el-row class="body-li">
                          <el-col :span="4">负责课节</el-col>
                          <el-col :span="20">{{item.lesson_num}}</el-col>
                        </el-row>-->
                      </section>
                      <span slot="reference" :class="`${!!item.conflic?'active':''}`">查看详细</span>
                    </el-popover>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
          <el-col :offset="5" :span="14">
            <div class="listFooter">
              <el-button class="el-button--main" plain size="small" @click="upStep">上一步</el-button>
              <el-button type="primary" size="small" class="el-button--main" @click="onSubmit">预约排课</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-form
        v-if="step===0"
        :model="book"
        ref="book"
        :rules="bookRules"
        :inline="true"
        label-width="100%"
        label-position="left"
        size="small"
      >
        <el-row :gutter="10">
          <el-col :span="8" :offset="4">
            <el-form-item label="学年" prop="study_year">
              <el-select v-model="book.study_year" placeholder disabled>
                <el-option
                  v-for="item in year"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="季度" prop="term_type">
              <el-select v-model="book.term_type" placeholder disabled>
                <el-option
                  v-for="item in sumary"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" :offset="4">
            <el-form-item label="城市" prop="school_id">
              <el-select v-model="book.school_id" placeholder="请选择城市" @change="getcampusesList">
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="校区" prop="campus_id">
              <el-select v-model="book.campus_id" placeholder="请选择校区">
                <el-option
                  v-for="item in campusesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="利润中心" prop="profit_center_id">
              <el-select v-model="book.profit_center_id" placeholder="请选择利润中心">
                <el-option
                  v-for="item in profitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8" :offset="4">
            <el-form-item label="开课日期" prop="class_day">
              <el-date-picker
                v-model="book.class_day"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择开课日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否使用停课日" prop="use_stop_day">
              <ad-button-group
                :mark="book.use_stop_day"
                :value="stopList"
                @callback="stopclassClick"
              ></ad-button-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="book.frequency_type=='2'?8:4" :offset="4">
            <el-form-item label="开课频次" prop="frequency_type">
              <el-select v-model="book.frequency_type" placeholder>
                <el-option
                  v-for="item in frequencyTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="book.frequency_type=='1'">
            <el-form-item label="||" prop="frequencys" class="kong">
              <el-select v-model="frequencyweek" placeholder multiple @change="setFrequency(1)">
                <el-option
                  v-for="item in frequencyWeeks"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上课时间" prop="bd_time">
              <el-time-picker
                is-range
                v-model="book.bd_time"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" :offset="4">
            <el-form-item label="班级课节数" prop="lesson_num">
              <el-input-number v-model="book.lesson_num" :min="1" :max="20" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="班级老师数" prop="teacher_num">
              <ad-button-group
                :mark="book.teacher_num"
                :value="teacherNumber"
                @callback="teacherNumbeHandle"
              ></ad-button-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="排课模版" prop="tmp_id">
              <el-select v-model="book.tmp_id" placeholder>
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="该老师位置" prop="addr">
              <el-select v-model="book.addr" placeholder>
                <el-option
                  v-for="item in addrList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12" :offset="4">
            <el-button type="primary" class="el-button--main" size="small" @click="nextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { AdStep, AdButtonGroup } from "@UI";
import { formatTime } from "@tools";
import {
  profitlist,
  schoollist,
  campuseslist,
  templatelist,
  termlist,
  checkconflict,
  lessonadd,
  lessonedit,
  sortcourse
} from "@/api/schedule";
import { bookRules } from "./utils";
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
  name: "BookSchedule",
  components: { AdStep, AdButtonGroup },
  data() {
    let year = new Date().getFullYear();
    return {
      bookRules,
      step: 0,
      stepData: ["填写预约信息", "确认预约日期"],
      frequencyTypes: [
        { id: "1", name: "每周" },
        { id: "2", name: "每天" }
      ],
      frequencyWeeks: [
        { id: 1, name: "周一" },
        { id: 2, name: "周二" },
        { id: 3, name: "周三" },
        { id: 4, name: "周四" },
        { id: 5, name: "周五" },
        { id: 6, name: "周六" },
        { id: 0, name: "周日" }
      ],
      sumary: [
        { value: 2, label: "春季" },
        { value: 3, label: "夏季" },
        { value: 4, label: "秋季" },
        { value: 1, label: "冬季" }
      ],
      year: [
        { value: year, label: `${year}~${year + 1}` },
        { value: year + 1, label: `${year + 1}~${year + 2}` }
      ],
      book: {
        study_year: year,
        school_id: "",
        term_type: month,
        campus_id: "",
        profit_center_id: "",
        use_stop_day: "1",
        frequency_type: "2",
        frequency: "",
        lesson_num: "",
        teacher_num: "1",
        tmp_id: "A",
        addr: "A",
        bd_time: "",
        class_day: ""
      },
      frequencyday: 1,
      frequencyweek: [1],
      frequencyDays: [{ id: 1, name: "第一期" }],
      stopList: [
        { id: "1", name: "使用" },
        { id: "0", name: "不使用" }
      ],
      cityList: [],
      profitList: [],
      campusesList: [],
      templateList: [],
      addrList: [],
      teacherNumber: [
        { id: "1", name: "1位" },
        { id: "2", name: "2位" },
        { id: "4", name: "4位" }
      ],
      bookList: {},
      query:{}
    };
  },
  computed: {
    conflic() {
      return Object.keys(this.bookList).filter(item => {
        console.log(this.bookList[item].conflic);
        return (
          this.bookList[item].conflic &&
          Object.keys(this.bookList[item].conflic).length > 0
        );
      });
    }
  },
  watch: {
    "book.frequency_type": {
      deep: true,
      handler(n, o) {
        if( n == 1){
            this.book.frequency= [...this.frequencyweek];
        } else {
          this.book.frequency = '1'
        }
      }
    },
    frequencyweek: {
      immediate:true,
      deep: true,
      handler(n, o) {
        console.log("object",n,o);
        this.book.frequency = [...this.frequencyweek];
      }
    },
    "book.lesson_num": {
      deep: true,
      handler(n, o) {
        this.getTemplateList();
      }
    },
    "book.bd_time": {
      immediate: true,
      deep: true,
      handler(n, o) {
        this.book.begin_time = n[0];
        this.book.end_time = n[1];
      }
    },
  },
  created() {
    const { year, term_id, teacher_id, schedule_id,teacher_name,account } = this.$route.query;
    this.query = this.$route.query
    this.book.study_year = parseInt(year);
    this.book.term_type = parseInt(term_id);
    this.book.teacher_id = teacher_id;
    this.book.schedule_id = schedule_id
    this.setF(term_id)
    Promise.all([this.getCityList(), this.getProfitList()]).then(res => {
      console.log(res);
      if (schedule_id) {
        this.getSortCourse(schedule_id);
      }
    });
  },
  methods: {
    setF (n){
       switch (n) {
          case 1:
            this.book.frequency_type = "2";
            this.book.frequency = "";
            this.book.lesson_num = 12;
            break;
          case 2:
          case 4:
            this.book.frequency_type = "1";
            this.book.frequency = [];
            this.book.lesson_num = 16;
            break;

          case 3:
            this.book.frequency_type = "2";
            this.book.frequency = "";
            this.book.lesson_num = 8;
            break;

          default:
            break;
        }
    },
     weekStatus(item){
      let week =['每周日','每周一','每周二','每周三','每周四','每周五','每周六']
      let frequency_type = item.frequency_type+''
      return frequency_type == 1 ? week[item.frequency]:'每天'
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
    formatTime,
    //获取排课信息
    async getSortCourse(schedule_id) {
      const data = await sortcourse({ schedule_id });
        data.study_year = parseInt(data.study_year);
      data.term_type = parseInt(data.term_type);
       data.frequency_type = data.frequency_type
      data.bd_time = [data.begin_time.substring(0,5), data.end_time.substring(0,5)];
      this.book = Object.assign({}, data);
      this.frequencyweek = data.frequency.map(item =>{
        return parseInt(item)
      })
      if(this.book.campus_id){
        this.getcampusesList()
      }
       let tmp = ["A", "B", "C", "D"];
      tmp.length = data.teacher_num;
      this.addrList = tmp.map(item => {
        return {
          id: item,
          name: item
        };
      });
    },
    upStep() {
      this.step--;
    },
    // 设置停课日选择
    stopclassClick(index) {
      this.book.use_stop_day = index;
    },
    // 下一步
    async nextStep() {
      let that = this;
      this.$refs.book.validate(val => {
        if (val) {
          checkconflict(that.book).then(res => {
            that.bookList = Object.assign({}, res.list);
            that.step++;
          });
        }
      });
    },
    // 设置开课频次
    setFrequency(index) {
      if (index == 1) {
        this.book.frequency = this.frequencyday;
      } else {
        this.book.frequency = this.frequencyweek;
      }
    },
    //获取模版
    async getTemplateList() {
      const { lesson_num, teacher_num } = this.book;
      const data = await templatelist({ lesson_num, teacher_num });
      this.templateList = Object.keys(data).map(item => {
        return {
          id: item,
          name: data[item]
        };
      });
      this.book.tmp_id = Object.keys(data)[0];
    },
    //教师数
    teacherNumbeHandle(index) {
      this.book.teacher_num = index;
      let tmp = ["A", "B", "C", "D"];
      tmp.length = index;
      this.addrList = tmp.map(item => {
        return {
          id: item,
          name: item
        };
      });
      this.getTemplateList();
    },
    // 校区
    async getcampusesList() {
      const { school_id } = this.book;
      const data = await campuseslist({ school_id });
      if (JSON.stringify(data) !== "{}") {
        this.campusesList = [...data];
      }
    },
    // 利润中心
    async getProfitList() {
      const { teacher_id } = this.book;
      const data = await profitlist({ teacher_id });
      this.profitList = [...data];
    },
    //城市中心
    async getCityList() {
      const { teacher_id } = this.book;
      const data = await schoollist({ teacher_id });
      this.cityList = [...data];
    },
    linkto() {
      const { teacher_id } = this.book;
      const {query} =this
      this.$router.push({
        name: "detail",
        query: {
          teacher_id:query.teacher_id,teacher_name:query.teacher_name,account:query.account
        }
      });
    },
    async onSubmit() {
      let data = null;
      const { teacher_id, school_id } = this.book;
      const that = this;
      if (this.conflic.length > 0) {
        this.$confirm("所选日期与老师当前排课有冲突， 确定预约排课？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          confirmButtonClass: "el-button--main",
          type: "warning"
        })
          .then(res => {
            if (school_id) {
              lessonadd(that.book).then(res => {
                that.linkto();
              });
            } else {
              lessonadd(that.book).then(res => {
                that.linkto();
              });
            }
            that.linkto();
          })
          .catch(err => {});
      } else  {
         lessonadd(that.book).then(res => {
                that.linkto();
              });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
 .add_title {
    overflow: hidden;
    line-height: 72px;
    font-size: 20px;
    color: #333;
    margin-bottom: 16px;
  }
.blockBody {
  overflow: hidden;
  box-sizing: border-box;
  
  .title {
    padding-left: 10px;
    line-height: 32px;
    height: 32px;
    position: relative;
    &::before {
      content: "";
      height: 20px;
      width: 4px;
      border-radius: 2px;
      background: #e77878;
      position: absolute;
      top: 6px;
      left: 0px;
      z-index: 1;
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
.listShow {
  width: 100%;
  background: #f7f7f7;
  min-height: 200px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 20px;
  .listHeader {
    line-height: 52px;
    font-size: 16px;
    border-bottom: #eee 1px solid;
    color: #999;
    span {
      color: #e77878;
    }
  }
  .listBody {
    ul {
      overflow: hidden;
      color: #666;
      > li {
        line-height: 42px;
        height: 42px;
        span {
          text-decoration: underline;
          cursor: pointer;
        }
        &.active {
          color: #e77878;
        }
      }
    }
  }
}
.listFooter {
  margin-top: 30px;
  overflow: hidden;
}
.stop-body {
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  padding-top: 30px;
  padding-bottom: 60px;
  > div {
    padding: 0 20px;
  }
}
.form-body {
  width: 100%;
  background: #fff;
  min-height: 600px;
}

.btn-group {
  overflow: hidden;
  width: 100%;
  display: flex;
  div {
    width: 100%;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #eee;
    margin-left: -1px;
    cursor: pointer;
    &.active {
      border-color: #3c0060;
      margin-right: 1px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      margin-left: 0;
    }
  }
}
</style>
<style lang="scss">
.bookschedule {
  .el-breadcrumb__inner {
    color: #333 !important;
    &.is-link{
      color: #999 !important;
    }
  }
  .el-form-item__content {
    width: 100%;
  }
  .el-form-item--small.el-form-item {
    width: 100%;
  }

  .el-input-number,
  .el-select,
  .el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 100% !important;
  }
  .kong {
    overflow: hidden;
    label {
      color: #fff;
    }
  }
}
</style>
