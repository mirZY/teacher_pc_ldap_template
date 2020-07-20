<template >
  <div class="add_calendar">
    <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">信息配置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/calendar/index' }">校历管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改停课日期</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="add_title">修改停课日期</h2>
    <div class="add_body">
      <div class="salendar_result">
        <div class="body_title">
          <span>{{query.calendar}}（{{query.year}}~{{parseInt(query.year)+1}}）</span>
          <el-button
            size="mini"
            class="el-button--main"
            type="primary"
            @click="addStopCalendar"
          >添加停课日</el-button>
        </div>
        <div class="salendar_body">
          <ad-panel
            color="success"
            name="暑假"
            format="auto"
            :disabled="false"
            :data="summer"
            @opear="summerBack"
          ></ad-panel>
          <ad-panel
            color="warning"
            name="秋季"
            format="auto"
            :data="autumn"
            :disabled="false"
            @opear="autumnBack"
          ></ad-panel>
          <ad-panel
            color="primary"
            name="寒假"
            :data="winter"
            format="auto"
            @opear="winterBack"
            :disabled="false"
          ></ad-panel>
          <ad-panel
            color="main"
            name="春季"
            format="auto"
            :data="spring"
            :disabled="false"
            @opear="springBack"
          ></ad-panel>
        </div>
        <div class="add_btn">
          <el-button type="primary" class="el-button--main" @click="submitData" size="mini">保存</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      @close="closeDialog"
      :title="`${status?'修改':'添加'}停课日`"
      :visible.sync="stopClassVisible"
      width="600px"
      custom-class="stopClass"
    >
      <el-form :model="stopClass">
        <el-form-item
          required
          :class="!stopClass_rules.date.error?'':'is-error'"
          label="停课日期"
          label-width="120px"
        >
          <el-date-picker
            size="small"
            v-model="stopClass.date"
            type="daterange"
            range-separator="~"
            :picker-options="pickeStopClass"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <div class="el-form-item__error" v-if="stopClass_rules.date.error">请选择停课日</div>
        </el-form-item>

        <el-form-item
          required
          :class="!stopClass_rules.remark.error?'':'is-error'"
          label="停课原因"
          label-width="120px"
          size="small"
        >
          <ad-input v-model="stopClass.remark" prop="remark" placeholder="请输入停课原因"></ad-input>
          <div v-if="stopClass_rules.remark.error" class="el-form-item__error">请输入停课原因</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="el-button--main" size="small" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AdTitle, AdPanel, AdInput } from "@UI";
