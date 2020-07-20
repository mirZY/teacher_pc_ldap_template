<template>
  <div class="user-detail">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-container">
      <el-button
        type="primary"
        size="small"
        class="edit-btn"
        @click="userEditDetail"
        v-if="!showEdit && defaultBtnLs.indexOf(8) > -1"
      >编辑</el-button>
      <el-button
        class="edit-btn"
        v-if="showEdit && defaultBtnLs.indexOf(8) > -1"
        type="primary"
        size="small"
        @click="onSubmit('userRuleForm')"
      >保存</el-button>
      <div v-if="listShow">
        <el-form
          :model="userRuleForm"
          :rules="userRules"
          ref="userRuleForm"
          label-position="left"
          label-width="80px"
        >
          <p class="user-title">用户信息</p>
          <div class="user-style">
            <el-form-item label="账号" size="mini" prop="account">
              <!-- <el-input v-model="userRuleForm.account" type="text" v-if="showEdit"></el-input> -->
              <span>{{userRuleForm.account}}</span>
            </el-form-item>
            <el-form-item label="用户姓名" size="mini">
              <!-- <el-input v-model="userRuleForm.name" type="text" v-if="showEdit"></el-input> -->
              <span>{{userRuleForm.name}}</span>
            </el-form-item>
          </div>
          <p class="user-title">数据权限</p>
          <div class="user-style">
            <el-form-item label="角色" size="mini" prop="roles" class="item-common">
              <el-checkbox-group v-model="userRuleForm.roles" v-if="showEdit" @change="changeRole">
                <el-checkbox
                  v-for="item in roleData"
                  :key="item.id"
                  :label="item.id + ''"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
              <span v-else>{{userRuleForm.roles_name.join('、')}}</span>
              <span v-if="roleTips" class="role-tips">请选择角色</span>
            </el-form-item>

            <el-form-item class="city-data" label="城市数据" size="mini" prop="city">
              <span class="is_required">*</span>
              <el-tree
                v-if="showEditTree"
                :data="cityData"
                :props="cityDefaultProps"
                show-checkbox
                node-key="id"
                ref="city_tree"
                :default-checked-keys="city_default_checked_keys"
                :default-expand-all="true"
                @check="checkTree(1)"
              ></el-tree>

              <el-tree :data="cityData_read" :props="cityDefaultProps" v-if="!showEdit"></el-tree>
              <span v-if="cityTips" class="city-tips">请选择城市数据</span>
            </el-form-item>
            <el-form-item label="利润中心" size="mini" prop="project" class="profit-data">
              <span class="is_required">*</span>
              <el-tree
                v-if="showEditTree"
                :data="profitData"
                :props="cityDefaultProps"
                show-checkbox
                ref="profit_tree"
                node-key="id"
                :default-checked-keys="profit_default_checked_keys"
                :default-expand-all="true"
                @check="checkTree(2)"
              ></el-tree>
              <el-tree :data="profitData_read" :props="cityDefaultProps" v-if="!showEdit"></el-tree>
              <span v-if="profitTips" class="profit-tips">请选择利润中心</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div v-else>
        <p class="n-list">暂无权限</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  usersDetail,
  rolelist,
  // allschool,
  // allprofit,
  schoolids,
  profitcenter,
  setRecord
} from "../../api/index";
var validateCity = (rule, value, callback) => {
  callback();
};
// import { isOperationBtn } from "@/utils/tools";
import { defaultOperationBtn } from '@/utils/tools'

