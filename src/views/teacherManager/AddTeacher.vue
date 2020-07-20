<template>
  <div class="addTeacher">
    <div class="top-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/teacher' }">教师管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        type="primary"
        size="small"
        class="edit-btn"
        @click="editDetail"
        v-if="!showEdit && defaultBtnLs.indexOf(15) > -1"
      >编辑</el-button>
    </div>
    <div class="add-container">
      <div>
        <!-- 添加加盟教师--个人信息 -->
        <el-form
          :model="personalRuleForm"
          :rules="personalRules"
          label-position="left"
          ref="personalRuleForm"
          label-width="80px"
        >
          <!-- <div class="border-box"></div> -->
          <p class="personal-title">个人信息</p>
          <div class="personal-style box-border">
            <el-form-item label="姓名" size="mini" prop="name">
              <el-input
                v-model="personalRuleForm.name"
                type="text"
                v-if="showEdit"
                placeholder="请填写老师姓名"
              ></el-input>
              <span v-if="!showEdit">{{personalRuleForm.name || '-'}}</span>
            </el-form-item>
            <el-form-item label="姓名拼音" size="mini" prop="surname" v-if="surnameShow">
              <el-input
                v-model.trim="personalRuleForm.surname"
                type="text"
                placeholder="请填写老师姓名拼音"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别" size="mini" prop="sex">
              <el-radio-group v-model="personalRuleForm.sex" v-if="showEdit">
                <el-radio :label="'1'">男</el-radio>
                <el-radio :label="'2'">女</el-radio>
              </el-radio-group>
              <span v-if="!showEdit">{{personalRuleForm.sex_name}}</span>
            </el-form-item>
            <el-form-item label="手机号" size="mini" prop="phone">
              <el-input
                v-model="personalRuleForm.phone"
                type="text"
                v-if="showEdit"
                placeholder="请填写教师手机号"
                maxlength="11"
                oninput="this.value=this.value.replace(/[^0-9]/g,'');"
              ></el-input>
              <span v-if="!showEdit">{{personalRuleForm.phone || '-'}}</span>
            </el-form-item>
            <el-form-item label="教师类型" size="mini" prop="jiameng" class="personal-from">
              <el-radio-group v-model="personalRuleForm.jiameng" v-if="showEdit">
                <el-radio :label="'2'">1+3加盟</el-radio>
                <el-radio :label="'3'">单店加盟</el-radio>
                <el-radio :label="'4'">兼职</el-radio>
              </el-radio-group>
              <span v-if="!showEdit">{{personalRuleForm.jiameng_name || '-'}}</span>
            </el-form-item>
          </div>
        </el-form>
        <form-list
          :listType="listType"
          :defaultBtnLs="defaultBtnLs"
          :teacherIds="teacherIds"
          :addstatus="'addTeacher'"
          :dataDetail="addTeacherDetail"
          @rules="setRules"
          @refreshTeacherDetail="getTeacherInfo"
          :addRuleForm="personalRuleForm"
        ></form-list>
      </div>
    </div>
  </div>
</template>

<script>
import { teacherdetail } from "../../api/index";

import formList from "../../components/formList";
import { defaultOperationBtn } from '@/utils/tools'

var validatephone = (rule, value, callback) => {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error("手机号格式错误"));
    return false;
  } else {
    callback();
  }
};

