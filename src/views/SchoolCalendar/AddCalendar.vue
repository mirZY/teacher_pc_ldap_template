<template >
  <div class="add_calendar" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="breadcrumb">
      <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">信息配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/calendar/index' }">校历管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加新校历</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <ad-title title="添加新校历">
      <el-button
        v-if="step == 2"
        type="primary"
        class="el-button--main"
        size="small"
        @click="addStopCalendar"
      >添加停课日</el-button>
    </ad-title>
    <div class="add_body">
      <div class="step_context">
        <ad-step :step="step" :stepData="stepData"></ad-step>
      </div>
      <el-form
        ref="calendar_attribute"
        v-if="step === 0"
        :rules="calendar_attribute_rules"
        :model="calendar_attribute"
        label-width="100px"
        label-position="right"
        class="add_form"
      >
        <el-row>
          <el-col :span="10" :offset="6">
            <el-form-item label="学年: " prop="study_year">
              <el-select v-model="calendar_attribute.study_year" placeholder="请选择学年" size="small">
                <el-option label="2020～2021" :value="2020"></el-option>
                <el-option label="2021～2022" :value="2021"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市: " prop="city_id">
              <el-select
                v-model="calendar_attribute.city_id"
                filterable
                placeholder="请选择城市"
                size="small"
              >
                <el-option
                  :label="city.region_name"
                  :value="city.region_id"
                  v-for="(city) in cityList"
                  :key="city.region_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="利润中心: " prop="product_id">
              <el-select v-model="calendar_attribute.product_id" placeholder="请选择利润中心" size="small">
                <el-option label="全部利润中心" value="0" key="0"></el-option>
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item) in profitList"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10" :offset="6" class="add_btn">
            <el-button
              type="primary"
              class="el-button--main"
              @click="saveAttribute"
              size="small"
            >下一步</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        ref="calendar_date"
        :rules="calendar_date_rules"
        :model="calendar_date"
        label-width="100px"
        :label-position="labelPosition"
        class="add_form"
        v-if="step == 1"
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
              :picker-options="pickeAutumn"
              :rules="[{required: true, message: `请选择秋季上课日期`, trigger: 'change'}]"
              v-for="(item,index)  in calendar_date.autumn"
              :key="index"
            >
              <el-date-picker
                size="small"
                v-model="item.value"
                type="daterange"
                :default-value="daylimit.autumn"
                :picker-options="pickeAutumn"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <span
                class="el-icon-delete deleted success"
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
                value-format="yyyy-MM-dd"
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
                :picker-options="pickeSpring"
                type="daterange"
                range-separator="~"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="6" class="add_btn">
            <el-button type="info" plain @click="upStep" size="mini">上一步</el-button>
            <el-button type="primary" class="el-button--main" @click="nextStep" size="mini">下一步</el-button>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="step==2" class="salendar_result">
        <div
          class="salendar_result"
        >{{calendarName}}（{{calendar_attribute.study_year}}~{{calendar_attribute.study_year+1}}）停课日</div>
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
            format="auto"
            :data="winter"
            :disabled="false"
            @opear="winterBack"
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
          <el-button type="info" plain @click="upStep" size="mini">上一步</el-button>
          <el-button type="primary" class="el-button--main" @click="submitData" size="mini">保存</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      :title="`${status?'修改':'添加'}停课日`"
      :visible.sync="stopClassVisible"
      width="600px"
      custom-class="stopClass"
      @close="closeDialog"
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
            :default-value="daylimit.summer"
            :picker-options="pickeStopClass"
            range-separator="~"
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
import { AdPanel, AdTitle, AdInput, AdStep } from "@UI";
import {
  citylist,
  profitlist,
  checkexist,
  addcalendar,
  checkdate
} from "@/api/calendar";
import { formatTime } from "@tools";

