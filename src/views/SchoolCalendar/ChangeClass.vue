<template >
  <div class="add_calendar">
    <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">信息配置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/calendar/index' }">校历管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改上课日期</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="add_title">修改上课日期</h2>
    <div class="add_body">
      <div class="body_title">{{calendar_name}}（{{yearName}}~{{parseInt(yearName)+1}}）</div>
      <el-form
        ref="calendar_date"
        :rules="calendar_date_rules"
        :model="calendar_date"
        label-width="100px"
        :label-position="labelPosition"
        class="add_form"
      >
        <el-row>
          <el-col :span="10" :offset="6">
            <h2 class="type_title">
              <label>暑假</label>
            </h2>
            <el-form-item
              :label="`第 ${index} 期 `"
              v-for="(item,index)  in calendar_date.summer"
              :key="index"
              :rules="[{required: true, message: `请选择暑假第${index+1}期`, trigger: 'change'}]"
              :prop="`summer[${index}].value`"
            >
              <el-date-picker
                size="small"
                v-model="item.value"
                type="daterange"
                :picker-options="pickeSummer"
                :default-value="daylimit.summer"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-tooltip placement="top">
                <div slot="content">{{calendar_date.summer.length> 1?'删除':'至少保留1期哦！'}}</div>
                <span
                  :class="`el-icon-delete deleted ${calendar_date.summer.length==1 ? 'disabled':''}`"
                  @click="deleteSummary('summer',index)"
                ></span>
              </el-tooltip>
            </el-form-item>
            <el-form-item label size="small">
              <div class="add" @click="addSummary('summer')">
                <span>+</span>添加期次
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="6">
            <h2 class="type_title">
              <label>秋季</label>
            </h2>
            <el-form-item
              :prop="`autumn[${index}].value`"
              :label="`上课日期 `"
              :rules="[{required: true, message: `请选择秋季上课日期`, trigger: 'change'}]"
              v-for="(item,index)  in calendar_date.autumn"
              :key="index"
            >
              <el-date-picker
                size="small"
                v-model="item.value"
                :default-value="daylimit.autumn"
                type="daterange"
                :picker-options="pickeAutumn"
                fromat="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <span
                class="el-icon-delete deleted"
                v-if="index !== 0 "
                @click="deleteSummary('autumn',index)"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="6">
            <h2 class="type_title">
              <label>寒假</label>
            </h2>
            <el-form-item
              :label="`第 ${index+1} 期 `"
              :rules="[{required: true, message: `请选择寒假第${index+1}期`, trigger: 'change'}]"
              v-for="(item,index)  in calendar_date.winter"
              :key="index"
              :prop="`winter[${index}].value`"
            >
              <el-date-picker
                size="small"
                v-model="item.value"
                :default-value="daylimit.winter"
                :picker-options="pickeWinter"
                type="daterange"
                range-separator="~"
                fromat="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-tooltip placement="top">
                <div slot="content">{{calendar_date.winter.length> 1?'删除':'至少保留1期哦！'}}</div>
                <span
                  :class="`el-icon-delete deleted ${calendar_date.winter.length==1 ? 'disabled':''}`"
                  @click="deleteSummary('winter',index)"
                ></span>
              </el-tooltip>
            </el-form-item>
            <el-form-item label size="small">
              <div class="add" @click="addSummary('winter')">
                <span>+</span>添加期次
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="6">
            <h2 class="type_title">
              <label>春季</label>
            </h2>
            <el-form-item
              :label="`上课日期 `"
              v-for="(item,index)  in calendar_date.spring"
              :key="index"
              :prop="`spring[${index}].value`"
              :rules="[{required: true, message: `请选择春季上课日期`, trigger: 'change'}]"
            >
              <el-date-picker
                size="small"
                v-model="item.value"
                :default-value="daylimit.spring"
                type="daterange"
                :picker-options="pickeSpring"
                range-separator="~"
                fromat="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="6" class="add_btn">
            <el-button type="primary" class="el-button--main" @click="submitData" size="mini">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { AdTitle } from "@UI";
import { lookclass, changeclass } from "@/api/calendar";
import { formatTime } from "@tools";

