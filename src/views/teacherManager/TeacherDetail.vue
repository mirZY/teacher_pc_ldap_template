<template>
  <div class="teacherDetail">
    <div class="personal">
      <div class="top-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/teacher' }">教师管理</el-breadcrumb-item>
          <el-breadcrumb-item>教师详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button
          type="primary"
          size="small"
          class="edit-btn"
          @click="editDetail"
          v-show="!showEdit && defaultBtnLs.indexOf(15) > -1"
        >编辑</el-button>
      </div>
      <div v-if="!listShow">
        <p class="n-list">暂无权限</p>
      </div>
      <div class="teacher-container" v-else>
        <div class="teacher-person">
          <el-form
            class="detail-form"
            :model="detailForm"
            label-position="right"
            ref="detailForm"
          >
            <p class="personal-title">个人信息</p>
            <div class="box-border">
              <div class="base-message">
                <ul>
                  <li v-for="(val,key,i) in baseList" :key="i">
                    <span>{{key}}</span>
                    <span>{{val || '-'}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-form>
        </div>
        <form-list
          :listType="listType"
          :dataDetail="dataDetail"
          :defaultBtnLs="defaultBtnLs"
          :teacherIds="teacherIds"
          :detailForm="detailForm"
          @rules="setDetailRules"
          @refreshTeacherDetail="getTeacherInfo"
        ></form-list>
      </div>
    </div>
  </div>
</template>

<script>
import FormList from "../../components/formList";
import { teacherdetail } from "../../api/index";
import { defaultOperationBtn } from '@/utils/tools'

export default {
  components: {
    FormList
  },
  data() {
    return {
      listType: "teacherDetail",
      dataDetail: null,
      showEdit: false,
      detailForm: {
      },
      baseList: {},
      teacherIds: "",
      defaultBtnLs: "",
      listShow: false
    };
  },
  created() {
    this.teacherIds = this.$route.query;
    this.defaultBtnLs = defaultOperationBtn(this.$store.getters.menuBtn);
    this.listShow = this.defaultBtnLs.indexOf(13) > -1 || this.defaultBtnLs.indexOf(15) > -1 ? true : false;
  },
  mounted() {
    this.getTeacherInfo();
    
  },
  methods: {
    // 获取教师详情
    getTeacherInfo(val) {
      if (val == "commitSuccess") {
        this.showEdit = false;
        this.listType = 'teacherDetail'
      }
      teacherdetail({
        id: this.$route.query.id
      })
        .then(res => {
          if (res && res.length == 0) return;
          const values = res[0];
          this.dataDetail = values;

          let education = "";
          switch (values.education) {
            case "0":
              education = "-";
              break;
            case "1":
              education = "专科";
              break;
            case "2":
              education = "本科";
              break;
            case "3":
              education = "硕士";
              break;
            case "4":
              education = "博士";
              break;
          }
          let staff_type = "";
          switch (values.staff_type) {
            case "0":
              staff_type = "-";
              break;
            case "1":
              staff_type = "全职";
              break;
            case "2":
              staff_type = "兼职";
              break;
            case "3":
              staff_type = "实习";
              break;
            case "4":
              staff_type = "加盟";
              break;
          }

          let birthday = values.birthday.slice(0, 10);
          birthday = birthday.indexOf('0000-01-01') > -1 ? '-' : birthday;
          let entry_time = values.entry_time.slice(0, 10);
          entry_time = entry_time.indexOf('0000-01-01') > -1 ? '-' : entry_time;
          this.baseList["姓名"] = values.name;
          this.baseList["编码"] = values.account;
          this.baseList["性别"] =
            values.gender === '0' ? "未设置" : (values.gender === '1' ? "男" : "女");
          this.baseList["手机号"] = values.mobile;
          this.baseList["民族"] = values.nation;
          this.baseList["出生日期"] = birthday;
          this.baseList["入职时间"] = entry_time;
          this.baseList["招聘来源"] = values.hire_source_name;
          this.baseList["工作类型"] = staff_type;
          this.baseList["最高学历"] = education;
          this.baseList["毕业院校"] = values.school;
          this.baseList["所学专业"] = values.profession;
          this.baseList["是否签约"] = values.is_sign_teacher == 1 ? "是" : "否";
          this.baseList["司教龄"] = values.teaching_start;
          this.baseList["入职前教龄"] = values.teaching_time;
          this.baseList["加盟情况"] = '直营';

          // 是否有教师资格
          if (values.have_teacher_certificate == 1) {
            this.baseList["教师资格证"] = values.teacher_certificate_number;
            this.baseList["证书学科"] = values.teacher_certificate_subject;
            this.baseList["证书级别"] = values.teacher_certificate_level;
          } else {
            this.baseList["教师资格证"] = "无";
          }
          this.baseList = Object.assign({}, this.baseList);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 编辑
    editDetail() {
      const _this = this
      _this.listType = "editTeacher";
      this.showEdit = true;
    },

    // 控制详情页的表单验证
    setDetailRules() {}
  }
};
</script>

<style lang="scss" scoped>
$bg-color: #774c90;
.teacherDetail {
  height: 100%;
  text-align: left;
  // max-width: 1200px;
}
.teacher-container {
  background: white;
  padding: 31px;
  margin-bottom: 30px;
  .detail-form {
    border: 1px solid #eeeeee;
  }
}
.teacher-person {
  margin-bottom: 20px;
}
.personal {
  .top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 23px;
  }
  .personal-p {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    color: #222333;
  }
  .edit-btn {
    width: 96px;
    height: 32px;
    background: $bg-color;
    border-radius: 3px;
    border-color: $bg-color;
    font-size: 14px;
  }
  .personal-title {
    padding: 14px 33px;
    font-weight: bold;
    background: #fafafa;
  }
  .personal-style {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 0 36px;
    .el-form-item {
      width: 31%;
      margin-right: 2%;
    }
    .common-inp {
      width: 70%;
    }
  }
}
.base-message {
  padding: 0 16px;
  margin: 0 20px 24px;
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
  }
  li {
    list-style: none;
    margin: 10px 0;
    width: 31%;
    margin-right: 2%;
    span:first-child {
      font-size: 14px;
      color: #666;
      margin-right: 20px;
    }
    span:nth-child(2) {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>