<template>
  <div class="teacher-manager">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="!listShow">
      <p class="n-list">暂无权限</p>
    </div>

    <div v-else>
      <div class="filter-container">
        <div class="select-box">
          <el-select
            class="select-content"
            filterable
            v-model="filter.school"
            placeholder="全部城市"
            size="small"
            @change="getTeacherInfo"
          >
            <el-option label="全部城市" value></el-option>

            <el-option v-for="item in cityData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select
            class="select-content"
            v-model="filter.roles"
            placeholder="全部角色"
            size="small"
            @change="getTeacherInfo"
          >
            <el-option label="全部角色" value></el-option>
            <el-option label="主讲" value="1"></el-option>
            <el-option label="班主任" value="2"></el-option>
            <el-option label="助教" value="3"></el-option>
          </el-select>
          <el-select
            class="select-content"
            v-model="filter.profit"
            placeholder="全部利润中心"
            size="small"
            @change="getTeacherInfo"
          >
            <el-option label="全部利润中心" value></el-option>
            <el-option
              v-for="item in profitData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="search-box">
          <el-checkbox class="search-tea" v-model="checkedTeacher" @change="getTeacherInfo">仅看可排课老师</el-checkbox>
          <div class="search-inp">
            <el-input
              v-model="searchInput"
              @keyup.enter.native="getTeacherInfo('filterList')"
              placeholder="输入老师姓名/手机号/编码"
              size="small"
            ></el-input>
            <el-button
              size="small"
              class="filter-search"
              icon="el-icon-search"
              @click="getTeacherInfo('filterList')"
            ></el-button>
          </div>
        </div>
      </div>

      <div class="table-container">
        <div class="add-box">
          <!-- <img src="../../assets/teacher/menu.png" /> -->
          <el-button
            v-if="defaultBtnLs.indexOf(14) > -1"
            type="primary"
            size="small"
            @click="goToAddTeacher"
            class="add-btn"
          >添加加盟/兼职教师</el-button>
        </div>
        <el-table 
          :data="tableData" 
          style="width: 100%"
          :header-cell-style="{background:'#FAFAFA',color:'#666666'}">
          <el-table-column
            :fixed="item.fixed"
            v-for="item in tableColumnList"
            :key="item.prop"
            :label="item.propName"
            :prop="item.prop"
            align="center"
            :width="item.prop == 'picture'?'50':''"
          >
            <template slot-scope="scope">
              <div class="user-picter" v-if="item.prop == 'picture'">
                <img v-if="scope.row.picture" :src="scope.row.picture" />
                <img v-else src="../../assets/teacher/default.png" />
              </div>
              <div v-else-if="item.prop == 'name'">
                <p>
                  <span>{{scope.row.name}}</span>
                  <span
                    v-if="scope.row.is_new==1 && scope.row.origin_type == 1"
                    class="new-teacher-icon"
                  >新</span>
                </p>
                <p class="account-column">{{scope.row.account}}</p>
              </div>
              <div v-else-if="item.prop == 'item_id_name'">
                <el-popover
                  v-if="scope.row[scope.column.property]"
                  placement="bottom"
                  :width="scope.row[scope.column.property].length>100?'300':'150'"
                  trigger="hover"
                  :content="scope.row[scope.column.property]"
                >
                  <p class="text-hide" slot="reference">{{scope.row[scope.column.property] || '-'}}</p>
                </el-popover>
                <p v-if="!scope.row[scope.column.property]">-</p>
              </div>

              <div v-else-if="item.prop == 'grade_name'">
                <el-popover
                  v-if="scope.row[scope.column.property]"
                  placement="bottom"
                  :width="scope.row[scope.column.property].length>100?'300':'150'"
                  trigger="hover"
                  :content="scope.row[scope.column.property]"
                >
                  <p
                    class="text-hide"
                    slot="reference"
                  >{{scope.row[scope.column.property].replace(/年级/g,'') || '-'}}</p>
                </el-popover>
                <p v-if="!scope.row[scope.column.property]">-</p>
              </div>

              <div v-else-if="item.prop == 'is_work'">
                <p>{{scope.row.is_work == 1?'正常':(scope.row.is_work == 2?'停排':'-')}}</p>
              </div>
              <div v-else-if="item.prop == 'role_type'">
                <p v-for="item in scope.row.role_type.split(',')" :key="item">
                  <!-- <span>{{item == 1?'主讲':(item == 2?'班主任':(item == 3?'助教':'-'))}}</span> -->
                  <span v-if="item == 1">主讲 
                     <span v-if="scope.row.teacher_level_name">({{scope.row.teacher_level_name}})</span>
                  </span>
                  <span v-else-if="item == 2">班主任</span>
                  <span v-else-if="item == 3">助教 
                    <span v-if="scope.row.assistant_level_name">({{scope.row.assistant_level_name}})</span>
                  </span>
                  <span v-else>-</span>
                </p>
              </div>
              <span v-else>{{scope.row[scope.column.property] || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="defaultBtnLs.indexOf(15) > -1 || defaultBtnLs.indexOf(13) > -1"
                size="small"
                type="text"
                @click="goToDetail(scope.row)"
              >详情</el-button>
              <el-button
                size="small"
                type="text"
                @click="setStopUse(scope.row)"
                v-if="scope.row.is_work==2 && defaultBtnLs.indexOf(12) > -1"
                class="status-btn1"
              >启用</el-button>
              <el-button
                size="small"
                type="text"
                @click="setStopUse(scope.row)"
                v-if="scope.row.is_work==1 && defaultBtnLs.indexOf(12) > -1"
                class="status-btn2"
              >停用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 30]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  teacherList,
  schoolids,
  profitcenter,
  rolelist,
  teacherstatus
} from "../../api/index";
// import { isOperationBtn } from "@/utils/tools";
import { defaultOperationBtn } from "@/utils/tools";
export default {
  name: "Login",
  data() {
    return {
      options: [],
      tableData: [],
      tableColumnList: [
        { prop: "picture", propName: "头像", fixed: true },
        { prop: "name", propName: "姓名", fixed: true },
        { prop: "mobile", propName: "手机号" },
        { prop: "city_name", propName: "城市" },
        { prop: "profit_center_name", propName: "利润中心" },
        { prop: "role_type", propName: "角色" },
        { prop: "item_id_name", propName: "项目" },
        { prop: "grade_name", propName: "年级" },
        { prop: "is_work", propName: "排课状态" }
      ],
      checkedTeacher: false,
      searchInput: "",
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      stopUse: true,
      cityData: [],
      roleData: [],
      profitData: [],
      filter: {
        roles: "",
        school: [],
        profit: ""
      },
      // OperationBtn: {},
      defaultBtnLs: [], // 角色拥有按钮
      listShow: false
    };
  },
  mounted() {
    // 分配权限
    // const btnList = [1,4,5,8];
    // this.OperationBtn = isOperationBtn(this.$store.getters.menuBtn, this.$route.path, btnList);
    this.defaultBtnLs = defaultOperationBtn(this.$store.getters.menuBtn);
    if (
      this.defaultBtnLs.indexOf(11) > -1 ||
      this.defaultBtnLs.indexOf(12) > -1 ||
      this.defaultBtnLs.indexOf(13) > -1 ||
      this.defaultBtnLs.indexOf(14) > -1 ||
      this.defaultBtnLs.indexOf(15) > -1
    ) {
      this.listShow = true;
      this.getTeacherInfo();
      this.getSchoolids(); //获取城市列表
      this.getAllRoles(); //获取角色列表
      this.getProfitcenter(); // 获取利润中心
    } else {
      this.listShow = false;
    }
  },
  methods: {
    // 获取教师列表
    getTeacherInfo(val) {
      if (val == "filterList") {
        this.pagination.page = 1;
      }
      const data = {
        city_id: this.filter.school,
        role_type: this.filter.roles,
        profit_center_id: this.filter.profit,
        account: this.searchInput,
        is_work: this.checkedTeacher ? 1 : "",
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      };
      teacherList(data)
        .then(res => {
          this.tableData = res.table_data;
          this.pagination.total = res.total;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取城市列表
    getSchoolids() {
      schoolids({
        type: 1
      })
        .then(res => {
          this.cityData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取全部角色
    getAllRoles() {
      // 获取角色列表
      rolelist()
        .then(res => {
          if (res && res.table_data && res.table_data.length > 0) {
            for (const i of res.table_data) {
              if (i.name) {
                this.roleData.push({
                  value: i.id,
                  label: i.name
                });
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取利润中心
    getProfitcenter() {
      profitcenter({
        type: 1
      })
        .then(res => {
          this.profitData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 跳转添加加盟教师页面
    goToAddTeacher() {
      this.$router.push("/teacher/addTeacher");
    },

    // 跳转教师详情页面
    goToDetail(val) {
      if (val.origin_type == 2 || val.origin_type == 3) {
        this.$router.push({
          path: "/teacher/addteacher",
          query: {
            id: val.id,
            origin_type: val.origin_type
          }
        });
      } else {
        this.$router.push({
          path: "/teacher/teacherdetail",
          query: {
            id: val.id
          }
        });
      }
    },

    // 教师状态设置——停用启用
    setStopUse(val) {
      let msg = "";
      if (val.is_work == 1) {
        msg = `
        <div style="display:flex;">
          <div style="width:22px;height:22px;background: #faad14;color:#fff;border-radius:50%;display: inline-block;text-align: center;margin-right: 16px;">?</div>
          <div>
            <span style="font-size:16px;font-weight:500;color: rgba(0,0,0,0.85);">确认修改${val.name}老师为“停用”状态吗？</span></br>
            <span style="color: #666666;font-size:14px;margin-top:12px;display:block">停用后将不可以对老师进行排课</span>
          </div>
        </div>`;
      } else {
        msg = `
        <div style="display:flex;">
          <div style="width:22px;height:22px;background: #faad14;color:#fff;border-radius:50%;display: inline-block;text-align: center;margin-right: 16px;">?</div>
          <div>
            <span style="font-size:16px;font-weight:500;color: rgba(0,0,0,0.85);">确认重新启用${val.name}老师吗？</span></br>
            <span style="color: #666666;font-size:14px;margin-top:12px;display:block">启用后可以对老师进行正常排课</span>
          </div>
        </div>`;
      }
      this.$confirm(msg, {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        confirmButtonClass: "confirmStyle", //  按钮样式-待测
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          let setStatus = null;
          if (val.is_work == 2) {
            setStatus = 1;
          } else {
            setStatus = 2;
          }
          teacherstatus({
            is_work: setStatus,
            id: val.id,
            school_id: val.city,
            profit_center_id: val.profit_center_id
          })
            .then(res => {
              this.getTeacherInfo();
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
        .catch(() => {});
    },

    // 分页-每页多少条
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getTeacherInfo();
    },

    // 分页-当前页
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getTeacherInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
$bg-color: #774c90;
h2 {
  font-size: 20px;
  font-weight: 700;
  text-align: left;
  color: #222333;
  line-height: 26px;
  margin-bottom: 20px;
}
.teacher-manager {
  height: 100%;
  text-align: left;
}
.filter-container {
  display: flex;
  justify-content: space-between;
  .select-content {
    margin: 0 20px 0 0;
    width: 150px;
  }
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search-inp {
      display: flex;
      margin-left: 20px;
      width: 300px;
    }
    .search-tea {
      font-weight: 400 !important;
    }
  }
  .filter-search {
    border-radius: 0 4px 4px 0;
    background: $bg-color;
    border: 1px solid $bg-color;
    color: #fff;
  }
}
.add-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  align-items: center;
  background: white;

  img {
    width: 25px;
    height: 20px;
    margin-right: 30px;
    cursor: pointer;
  }
  .add-btn {
    background: $bg-color;
    border-color: $bg-color;
  }
  .el-icon-menu {
    font-size: 30px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.table-container {
  margin-top: 20px;
  background: #fff;
  padding: 36px 30px;
  img {
    width: 40px;
    height: 40px;
  }
  .el-button--text:first-child {
    color: $bg-color;
  }

  .status-btn1 {
    color: #8fc31e;
  }
  .status-btn2 {
    color: orangered;
  }
  .new-teacher-icon {
    width: 25px;
    height: 16px;
    display: inline-block;
    background: #fff1eb;
    border: 1px solid #ffb999;
    border-radius: 2px;
    margin-left: 5px;
    font-size: 12px;
    font-weight: 400;
    // text-align: left;
    color: #ff5100;
    line-height: 17px;
  }
  .account-column {
    font-size: 14px;
    font-weight: 400;
    // text-align: left;
    margin-top: 5px;
    color: #999999;
    line-height: 20px;
  }
  .el-table__body {
    width: 100% !important;
    table-layout: fixed !important;
  }
}

.pagination-container {
  text-align: right;
  margin-top: 30px;
}
.text-hide {
  overflow: hidden;
  // width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-picter {
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>

<style lang="scss">
$bg-color: #3c0060;
.teacher-manager {
  .search-box .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #8fc31e;
    border-color: #8fc31e;
  }
  .el-checkbox__inner:hover {
    border-color: #8fc31e;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #e5e4ed !important;
    color: #666 !important;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: #fff;
    border: 1px solid #dddddd;
    border-radius: 6px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: $bg-color;
  }
  .el-table__body {
  // 使表格兼容safari，不错位
  width: 100%;
  table-layout: fixed !important;
}
}
.confirmStyle {
  background: #774c90 !important;
  border-color: #774c90 !important;
}
</style>


