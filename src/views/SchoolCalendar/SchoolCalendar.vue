<template>
  <div id="school_calendar">
    {{menuBtn}}
    <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">信息配置</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/calendar/index' }">校历管理</el-breadcrumb-item>
  </el-breadcrumb>
    <ad-title title="校历管理">
      <el-button type="primary" size="small" v-if="add" class="el-button--main" @click="addCanlendar">添加新校历</el-button>
    </ad-title>
    <div class="choose">
      <el-select class="lcoal" v-model="classNumber" placeholder="请选择学期" size="small" @change="yearChange">
        <el-option :label="year.label" :value="year.value" v-for="(year) in semester" :key="year.value"></el-option>
      </el-select>
      <el-select class="class" v-model="className" placeholder="请选择校历" size="small">
        <el-option :label="school.name" :value="school.calendar_id" v-for="(school) in schoolCalendar" :key="school.calendar_id"></el-option>
      </el-select>
      <el-button v-if="changclass" class="add " type="text"  @click="changeClass" size="small"><img class="markChange" src="../../assets/edit.png" alt="" >修改上课日</el-button>
      <el-button v-if="changestop" class="add el-text--main" type="text"   plain @click="changeStopclass" size="small"><img class="markChange1" src="../../assets/change.png" alt="" > 修改停课日</el-button>
    </div>
    <div class="look">
      <div class="look_title" v-if="calendarName&&yearName">
        <label>{{calendarName?calendarName:''}}</label>
        <label>({{yearName?yearName:''}})</label>
      </div>
      <div class="look_panel">
        <div class="kong" v-if="!className&&!classNumber">
          <img src="../../assets/kong.png" alt="">
          <div>当前系统中无校历，快去添加新校历吧~</div>
        </div>
        <div class="panel_class" v-else>
          <div class="class_context class_context_special">
           <ad-panel color="success" name="暑假" :data="summer"  :disabled="true" mark="special" ></ad-panel>
           <ad-panel color="warning" name="秋季" :data="autumn" format="complex" :disabled="true"></ad-panel>
           <ad-panel color="primary" name="寒假" :data="winter"  :disabled="true"></ad-panel>
           <ad-panel color="main" name="春季" format="complex" :data="spring" :disabled="true" ></ad-panel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {listcalendar,getcalendar} from "@/api/calendar"