export default {
  data() {
    return {
      showEdit: false,
      showEditTree: false,
      userRules: {
        account: [],
        roles: [{ required: true, message: " ", trigger: "change" }]
      },
      userRuleForm: {
        account: "",
        name: "",
        roles: [],
        roles_name: []
      },
      roleData: [],
      profitData: [],
      profitData_read: [],
      cityData: [],
      cityData_read: [],

      cityDefaultProps: {
        children: "children",
        label: "name"
      },
      city_default_checked_keys: [],
      profit_default_checked_keys: [],
      user_id: "",
      showErr_city: false,
      showErr_profit: false,
      // OperationBtn: {}
      defaultBtnLs: [],
      listShow: false,
      roleTips: false,
      cityTips: false,
      profitTips: false,
      userFlag: true
    };
  },

  mounted() {
    // this.getTeacherInfo();
    // 分配权限
    // const btnList = [3];
    // this.OperationBtn = isOperationBtn(
    //   this.$store.getters.menuBtn,
    //   this.$route.path,
    //   btnList
    // );
    this.defaultBtnLs = defaultOperationBtn(this.$store.getters.menuBtn);
    if (this.defaultBtnLs.indexOf(8) > -1 || this.defaultBtnLs.indexOf(10) > -1) {
      this.listShow = true;
      this.getAllschool();
      this.getAllProfit();
      this.getUserDetail();
    } else {
      this.listShow = false;
    }
  },

  methods: {
    // 获取用户详情
    getUserDetail() {
      const data = {
        id: this.$route.query.id
      };
      usersDetail(data)
        .then(res => {
          if (res && res.length > 0) {
            this.userRuleForm.roles = [];
            this.userRuleForm.roles_name = [];
            const values = res[0];
            this.user_id = values.id;
            this.userRuleForm.account = values.account || "-";
            this.userRuleForm.name = values.name || "-";
            for (let i of values.role_id) {
              this.userRuleForm.roles.push(i.id);
              this.userRuleForm.roles_name.push(i.name);
            }
            const cityReadLs = [];
            this.cityData_read = values.jurisdiction;
            this.profitData_read = values.profititem;
            const jurisdiction = values.jurisdiction;
            const newJurisdiction = [];
            jurisdiction.map(item => {
              newJurisdiction.push(item.id);
            });
            this.city_default_checked_keys = newJurisdiction;
            this.profit_default_checked_keys = values.profit_center_id.split(
              ","
            );
          }
        })
        .catch(err => {});
    },

    // 获取全部校区
    getAllschool() {
      this.cityData = [];
      schoolids({
        type: 0
      })
        .then(res => {
          let cityLs = [];
          for (let i of res) {
            cityLs.push({
              id: i.id,
              name: i.name
            });
          }
          
          this.cityData.push({
            id: 0,
            name: '全部分校',
            children: cityLs
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //  获取利润中心
    getAllProfit() {
      this.profitData = [];
      profitcenter({
        type: 0
      })
        .then(res => {
          let profitLs = [];
          for (let i of res) {
            profitLs.push({
              id: i.id,
              name: i.name
            });
          }
          this.profitData.push({
            id: 0,
            name: '全部利润中心',
            children: profitLs
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //   编辑
    userEditDetail() {
      this.showEdit = true;
      this.getUserDetail();
      this.roleData = [];
      // 获取角色列表
      rolelist()
        .then(res => {
          if (res && res.table_data && res.table_data.length > 0) {
            for (const i of res.table_data) {
              if (i.name) {
                this.roleData.push({
                  id: i.id,
                  label: i.name
                });
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
      setTimeout(() => {
        this.showEditTree = true;
      }, 100);
    },

    handleCheckChange(data, checked, indeterminate) {
    },


    // 提交
    onSubmit(formName) {
      // 角色数据验证
      if (this.userRuleForm.roles.length == 0) {
        this.roleTips = true;
      } else {
        this.roleTips = false;
      }

      // 城市数据验证
      let treeData = this.$refs.city_tree.getCheckedNodes();
      if (treeData.length == 0) {
        this.cityTips = true;
      } else {
        this.cityTips = false;
      }
      // 利润中心验证
      let profitData = this.$refs.profit_tree.getCheckedNodes();
      if (profitData.length == 0) {
        this.profitTips = true;
      } else {
        this.profitTips = false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 角色数据
          if (this.userRuleForm.roles.length == 0 ){
            this.$message.error("有信息项未填写，请重新核对");
            return;
          }
          // 城市数据
          let treeArr = [];
          if (treeData.length == 0) {
            this.$message.error("有信息项未填写，请重新核对");
            return;
          }
          for (let i of treeData) {
            treeArr.push(i.id);
          }
          if (treeArr.indexOf(0) > -1) {
            treeArr = treeArr.splice(1, treeArr.length - 1);
          }

          // 利润中心-项目
          let profitTreeArr = [];

          if (profitData.length == 0) {
            this.$message.error("有信息项未填写，请重新核对");
            return;
          }
          for (let i of profitData) {
            profitTreeArr.push(i.id);
          }
          if (profitTreeArr.indexOf(0) > -1) {
            profitTreeArr = profitTreeArr.splice(1, profitTreeArr.length - 1);
          }
          const data = {
            school_id: treeArr.join(","),
            profit_center_id: profitTreeArr.join(","),
            user_id: this.user_id,
            role_id: this.userRuleForm.roles.join(",")
          };
          if (!this.userFlag) return false;
          this.userFlag = false;
          setRecord(data)
            .then(res => {
              if (!res) return;
              this.$message.success("用户信息修改完毕");
              this.$router.push("/user");
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setTimeout(() => {
                this.userFlag = true;
              }, 500);
            });
        } else {
          this.$message.error("有信息项未填写，请重新核对");
        }
      });
    },

    // 修改角色
    changeRole(val) {
      console.log(val, val.length);
      this.roleTips = val.length > 0 ? false : true;
    },

    // 修改城市数据/利润中心
    checkTree(type) {
      if (type == 1) {
        let cityCheckLs = this.$refs.city_tree.getCheckedNodes();
        this.cityTips = cityCheckLs.length > 0 ? false : true;
      } else {
        let profitCheckLs = this.$refs.profit_tree.getCheckedNodes();
        this.profitTips = profitCheckLs.length > 0 ? false : true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.user-detail {
  height: 100%;
  text-align: left;
}
.detail-container {
  padding: 20px 40px;

  background: white;
  min-height: 500px;
  .edit-btn {
    width: 96px;
    height: 32px;
    float: right;
    margin: 14px 43px 10px 0;
    background: #774c90;
    border-color: #774c90;
  }
  .user-title {
    padding: 21px 0 14px 0;
    margin: 21px 0;
    font-weight: bold;
    border-bottom: 1px solid #eeeeee;
  }
}
.user-style {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;

  .el-form-item {
    width: 48%;
    margin-right: 2%;
  }
  .item-common {
    width: 100%;

    .el-checkbox-group {
      margin-left: 5px;

      .el-checkbox {
        width: 260px !important;
      }
    }

    .role-tips {
      position: absolute;
      left: -65px;
      top: 25px;
      font-size: 12px;
      color: #F56C6C;
    }
  }
}
.city-data {
  position: relative;
  .is_required {
    color: red;
    position: absolute;
    top: 0;
    left: -93px;
  }
  .city-tips {
    position: absolute;
    left: -75px;
    top: 25px;
    font-size: 12px;
    color: #F56C6C;
  }
}
.profit-data {
  position: relative;
  .is_required {
    color: red;
    position: absolute;
    top: 0;
    left: -93px;
  }
  .profit-tips {
    position: absolute;
    left: -75px;
    top: 25px;
    font-size: 12px;
    color: #F56C6C;
  }
}
</style>