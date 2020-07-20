<template >
  <div id="scheduledetail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课情况</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="add_title">{{teacher_name}}<span>{{account}}</span></h2>
    <div class="detail">
      <el-tabs type="border-card">
        <el-tab-pane label="色块表" v-if="scheduleJurisdiction.block">
          <detail-block :teacherId="teacher_id"></detail-block>
        </el-tab-pane>
        <el-tab-pane label="排课详情" v-if="scheduleJurisdiction.lookdetail">
          <detail-list :teacherId="teacher_id"></detail-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { AdTitle } from "@UI";
import DetailList from "./components/DetailList";
import DetailBlock from "./components/DetailBlock";
import {mapGetters} from 'vuex'
export default {
  name: "ScheduleDetail",
  components: {
    AdTitle,
    DetailBlock,
    DetailList
  },
  data() {
    return {
      query: "",
      tabsName: "detail",
      teacher_id:'',
      teacher_name:'',
      account:''
    };
  },
  computed:{
    ...mapGetters(['scheduleJurisdiction'])
  },
  created(){
    console.log(this.$route.query.teacher_id);
    const {teacher_id,account,teacher_name} = this.$route.query
    this.teacher_id = teacher_id
    this.account = account
    this.teacher_name =teacher_name
  }
};
</script>
<style lang="scss" scoped>
#scheduledetail {
  min-height: 100%;
  .add_title{
    span{
      color: #999;
      font-size:16px ;
      margin-left: 20px;
    }
  }

  .detail {
    overflow: hidden;
    box-sizing: border-box;
    margin: 10px 0;
  }
  .title_show {
    overflow: hidden;
    box-sizing: border-box;
    margin: 0 20px;
    border-bottom: 1px solid #eee;
    > h2 {
      min-width: 200px;
      font-size: 24px;
      float: left;
      line-height: 60px;
    }
    > div {
      min-width: 300px;
      float: right;
      height: 32px;
      padding-top: 16px;
      button {
        float: right;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
#scheduledetail{
  .el-breadcrumb__inner {
    color: #333 !important;
    &.is-link{
      color: #999 !important;
    }
  }
  .el-tabs.el-tabs--top.el-tabs--border-card {
  border: 0;
  background: rgba(0, 0, 0, 0);
}
.el-tabs--border-card > .el-tabs__header {
  border: 0;
  background: rgba(0, 0, 0, 0);
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  border: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  color: #6c37a0;
}
.el-tabs--top.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:last-child {
  margin-left: 10px;
  background: linear-gradient(#f9f9f9, #ffffff);
}
.el-tabs__content {
  background: #fff;
  padding: 15px 0 !important;
}
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #6c37a0;
  background: #fff;
}
}

</style>