export default {
  name: "changeClass",
  components: {
    AdTitle
  },
  data() {
    return {
      calendar_id: "",
      year: 2019,
      labelPosition: "right",
      calendar_date_rules: {
        "summer[]": [
          { required: true, message: "请填写暑假信息", trigger: "change" }
        ],
        "autumn[]": [
          { required: true, message: "请填写秋季信息", trigger: "change" }
        ],
        "winter[]": [
          { required: true, message: "请填写寒假信息", trigger: "change" }
        ],
        "spring[]": [
          { required: true, message: "请填写春季信息", trigger: "change" }
        ]
      },
      calendar_date: {
        summer: [{}],
        autumn: [{}],
        winter: [{}],
        spring: [{}]
      },
      pickeSummer: {},
      pickeAutumn: {},
      pickeWinter: {},
      pickeSpring: {}
    };
  },
  created() {
    let { id, year = new Date().getFullYear(), calendar } = this.$route.query;
    console.log(this.$route.query);
    this.calendar_id = id;
    this.calendar_name = calendar;
    year = parseInt(year)
    this.yearName = year;
    let daylimit = {
      summer: new Date(year, 5, 1),
      autumn: new Date(year, 7, 1),
      winter: new Date(year, 11, 1),
      spring: new Date(year + 1, 1, 1)
    };
    this.daylimit = Object.assign({}, daylimit);
    
    this.pickeSummer = {
        disabledDate(time) {
          return (
            time.getTime() < new Date(year, 5, 1).getTime() ||
            time.getTime() > new Date(year, 8, 30).getTime()
          );
        }
      };
      this.pickeAutumn = {
        disabledDate(time) {
          return (
            time.getTime() < new Date(year, 7, 1).getTime() ||
            time.getTime() > new Date(year + 1, 0, 31).getTime()
          );
        }
      };
      this.pickeWinter = {
        disabledDate(time) {
          return (
            time.getTime() < new Date(year, 11, 1).getTime() ||
            time.getTime() > new Date(year + 1, 2, 0).getTime()
          );
        }
      };
      this.pickeSpring = {
        disabledDate(time) {
          return (
            time.getTime() < new Date(year + 1, 1, 1).getTime() ||
            time.getTime() > new Date(year + 1, 6, 31).getTime()
          );
        }
      };
      this.pickeStopClass = {
        disabledDate(time) {
          return (
            time.getTime() < new Date(year , 5, 1).getTime() ||
            time.getTime() > new Date(year + 1, 6, 31).getTime()
          );
        }
      };
    this.getClass(id);
  },
  methods: {
    async getClass(id) {
      const data = await lookclass({ calendar_id: id });
      let calendar_date = {};
      for (const key in data) {
        const element = data[key];
        calendar_date[key] = data[key].map(item => {
          return {
            value: [
              formatTime(
                new Date(parseInt(item.begin_time) * 1000),
                "yyyy-MM-dd"
              ),
              formatTime(new Date(parseInt(item.end_time) * 1000), "yyyy-MM-dd")
            ]
          };
        });
      }
      console.log(calendar_date);
      this.calendar_date = Object.assign({}, calendar_date);
    },
    // 添加数据
    addSummary(types) {
      this.calendar_date[types].push({ value: [] });
    },
    // 删除数据
    deleteSummary(types, index) {
      if (index == 0 && this.calendar_date[types].length == 1) {
        return false;
      }
      this.calendar_date[types].splice(index, 1);
    },
    // 提交数据
    async submitData() {
      let that = this;
      this.$refs.calendar_date.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.calendar_date);
          let calendar_date = {};
          for (const key in data) {
            const element = data[key];
            if (key == "autumn" || key == "spring") {
              console.log("element", element);
              calendar_date[key] = {
                begin_time: element[0].value[0],
                end_time: element[0].value[1]
              };
            } else {
              calendar_date[key] = data[key].map(item => {
                return { begin_time: item.value[0], end_time: item.value[1] };
              });
            }
          }
          calendar_date.calendar_id = that.calendar_id;
          changeclass(calendar_date).then(res => {
            if (res) {
              that.$router.push({
                name: "index"
              });
            }
          });
        } else {
          that.$message.error("请完善信息");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.disabled {
  color: #999;
}
.add_calendar {
  overflow: hidden;
  width: 100%;
  .add_title {
    overflow: hidden;
    line-height: 72px;
    font-size: 20px;
    color: #333;
  }
  .add_body {
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
    padding: 20px;
    .body_title {
      overflow: hidden;
      line-height: 32px;
      color: #666;
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
    }
    .step_context {
      width: 80%;
      margin: 0 auto;
    }
  }
  .add_btn {
    margin-top: 40px;
  }
  .add_form {
    margin-top: 40px;
    .add_btn {
      text-align: center;
      margin-top: 40px;
    }
  }
  .salendar_result {
    overflow: hidden;
    padding: 20px 0;
    box-sizing: border-box;
    .result_title {
      font-size: 16px;
      color: #333;
      line-height: 30px;
      padding: 20px 0;
    }
    .salendar_body {
      overflow: hidden;
      > div {
        margin-bottom: 16px;
      }
    }
  }
  .row {
    overflow: hidden;
    width: 100%;
    margin-bottom: 10px;
    label {
      float: left;
      display: block;
      width: 80px;
      line-height: 32px;
      height: 32px;
    }
    .el-button {
      &.el_left {
        margin-left: 24px;
      }
    }
    .el-input {
      float: left;
      width: 176px;
      &.el_left {
        margin-left: 20px;
      }
    }
    i {
      margin-left: 6px;
      line-height: 32px;
    }
    span {
      display: block;
      width: 10px;
      &.left {
        margin-left: 0;
      }
      float: left;
      margin: 0 10px;
      line-height: 32px;
    }

    .el-textarea {
      float: left;
      width: 300px;
    }
    .el-select {
      float: left;
    }
  }
}
</style>
<style lang="scss">
.add_calendar {
  .el-form-item {
    margin-bottom: 28px;
  }
  .type_title {
    padding-top: 10px;
    label {
      margin-left: 60px;
    }
  }
  .label {
    color: #999;
  }
  h2 {
    font-size: 14px;
    color: #333;
  }
  .deleted {
    margin: 0 10px;
    cursor: pointer;
  }
  .add {
    border: 1px dotted #ccc;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    background: #fdfcff;
    border: 1px dashed #774c90;
    border-radius: 2px;
    color: #774c90;
    span {
      margin-left: 6px;
    }
  }
  .el-form-item__content {
    > div {
      width: 80%;
    }
  }
}
</style>