import { lookstopclass, changestopclass } from "@/api/calendar";
import { formatTime } from "@tools";
export default {
  name: "changeStoPClass",
  components: {
    AdTitle,
    AdPanel,
    AdInput
  },
  data() {
    return {
      calendar_id: "",
      stopClassVisible: false,
      labelPosition: "right",
      status: false,
      stopClass_rules: {
        date: {
          required: true,
          message: "停课日不能为空哦！",
          trigger: "change",
          error: false
        },
        remark: {
          required: true,
          message: "请输入停课原因",
          trigger: "change",
          error: false
        }
      },
      calendar_stop: {
        summer: [],
        autumn: [],
        winter: [],
        spring: []
      },
      stopClass: {
        date: [],
        remark: ""
      },
      query: {},
      calendar_class: {},
      pickeStopClass: {},
      opear: {}
    };
  },
  computed: {
    summer() {
      return { stop_class_day: this.calendar_stop.summer } || {};
    },
    autumn() {
      return { stop_class_day: this.calendar_stop.autumn } || {};
    },
    winter() {
      return { stop_class_day: this.calendar_stop.winter } || {};
    },
    spring() {
      return { stop_class_day: this.calendar_stop.spring } || {};
    }
  },
  watch: {
    stopClass: {
      // immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        for (const key in this.stopClass) {
          let el = this.stopClass[key];
          if (key == "date") {
            el.length == 0
              ? (this.stopClass_rules.date.error = true)
              : (this.stopClass_rules.date.error = false);
          }
          if (key == "remark") {
            el.length == 0
              ? (this.stopClass_rules.remark.error = true)
              : (this.stopClass_rules.remark.error = false);
          }
        }
      }
    }
  },
  created() {
    let { id, year } = this.$route.query;
    this.calendar_id = id;
    this.pickeStopClass = {
      disabledDate(time) {
        return (
          time.getTime() < new Date(year, 5, 1).getTime() ||
          time.getTime() > new Date(year + 1, 6, 31).getTime()
        );
      }
    };
    this.query = this.$route.query;
    this.getStopClass(id);
  },
  methods: {
    addData(date) {
      const { autumn, summer, spring, winter } = this.calendar_class;
      let types = {
        summertype: false,
        autumntype: false,
        springtype: false,
        wintertype: false
      };
      let data = [date.date[0], date.date[1]];
      let remark = date.remark;
      // 校验数据
      types.summertype = summer.some(item => {
        return item.begin_time <= data[0] && data[0] <= item.end_time && item.begin_time <= data[1] && data[1] <= item.end_time;
      });
      types.autumntype = autumn.some(item => {
        return item.begin_time <= data[0] && data <= item.end_time && item.begin_time <= data[1] && data[1] <= item.end_time;
      });
      types.springtype = spring.some(item => {
        return item.begin_time <= data[0] && data[0] <= item.end_time && item.begin_time <= data[1] && data[1] <= item.end_time;
      });
      types.wintertype = winter.some(item => {
        return item.begin_time <= data[0] && data[0] <= item.end_time && item.begin_time <= data[1] && data[1] <= item.end_time;
      });
      let opear = Object.assign({},this.opear)
      for (const key in types) {
        const element = types[key];
        if (element) {
          let ke = key.slice(0, -4);
          
          let calendar_stop =this.calendar_stop? [...this.calendar_stop[ke]]:[];
          let stopstatus = calendar_stop.filter((item,index) => {
            if(index == opear.order) {
              return false
            }else {
                if(data[0] === data[1] ){
                  return item.begin_time<=data[0]&&item.end_time>=data[1]
               }else {
                 return(
               item.begin_time <= data[0] && data[1] <= item.end_time || item.begin_time >=data[0] && item.begin_time  <= data[1]&&item.end_time  >= data[1] ||
               item.begin_time <= data[0] &&item.end_time >= data[0] && item.end_time  <= data[1] || item.begin_time>=data[0] && item.end_time<= data[1]
            )
               };
            }
           
          });
          if (stopstatus.length > 0) {
            if (data[0] === data[1]) {
              this.$message.error(`${data[0]}不可重复设置停课日`);
            } else {
              this.$message.error(`${data[0]}~${data[1]}不可重复设置停课日`);
            }
            return false
          } else {
           if(opear['type'] === 'edit'){
             let {order} = opear
             this.calendar_stop[ke].splice(order,1,{
                begin_time: data[0],
              end_time: data[1],
              remark
             })
           }else {
              this.calendar_stop[ke].push({
              begin_time: data[0],
              end_time: data[1],
              remark
            });
           }
          }
        }
      }
      console.log("type",types);
      if (
        !types.summertype &&
        !types.autumntype &&
        !types.springtype &&
        !types.wintertype
      ) {
        if (data[0] === data[1]) {
          this.$message.error(`${data[0]}不属于上课日范围`);
        } else {
          this.$message.error(`${data[0]}~${data[1]}不属于上课日范围`);
        }
        return false
      } else {
        this.stopClassVisible = false;
      }
    },
    async getStopClass(id) {
      const data = await lookstopclass({ calendar_id: id });
      if (data.stop_class_day.length !== 0) {
        this.calendar_stop = Object.assign({}, data.stop_class_day);
      }
      this.calendar_class = Object.assign({}, data.class_day);
    },
    summerBack(value) {
      this.opearBack(value, "summer");
    },
    autumnBack(value) {
      this.opearBack(value, "autumn");
    },
    winterBack(value) {
      this.opearBack(value, "winter");
    },
    springBack(value) {
      this.opearBack(value, "spring");
    },
    opearBack(value, types) {
      let { type, order } = value;
      if (type === "deleted") {
        this.calendar_stop[types].splice(order, 1);
      } else {
        this.stopClassVisible = true;
        this.opear = { type, order, types };
        let data = this.calendar_stop[types].slice(order, order + 1)[0];
        let value = [data.begin_time, data.end_time];
        this.stopClass.date = [...value];
        this.stopClass.remark = data.remark;
        this.status = true;
      }
    },
    async submitData() {
      let data = {
        calendar_id: this.calendar_id,
        stop_class_day: this.calendar_stop
      };
      let responseData = await changestopclass(data);
      if (responseData) {
        this.$router.push({
          name: "index"
        });
      }
    },
    // 保存数据
    saveData() {
      let status = true;
      for (const key in this.stopClass) {
        let el = this.stopClass[key];
        if (key == "date") {
          el.length == 0
            ? (this.stopClass_rules.date.error = true)
            : (this.stopClass_rules.date.error = false);
          el.length == 0 ? (status = false) : (status = true);
        }
        if (!status) {
          return false;
        }
        if (key == "remark") {
          el.length == 0
            ? (this.stopClass_rules.remark.error = true)
            : (this.stopClass_rules.remark.error = false);
          el.length == 0 ? (status = false) : (status = true);
        }
      }
      if (!status) {
        return status;
      }
      this.addData(this.stopClass);
    },
    // 添加停课日
    addStopCalendar() {
      this.stopClassVisible = true;
    },
    // 添加暑期
    addSummary(index) {
      this.calendar.summary.push({ value: [] });
    },
    //删除暑期
    deleteSummary(index) {
      this.calendar.summary.splice(index, 1);
    },
    // 关闭弹框
    closeDialog() {
      this.stopClass = {
        date: [],
        remark: ""
      };
      this.opear = {}
      this.status = false;
    }
  }
};
</script>
<style lang="scss" scoped>
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
    padding: 0 20px;
    .body_title {
      overflow: hidden;
      line-height: 32px;
      color: #666;
      padding-bottom: 16px;
      .el-button {
        float: right;
      }
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