var validateAccount = (rule, value, callback) => {
  const reg = /^[A-Za-z]+$/;
  if (!reg.test(value) || value.length > 30) {
    callback(new Error("姓名拼音不能为中文、数字或特殊字符"));
    return false;
  } else {
    callback();
  }
};
export default {
  components: {
    formList
  },
  data() {
    return {
      listType: "editTeacher",
      personalRuleForm: {
        name: "",
        surname: "",
        sex: "",
        sex_name: "",
        phone: "",
        jiameng: "",
        jiameng_name: ""
      },

      personalRules: {
        name: [
          { required: true, message: "请填写老师姓名", trigger: "blur" }
        ],
        surname: [
          { required: true, message: "请填写老师姓名拼音", trigger: "blur" },
          { min: 1, max: 30, message: '输入拼音过长（应小于30位）', trigger: 'blur' },
          { validator: validateAccount, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请填写性别" }],
        phone: [
          { required: true, message: "请填写教师手机号", trigger: "blur" },
          { validator: validatephone, trigger: "blur" }
        ],
        jiameng: [{ required: true, message: "请填写教师类型" }]
      },
      showEdit: true,
      addTeacherDetail: null,
      teacherIds: "",
      listShow: false,
      title:'',
      surnameShow: false // 编辑时不可改变姓名拼音
    };
  },
  created() {
    this.teacherIds = this.$route.query;
    this.defaultBtnLs = defaultOperationBtn(this.$store.getters.menuBtn);
    if (this.$route.query.id) {
      this.listShow = this.defaultBtnLs.indexOf(13) > -1 || this.defaultBtnLs.indexOf(15) > -1  ? true : false;
    } else {
      this.listShow = this.defaultBtnLs.indexOf(14) > -1 ? true : false;
    }
  },
  mounted() {
    if (this.listShow && this.$route.query.id) {
      this.getTeacherInfo();
    }
    this.title = this.listShow && this.$route.query.id ? '编辑教师' :'添加教师'
    this.surnameShow = this.listShow && this.$route.query.id ? false : true
    console.log(this.surnameShow);
    },
  methods: {
    // 获取教师详情
    getTeacherInfo(val) {
      if (val == "commitSuccess") {
        if(this.title == '添加教师'){
          this.$router.push('/teacher')
          return
        }else{
        this.showEdit = false;
        }
      }
      if (this.$route.query.origin_type == 2 || this.$route.query.origin_type == 3) {
        this.listType = "addTeacherDetail";
        this.showEdit = false;
      }
      teacherdetail({
        id: this.$route.query.id
      }).then(res => {
        if (res && res.length == 0) return;
        const values = res[0];
        this.addTeacherDetail = values;
        let joining_status = "";
        switch (values.joining_status) {
          case "1":
            joining_status = "直营";
            break;
          case "2":
            joining_status = "1+3加盟";
            break;
          case "3":
            joining_status = "单店加盟";
            break;
          case "4":
            joining_status = "兼职";
            break;
        }
        this.personalRuleForm.name = values.name;
        this.personalRuleForm.surname = '';
        this.personalRuleForm.phone = values.mobile;
        this.personalRuleForm.sex = values.gender;
        this.personalRuleForm.sex_name = values.gender_name;
        this.personalRuleForm.jiameng = values.joining_status;
        this.personalRuleForm.jiameng_name = joining_status;
      });
    },

    // 个人信息页面的表单验证
    setRules() {
      this.$refs["personalRuleForm"].validate(valid => {
        if (valid) {
        } else {
          return;
        }
      });
    },
    // 编辑
    editDetail() {
      this.listType = "editTeacher";
      this.showEdit = true;
    }
  }
};
</script>

<style lang="scss" scoped>
$bg-color: #774c90;
.addTeacher {
  height: 100%;
  padding: 20px;
  text-align: left;
  // max-width: 1000px;
}
.top-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
 .edit-btn {
    width: 96px;
    height: 32px;
    background: $bg-color;
    border-radius: 3px;
    border-color: $bg-color;
    font-size: 14px;
    float: right;
    margin-bottom: 20px;
  }
}
.add-container {
  padding: 30px;
  background: white;

  .personal-title {
    font-weight: bold;
    padding: 14px 33px;
    background: #fafafa;
  }
 
  .box-border {
    border: 1px solid #eee;
    padding-left: 36px;
    margin: 0 0 30px 0;
  }
}
.personal-style {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 24px 0 0;
  margin: 0 0 0 36px;
  .el-form-item {
    width: 33%;
    margin: 0 30px 18px 10px;
  }
  .personal-from {
    width: 60% !important;
  }
}
</style>