import { AdPanel,AdInput,AdTitle } from "@UI";
import { mapGetters,mapState} from 'vuex'
export default {
  name: "schoolindex",
  components: {
    AdPanel,
    AdInput,
    AdTitle
  },
  data() {
    return {
      classNumber: null,
      className: '',
      semester:[],
      schoolCalendar:[],
      calendarList:{},
      formLabelWidth:'72px',
      stopCalendar:false,
      defaultSchool:'',
      chooseData:{},
      limit:{}
      
    };
  },

  watch: {
    className(newValue, oldValue) {
       this.getList(this.className)
    }
  },
  computed:{
    add(){
      let status = this.limit.menuBtn&&this.limit.menuBtn.filter(item =>{
        return item.node_id === '17'
      })
      return status&&status.length>0
    },
     changestop(){
      let status =  this.limit.menuBtn&&this.limit.menuBtn.filter(item =>{
        return item.node_id === '23'
      })
      return status&&status.length>0
    },
     changclass(){
      let status = this.limit.menuBtn&&this.limit.menuBtn.filter(item =>{
        return item.node_id === '21'
      })
      return status&&status.length>0
    },
    summer(){
      return this.calendarList.summer || {}
    },
    autumn(){
      return this.calendarList.autumn || {}
    },
    winter(){
      return this.calendarList.winter || {}
    },
    spring(){
      return this.calendarList.spring || {}
    },
    yearName(){
      return this.semester.length>0&&this.classNumber&&this.semester.filter(item => {
        console.log(item.value == this.classNumber);
        return item.value == this.classNumber
      })[0].label
    },
    calendarName(){
       return this.className &&this.schoolCalendar.length>0&& this.schoolCalendar.filter(item => {
        return item.calendar_id == this.className
      })[0].name
    }
  },
created(){
  this.limit = this.$store.state.index
 this.getCalendar()
},
  methods: {
    yearChange(){
      let num = this.classNumber
      this.handleData(num)
    },
    changeStopclass(){
      if(!this.classNumber || !this.className){
        this.$message.error('请添加校历')
        return false
      }
      this.$router.push({
        name:"changestopclass",
        query:{
          id:this.className,
          year:this.classNumber,
          calendar:this.calendarName
        }
      })
    },
    changeClass(){
      if(!this.classNumber || !this.className){
        this.$message.error('请添加校历')
        return false
      }
      this.$router.push({
        name:"changeclass",
        query:{
          id:this.className,
          year:this.classNumber,
          calendar:this.calendarName
        }
      })
    },
    // 处理数据
    handleData(year = new Date().getFullYear()){
      let data = this.chooseData
      this.semester = []
      this.schoolCalendar= []
       for (const key in data) {
          const element = data[key];
          if(key == year){
            this.schoolCalendar = [...element]
             let classname = element.filter(item =>{
            return item.name === '全国统一校历'
          })
          this.className = classname.length > 0?classname[0].calendar_id :element[0].calendar_id
          }
          if(key !== 'default'){
          this.semester.push({value:parseInt(key),label:`${key}~${parseInt(key)+1}`})
         }
        }
    },
    //获取校历 
     getCalendar(){
      getcalendar().then(data =>{
        if(JSON.stringify(data) !== '{}'){
           this.chooseData = Object.assign({},data)
         this.classNumber = parseInt(Object.keys(data)[0])
         this.handleData(this.classNumber)
         if(data['default']){
           this.className  = data['default']
         } 
        }
      }).catch(err=>{
        console.log("err",err);
      })
    },
    // 获取校历列表
    async getList(id){
      const data = await listcalendar({calendar_id:id})
      this.calendarList = Object.assign({},data)
    },
    //添加新校历
    addCanlendar(){
      this.$router.push({
        name:"addcalendar",
      })
    },
    //设置校历
    setCanlendar(){
      this.calendarVisiable =true
    },
    //添加备注
     addRemark() {
        this.$prompt('备注信息', `添加备注`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-z]{0,30}$/,
          inputErrorMessage:'最多输入30个字',
          inputPlaceholder:'请输入备注信息'
        }).then(({ value }) => {
         this.remarks = value
        }).catch(() => {
          console.log("取消备注");      
        });
      }
  }
};
</script>
<style lang="scss" scoped>
.add_btn{
  color: #999 !important;
}
.markChange{
  width: 15px;
  height: 17px;
  float: left;
  margin-right: 2px;
  margin-top: -2px;
}
.markChange1{
  width: 17px;
  height: 19px;
  float: left;
  margin-right: 2px;
  margin-top: -2px;
}
#school_calendar {
  min-height: 100%;
  overflow: hidden;
  .choose {
    background: #f3f3f3;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px;
    .lcoal {
      float: left;
    }
    .class {
      float: left;
      margin-left: 10px;
    }
    .add {
      &.add_btn{
        color: #999 !important;
      }
      float: right;
      margin-left: 10px;
      &:hover{
        background: rgba(0, 0, 0, 0);
        outline: none;
        border-color: rgba(0, 0, 0, 0);
      }
    }
  }
  .look {
    overflow: hidden;
    padding: 0 20px;
    padding-bottom: 20px;
     background: #f3f3f3;
    .look_title {
      color: #333;
      overflow: hidden;
      padding: 10px 20px;
      line-height: 32px;
      background: #fff;
      font-size: 16px;
      border-bottom: 1px solid #ddd;
      label {
        float: left;
        &:last-child{
          margin: 0 6px;
        }
      }
      .look_btn {
        float: right;
      }
    }
    > .look_panel {
      background: #fff;
      padding: 10px 20px;
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
      div.kong{
        text-align: center;
        margin-top: 200px;
        margin-bottom: 200px;
        img{
          width:463px ;
          height: 327px;
        }
        div {
          margin-top: -40px;
          width: 100%;
          color:#999999 ;
          line-height: 24px;
        }
      }
    }
  }
  .panel_class,
  .panel_stopclass {
    &.opcital {
      background: rgba(0, 0, 0, 0);
    }
    overflow: hidden;
    margin-bottom: 10px;
    .class_title {
      overflow: hidden;
      margin-bottom: 10px;
      span {
        font-weight: 400;
        margin-right: 10px;
      }
      label {
        cursor: pointer;
        font-size: 700;
        color: #009da0;
      }
    }
    .class_context {
      overflow: hidden;
      &.class_context_special{
      min-height: 100px;
      position: relative;
      .class_warning{
        position: absolute;
        left: 0;
        top: 34px;
        line-height: 70px;
        z-index: 2;
        width: 100%;
      }
    }
      &.remarks{
        background: #fff;
        padding: 10px;
        box-sizing: border-box;
      }
      .class_warning,.stopclass_warning{
        line-height: 40px;
        padding-left: 10px;
        box-sizing: border-box;
        background: #fff;
        .success{
          cursor: pointer;
        }
      }
      .remarks_warning{
        line-height: 30px;
        min-height: 30px;
        background: #fff;
        .success{
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style lang="scss">
#school_calendar {
  .school_calendar{
    width: 80%;
  }
  .stopClass{
       .el-date-editor {
    width:100%
  }
  }
 
}
</style>
