<template>
  <div class="bookschedule">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">班级管理</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: '/schedule/detail',query:{
        teacher_id:query.teacher_id,teacher_name:query.teacher_name,account:query.account
      } }"
      >排课详情</el-breadcrumb-item>
      <el-breadcrumb-item>不排课标记</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="add_title">不排课标记</h2>
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
                    v-for="(item ,key) in nobookList"
                    :class="`${!!item.conflic?'active':''}`"
                    :key="key"
                  >
                    第{{key}}课 ｜ {{item.date}}
                    <el-popover placement="right" width="400" trigger="click" v-if="!!item.conflic">
                      <section class="blockBody">
                        <div class="title" v-if="item.conflic">
                          <span
                            :class="`${color(item.conflic.schedule_type)} ${item.conflic.ohter_city == 5?'city':''}`"
                          ></span>
                          <p v-if="item.conflic.lesson_type ==1">线上直播 {{item.conflic.class_no}}</p>
                          <p v-else>
                            {{item.conflic.schedule_type == 4 ? '停课日':''}}
                            {{item.conflic.schedule_type == 1 || item.conflic.schedule_type == 5 ? item.conflic.class_name:''}}
                            <i>{{item.conflic.class_no}}</i>
                            {{item.conflic.schedule_type == 2 ?'预约排课':''}}
                            {{item.conflic.schedule_type == 3 ?item.conflic.remark:''}}
                          </p>
                        </div>
                        <el-row class="body-li" v-if="item.conflic.schedule_type!=3">
                          <el-col :span="8">上课地点</el-col>
                          <el-col
                            :span="16"
                          >{{`${item.conflic.school_name?item.conflic.school_name:''} ${item.conflic.campus_name?item.conflic.campus_name:''} ${item.conflic.campus_position_name?item.conflic.campus_position_name:''} `}}</el-col>
                        </el-row>
                        <el-row class="body-li">
                          <el-col :span="8">上课时间</el-col>
                          <el-col
                            :span="16"
                          >{{weekStatus(item)}}{{formatTime(new Date(item.conflic.begin_time*1000),'hh:mm')}}~{{formatTime(new Date(item.conflic.end_time*1000),'hh:mm')}}</el-col>
                        </el-row>
                        <el-row class="body-li">
                          <el-col :span="8">开课日期</el-col>
                          <el-col :span="16">{{item.conflic.begin_date}}</el-col>
                        </el-row>
                        <el-row
                          class="body-li"
                          v-if="item.conflic.schedule_type != 2 && item.conflic.schedule_type!=3"
                        >
                          <el-col :span="8">年级</el-col>
                          <el-col :span="16">{{item.conflic.grade_name}}</el-col>
                        </el-row>
                        <el-row
                          class="body-li"
                          v-if="item.conflic.schedule_type == 2 && item.conflic.schedule_sort_name"
                        >
                          <el-col :span="8">预约位置</el-col>
                          <el-col :span="16">{{item.conflic.schedule_sort_name}}</el-col>
                        </el-row>
                        <el-row class="body-li" v-if="item.conflic.schedule_type != 2">
                          <el-col :span="8">担任角色</el-col>
                          <el-col
                            :span="16"
                          >{{item.conflic.role}} {{item.conflic.schedule_sort_name?'|':''}} {{item.conflic.schedule_sort_name}}</el-col>
                        </el-row>
                        <el-row class="body-li" v-if="item.conflic.schedule_type != 3">
                          <el-col :span="8">负责课节</el-col>
                          <el-col :span="16">{{item.conflic.lesson_nums}}</el-col>
                        </el-row>
                        <el-row class="body-li" v-if="item.conflic.schedule_type == 3">
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
              <el-button type="primary" size="small" class="el-button--main" @click="onSubmit">不排课标记</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-form
        v-if="step===0"
        :model="nobook"
        ref="nobook"
        :rules="nobookRules"
        :inline="true"
        label-width="100%"
        label-position="left"
        size="small"
      >
        <el-row :gutter="10">
          <el-col :span="8" :offset="4">
            <el-form-item label="学年" prop="study_year">
              <el-select v-model="nobook.study_year" placeholder disabled>
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
              <el-select v-model="nobook.term_type" placeholder disabled>
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
          <el-col :span="8" :offset="4">
            <el-form-item label="不排课日期" prop="stop_time">
              <el-date-picker
                v-model="nobook.stop_time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="nobook.frequency_type == 2? 8 : 4">
            <el-form-item label="不排课频次" prop="frequency_type">
              <el-select v-model="nobook.frequency_type" placeholder>
                <el-option
                  v-for="item in frequencyTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="nobook.frequency_type==1">
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
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8" :offset="4">
            <el-form-item label="不排课时间" prop="bd_time">
              <el-time-picker
                is-range
                v-model="nobook.bd_time"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              ></el-time-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="前后搭模版" prop="tmp_id">
              <el-select v-model="nobook.tmp_id" placeholder>
                <el-option
                  v-for="item in templateList"
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
            <el-form-item label="不排课时段" prop="stop_time_type">
              <ad-button-group
                :mark="nobook.stop_time_type"
                :value="teacherNumber"
                @callback="teacherNumbeHandle"
              ></ad-button-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不排课城市" prop="city">
              <el-checkbox-group v-model="nobook.school_id" fill="#3C0060">
                <el-checkbox label="0" name="city" @change="setAllCity">全部</el-checkbox>
                <el-checkbox
                  :label="item.id"
                  name="city"
                  @change="setCity"
                  v-for="(item) in schoolList"
                  :key="item.id"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8" :offset="4">
            <el-form-item label="不排课备注" prop="remark">
              <ad-input v-model="nobook.remark" prop="remark" placeholder="请输入老师该时段不能排课的原因"></ad-input>
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
import { AdStep, AdButtonGroup, AdInput } from "@UI";
import {
  schoollist,
  stoptemplatelist,
  termlist,
  checkstopconflict,
  addnoschedule,
  stopsortcourse,
  editnoschedule
} from "@/api/schedule";
import { formatTime } from "@tools";
import { nobookRules } from "./utils";
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
  name: "noBookSchedule",
  components: { AdStep, AdButtonGroup, AdInput },
  data() {
    let year = new Date().getFullYear();
    return {
      nobookRules,
      step: 0,
      stepData: ["填写不排课信息", "确定不排课日期"],
      frequencyTypes: [
        { id: 1, name: "每周" },
        { id: 2, name: "每天" }
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
      nobook: {
        study_year: year,
        term_type: month,
        stop_begin_time: "",
        stop_end_time: "",
        stop_time_type: "0",
        stop_time: "",
        bd_time: "",
        school_id: ["0"],
        begin_time: "",
        frequency_type: "1",
        frequency: "",
        end_time: "",
        remark: "",
        teacher_id: "",
        begin_time: "",
        end_time: "",
        tmp_id: ""
      },
      frequencyday: "1",
      frequencyweek: [1],
      frequencyDays: [{ id: "1", name: "第一期" }],
      schoolList: [],
      templateList: [],
      addrList: [],
      teacherNumber: [
        { id: "0", name: "全部" },
        { id: "1", name: "A位不排课" },
        { id: "2", name: "B位不排课" }
      ],
      nobookList: {},
      query: {}
    };
  },
  computed: {
    conflic() {
      return Object.keys(this.nobookList).filter(item => {
        return (
          this.nobookList[item].conflic &&
          Object.keys(this.nobookList[item].conflic).length > 0
        );
      });
    }
  },
  watch: {
    "nobook.frequency_type": {
      deep: true,
      handler(n, o) {
        if (n == 1) {
          this.nobook.frequency = [...this.frequencyweek];
        } else {
          this.nobook.frequency = 1;
        }
      }
    },
    frequencyweek: {
      deep: true,
      handler(n, o) {
        this.nobook.frequency = [...this.frequencyweek];
      }
    },
    "nobook.bd_time": {
      //设置关联数据
      deep: true,
      handler(n, o) {
        this.nobook.begin_time = n[0];
        this.nobook.end_time = n[1];
      }
    },
    "nobook.stop_time": {
      //设置关联数据
      deep: true,
      handler(n, o) {
        this.nobook.stop_begin_time = n[0];
        this.nobook.stop_end_time = n[1];
      }
    }
  },
  created() {
    const { year, term_id, teacher_id, schedule_id } = this.$route.query;
    this.query = this.$route.query;
    this.nobook.study_year = parseInt(year);
    this.nobook.term_type = parseInt(term_id);
    this.nobook.teacher_id = teacher_id;
    this.setF(term_id)
    Promise.all([this.getSchoolList(), this.getTemplateList()]).then(res => {
      if (schedule_id) {
        this.getStopSortCourse(schedule_id);
      }
    });
  },

  methods: {
    formatTime,
    setF(n){
       switch (n) {
          case 1:
            this.nobook.frequency_type = 2;
            this.nobook.frequency = "1";
            break;
          case 2:
          case 4:
            this.nobook.frequency_type = 1;
            this.nobook.frequency = [1];
            break;

          case 3:
            this.nobook.frequency_type = 2;
            this.nobook.frequency = "1";
            break;
          default:
            break;
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
    weekStatus(item) {
      let week = [
        "每周日",
        "每周一",
        "每周二",
        "每周三",
        "每周四",
        "每周五",
        "每周六"
      ];
      let frequency_type = item.frequency_type;
      return frequency_type == 1 ? week[item.frequency] : "每天";
    },
    //获取不排课信息
    async getStopSortCourse(schedule_id) {
      const data = await stopsortcourse({ schedule_id });
       data.bd_time = [
        data.begin_time.substring(0, 5),
        data.end_time.substring(0, 5)
      ];
      data.frequency_type = parseInt(data.frequency_type)
      data.study_year = parseInt(data.study_year);
      data.term_type = parseInt(data.term_type);
      data.stop_time = [data.stop_begin_time, data.stop_end_time];
       this.frequencyweek = data.frequency.map(item =>{
        return parseInt(item)
      })
      this.nobook = Object.assign({}, data);
      if (!(typeof data.frequency == "string")) {
        this.nobook.frequency.splice(
          0,
          data.frequency.length,
          ...data.frequency
        );
      }
    },
    upStep() {
      this.step--;
    },
    setAllCity() {
      let school_id = this.nobook.school_id;
      let length = this.nobook.school_id.length;
      if (school_id.indexOf("0") > 0) {
        this.nobook.school_id.splice(0, length - 1);
      } else {
        this.nobook.school_id.splice(0, length - 1, "0");
      }
    },
    setCity() {
      let school_id = this.nobook.school_id;
      let index = school_id.indexOf("0");
      if (index >= 0) {
        this.nobook.school_id.splice(index, 1);
      }
    },
    // 设置不排课频次
    setFrequency(index) {
      if (index == "2") {
        this.nobook.frequency = this.frequencyday;
      } else {
        this.nobook.frequency = this.frequencyweek;
      }
    },
    // 下一步
    nextStep() {
      const that = this;
      this.$refs.nobook.validate(val => {
        if (val) {
          checkstopconflict(that.nobook).then(res => {
            that.nobookList = Object.assign({}, res.list);
            that.step++;
          });
        }
      });
    },
    // 设置开课频次
    setFrequency(index) {
      if (index == 1) {
        this.nobook.frequency = this.frequencyday;
      } else {
        this.nobook.frequency = this.frequencyweek;
      }
    },
    //获取模版
    async getTemplateList() {
      const { term_type } = this.nobook;
      const data = await stoptemplatelist({ term_type });
      this.templateList = Object.keys(data).map(item => {
        return {
          id: item,
          name: data[item]
        };
      });
      this.nobook.tmp_id = Object.keys(data)[0];
    },
    //教师数
    teacherNumbeHandle(index) {
      this.nobook.stop_time_type = index;
    },
    //城市中心
    async getSchoolList() {
      const { teacher_id } = this.nobook;
      const data = await schoollist({ teacher_id });
      this.schoolList = [...data];
    },
    linkto() {
      const { teacher_id } = this.nobook;
      const { query } = this;
      this.$router.push({
        name: "detail",
        query: {
          teacher_id: query.teacher_id,
          teacher_name: query.teacher_name,
          account: query.account
        }
      });
    },
    onSubmit() {
      const { teacher_id, schedule_id } = this.nobook;
      let data = null;
      const that = this;
      if (this.conflic.length > 0) {
        this.$confirm("所选日期与老师当前排课有冲突， 确定添加不排课标记？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (schedule_id) {
              editnoschedule(this.nobook).then(res => {
                that.linkto();
              });
            } else {
              addnoschedule(this.nobook).then(res => {
                that.linkto();
              });
            }
          })
          .catch(() => {});
      } else {
        addnoschedule(this.nobook).then(res => {
          that.linkto();
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.lessonfont {
  color: #3c569a;
}
.booklessonfont {
  color: #002fb1;
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
  background: rgba(#ececec, 0.5);
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
  margin-top: 46px;
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
}
.form-body {
  width: 100%;
  background: #fff;
  min-height: 600px;
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ccc;
  }
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
#bookschedule {
  .el-breadcrumb__inner {
    color: #333 !important;
    &.is-link {
      color: #999 !important;
    }
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
.el-date-editor--timerange.el-input__inner,
.el-range-editor--small.el-input__inner {
  width: 100% !important;
}
.kong {
  overflow: hidden;
  label {
    color: #fff;
  }
}
</style>