export default {
  name: "addCalendar",
  components: {
    AdTitle,
    AdStep,
    AdPanel,
    AdInput
  },
  data() {
    return {
      fullscreenLoading: false,
      daylimit: {
        summer: "",
        autumn: "",
        winter: "",
        spring: ""
      },
      calendar_stopclass: {
        summer: [],
        autumn: [],
        winter: [],
        spring: []
      },
      cityList: [],
      profitList: [],
      stopClassVisible: false,
      labelPosition: "right",
      step: 0,
      stepData: ["选择校历归属", "设置上课日期", "设置停课日"],
      calendar_attribute_rules: {
        study_year: [
          { required: true, message: "请选择学年", trigger: "change" }
        ],
        city_id: [{ required: true, message: "请选择城市", trigger: "change" }],
        product_id: [
          { required: true, message: "请选择利润中心", trigger: "change" }
        ]
      },
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
      calendar_attribute: {
        study_year: new Date().getFullYear(),
        city_id: "52",
        product_id: "0"
      },
      calendar_date: {
        summer: [{ value: [] }, { value: [] }, { value: [] }],
        autumn: [{ value: [] }],
        winter: [{ value: [] }, { value: [] }, { value: [] }],
        spring: [{ value: [] }]
      },
      stopClass: {
        date: "",
        remark: ""
      },

      pickeSummer: {},
      pickeAutumn: {},
      pickeWinter: {},
      pickeSpring: {},
      pickeStopClass: {},
      status: false,
      opear: {}
    };
  },
  computed: {
    profitName() {
      return (
        this.profitList.length > 0 &&
        this.profitList.filter(item => {
          return item.id == this.calendar_attribute.product_id;
        })[0].name
      );
    },
    calendarName() {
      let city =
        this.cityList.length > 0 &&
        this.cityList.filter(item => {
          return item.region_id == this.calendar_attribute.city_id;
        })[0];
      if (this.calendar_attribute.product_id == "0") {
        if (city.region_id == "52") {
          return "全国通用校历";
        } else {
          return `${city.region_name}专属校历`;
        }
      } else {
        return `${this.profitName}(${city.region_name})专属校历`;
      }
    },
    summer() {
      return { stop_class_day: this.calendar_stopclass.summer } || {};
    },
    autumn() {
      return { stop_class_day: this.calendar_stopclass.autumn } || {};
    },
    winter() {
      return { stop_class_day: this.calendar_stopclass.winter } || {};
    },
    spring() {
      return { stop_class_day: this.calendar_stopclass.spring } || {};
    }
  },
  watch: {
    calendar_attribute: {
      deep: true,
      handler(newValue, oldValue) {
        this.calendar_date = {
          summer: [{ value: [] }, { value: [] }, { value: [] }],
          autumn: [{ value: [] }],
          winter: [{ value: [] }, { value: [] }, { value: [] }],
          spring: [{ value: [] }]
        };
        this.calendar_stopclass = {
          summer: [],
          autumn: [],
          winter: [],
          spring: []
        };
      }
    },
    calendar_date: {
      deep: true,
      handler(newValue, oldValue) {
        this.calendar_stopclass = {
          summer: [],
          autumn: [],
          winter: [],
          spring: []
        };
      }
    },
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
    this.getCityList();
    this.getProfitList();
  },
  methods: {
    addData(date) {
      const { autumn, summer, spring, winter } = this.calendar_date;
      let types = {
        summertype: false,
        autumntype: false,
        springtype: false,
        wintertype: false
      };
      let data = [date.date[0], date.date[1]];
      let remark = date.remark;
      types.summertype = summer.some(item => {
        return (
          item.value[0] <= data[0] &&
          data[0] <= item.value[1] &&
          item.value[0] <= data[1] &&
          data[1] <= item.value[1]
        );
      });
      types.autumntype = autumn.some(item => {
        return (
          item.value[0] <= data[0] &&
          data <= item.value[1] &&
          item.value[0] <= data[1] &&
          data[1] <= item.value[1]
        );
      });
      types.springtype = spring.some(item => {
        return (
          item.value[0] <= data[0] &&
          data[0] <= item.value[1] &&
          item.value[0] <= data[1] &&
          data[1] <= item.value[1]
        );
      });
      types.wintertype = winter.some(item => {
        return (
          item.value[0] <= data[0] &&
          data[0] <= item.value[1] &&
          item.value[0] <= data[1] &&
          data[1] <= item.value[1]
        );
      });
      for (const key in types) {
        const element = types[key];
        if (element) {
          let ke = key.slice(0, -4);
          let calendar_stop = [...this.calendar_stopclass[ke]];
          let stopstatus = calendar_stop.filter((item, index) => {
            if (index == this.opear.order) {
              return false;
            } else {
              if (data[0] === data[1]) {
                return item.begin_time <= data[0] && item.end_time >= data[1];
              } else {
                return (
                  (item.begin_time <= data[0] && data[1] <= item.end_time) ||
                  (item.begin_time >= data[0] &&
                    item.begin_time <= data[1] &&
                    item.end_time >= data[1]) ||
                  (item.begin_time <= data[0] &&
                    item.end_time >= data[0] &&
                    item.end_time <= data[1]) ||
                  (item.begin_time >= data[0] && item.end_time <= data[1])
                );
              }
            }
          });
          let opear = Object.assign({}, this.opear);
          if (stopstatus.length > 0) {
            if (data[0] === data[1]) {
              this.$message.error(`${data[0]}不可重复设置停课日`);
            } else {
              this.$message.error(`${data[0]}~${data[1]}不可重复设置停课日`);
            }
            return false;
          } else {
            if (opear["type"] === "edit") {
              let { order } = opear;
              this.calendar_stopclass[ke].splice(order, 1, {
                begin_time: data[0],
                end_time: data[1],
                remark
              });
            } else {
              this.calendar_stopclass[ke].push({
                begin_time: data[0],
                end_time: data[1],
                remark
              });
            }
          }
        }
      }
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
        return false;
      } else {
        this.stopClassVisible = false;
      }
    },
    // 关闭弹框
    closeDialog() {
      this.stopClass = {
        date: [],
        remark: ""
      };
      this.opear = {};
      this.status = false;
    },
    //提交校历数据
    submitData() {
      let calendar = {};
      let calendar_date = {};
      let data = Object.assign({}, this.calendar_date);
      for (const key in data) {
        const element = data[key];
        if (key === "summer" || key === "winter") {
          calendar_date[key] = element.map(item => {
            return {
              begin_time: item.value[0],
              end_time: item.value[1]
            };
          });
        } else {
          calendar_date[key] = {
            begin_time: element[0].value[0],
            end_time: element[0].value[1]
          };
        }
      }

      let submitValue = Object.assign(
        {},
        this.calendar_attribute,
        calendar_date
      );
      submitValue.stop_class_day = this.calendar_stopclass;
      this.fullscreenLoading = true;
      addcalendar(submitValue)
        .then(res => {
          if (JSON.stringify(res) === "{}") {
            this.fullscreenLoading = false;
            this.$router.push({
              name: "index"
            });
          }
        })
        .catch(err => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    // 获取利润中心
    async getProfitList() {
      const data = await profitlist();
      this.profitList = [...data];
    },
    // 获取城市
    async getCityList() {
      const data = await citylist();
      this.cityList = [...data];
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
        this.calendar_stopclass[types].splice(order, 1);
      } else {
        this.stopClassVisible = true;
        this.opear = Object.assign({}, { type, order, types });
        let data = this.calendar_stopclass[types].slice(order, order + 1)[0];
        this.stopClass.date = [data.begin_time, data.end_time];
        this.stopClass.remark = data.remark;
      }
      this.status = true;
    },
    // 提交数据
    saveData() {
      let status = false;
      for (const key in this.stopClass) {
        let el = this.stopClass[key];
        if (key == "date") {
          el.length == 0
            ? (this.stopClass_rules.date.error = true)
            : (this.stopClass_rules.date.error = false);
          el.length == 0 ? (status = false) : (status = true);
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
    //初始化假期设置
    initDay(year) {
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
            time.getTime() < new Date(year, 5, 1).getTime() ||
            time.getTime() > new Date(year + 1, 6, 31).getTime()
          );
        }
      };
    },
    // 属性设置
    saveAttribute() {
      let that = this;
      this.$refs.calendar_attribute.validate(valid => {
        if (valid) {
          checkexist(that.calendar_attribute).then(res => {
            that.step++;
          });
        } else {
          this.$message.error("请完善信息");
        }
      });
      let year = parseInt(that.calendar_attribute.study_year);
      let daylimit = {
        summer: new Date(year, 5, 1),
        autumn: new Date(year, 7, 1),
        winter: new Date(year, 11, 1),
        spring: new Date(year + 1, 1, 1)
      };
      this.daylimit = Object.assign({}, daylimit);
      this.initDay(this.calendar_attribute.study_year);
    },
    upStep() {
      if (this.step !== 0) {
        this.step--;
      } else {
        return false;
      }
    },
    async checkDate() {
      let calendar = {};
      let calendar_date = {};
      let data = Object.assign({}, this.calendar_date);
      for (const key in data) {
        const element = data[key];
        if (key === "summer" || key === "winter") {
          calendar_date[key] = element.map(item => {
            return {
              begin_time: item.value[0],
              end_time: item.value[1]
            };
          });
        } else {
          calendar_date[key] = {
            begin_time: element[0].value[0],
            end_time: element[0].value[1]
          };
        }
      }

      let submitValue = Object.assign(
        {},
        this.calendar_attribute,
        calendar_date
      );
      checkdate(submitValue)
        .then(res => {
          this.step++;
        })
        .catch(err => {
          console.log(err);
        });
    },
    nextStep() {
      if (this.step == 1) {
        let that = this;
        this.$refs.calendar_date.validate(valid => {
          if (valid) {
            that.checkDate();
          } else {
            this.$message.error("请完善信息");
          }
        });
      }
    },
    // 添加暑期
    addSummary(types, index) {
      this.calendar_date[types].push({ value: [] });
    },
    //deleteSummary
    deleteSummary(types, index) {
      if (index == 0 && this.calendar_date[types].length == 1) {
        return false;
      }
      this.calendar_date[types].splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.add_calendar {
  .breadcrumb{
    overflow: hidden;
    .el-breadcrumb__item:last-child{
      margin-top: 2px;
    }
  }
  .disabled {
    color: #999;
  }
  overflow: hidden;
  width: 100%;
  background: #f9fafb;
  .add_body {
    overflow: hidden;
    box-sizing: border-box;
    margin: 20px 0;
    background: #fff;
    padding: 20px;
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