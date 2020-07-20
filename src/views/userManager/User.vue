<template>
  <div class="user-manager">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-if="!listShow">
      <p class="n-list">{{textTips}}</p>
    </div>
    <div v-else>
      <div class="filter">
        <div>
          <el-select
            class="select-content"
            v-model="filter.roles"
            placeholder="全部角色"
            size="small"
            @change="getUserInfo"
          >
            <el-option label="全部角色" value></el-option>
            <el-option
              v-for="item in roleData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="select-content"
            v-model="filter.school"
            filterable
            placeholder="全部分校"
            size="small"
            @change="getUserInfo"
          >
            <el-option label="全部分校" value></el-option>

            <el-option v-for="item in cityData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select
            class="select-content"
            v-model="filter.profit"
            filterable
            placeholder="全部利润中心"
            size="small"
            @change="getUserInfo"
          >
            <el-option label="全部利润中心" value></el-option>

            <el-option
              v-for="item in profitData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            class="select-content"
            v-model="filter.status"
            placeholder="全部用户状态"
            size="small"
            @change="getUserInfo"
          >
            <el-option label="全部用户状态" value></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </div>

        <div class="search-reset">
          <div class="search-inp">
            <el-input
              v-model.trim="filter.account"
              placeholder="请输入用户名/账号"
              size="small"
              @keyup.enter.native="getUserInfo('filterList')"
              class="filter-inp"
            ></el-input>
            <el-button
              size="small"
              class="filter-search"
              icon="el-icon-search"
              @click="getUserInfo('filterList')"
            ></el-button>
          </div>
          <el-button icon="el-icon-refresh" size="mini" class="filter-btn" @click="reset">重置</el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{background:'#FAFAFA',color:'#666666'}"
        >
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column prop="account" label="账号" align="center" width="150"></el-table-column>
          <el-table-column prop="name" label="用户姓名" align="center"  width="80"></el-table-column>
          <el-table-column label="角色" align="center">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                trigger="hover"
                :width="scope.row.role_id.length > 5 ? 300 : 150"
                :content="scope.row.role_name"
              >
                <p class="text-hide" slot="reference">{{scope.row.role_name}}</p>
              </el-popover>
                <p v-if="!scope.row.role_name">-</p>
            </template>
          </el-table-column>
          <el-table-column label="利润中心" align="center" >
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                trigger="hover"
                :width="scope.row.profit_center_name.length>50?300:150"
                :content="scope.row.profit_center_name"
              >
                <p class="text-hide" slot="reference">{{scope.row.profit_center_name}}</p>
              </el-popover>
                <p v-if="!scope.row.profit_center_name">-</p>
            </template>
          </el-table-column>
          <el-table-column label="分校" align="center" >
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.school_name"
                placement="bottom"
                trigger="hover"
                :width="scope.row.school_name.length>50?300:150"
                :content="scope.row.school_name"
              >
                <p class="text-hide" slot="reference">{{scope.row.school_name}}</p>
              </el-popover>
              <p v-if="!scope.row.school_name">-</p>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="用户状态" width="120" align="center">
            <!-- .status==1?'启用':'禁用' -->
            <template slot-scope="scope">
              <span class="status-span">{{scope.row.status==1?'正常':'禁用'}}</span>
              <el-switch
                v-if="defaultBtnLs.indexOf(9) > -1"
                :value="scope.row.status==1?true:false"
                active-color="#8FC31E"
                @change="changeStatus(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="user-info"
                v-if="defaultBtnLs.indexOf(8) > -1 || defaultBtnLs.indexOf(10) > -1"
                @click="goToDetail(scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            :page-sizes="[10,20,30]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="pagination.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  usersList,
  changeStatus,
  rolelist,
  schoolids,
  profitcenter
} from "../../api/index";
// import { isOperationBtn } from '@/utils/tools'
import { defaultOperationBtn } from "@/utils/tools";

export default {
  data() {
    return {
      filter: {
        roles: "",
        school: "",
        profit: "",
        status: "",
        account: ""
      },
      tableData: [],
      roleData: [],
      profitData: [],
      cityData: [],
      // OperationBtn: {},
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      defaultBtnLs: [], // 角色拥有按钮
      listShow: false,
      textTips: ""
    };
  },
  computed: {
    menuBtn() {
      return this.$store.getters.menuBtn;
    }
  },
  mounted() {
    setTimeout(() => {
      // 分配权限
      // const btnList = [1, 4, 5];
      // this.OperationBtn = isOperationBtn(this.$store.getters.menuBtn, this.$route.path, btnList);
      // if (this.OperationBtn.operat || this.OperationBtn.info) {
      //   this.OperationBtn.list = true;
      // }
      this.defaultBtnLs = defaultOperationBtn(this.$store.getters.menuBtn);
      if (
        this.defaultBtnLs.indexOf(7) > -1 ||
        this.defaultBtnLs.indexOf(8) > -1 ||
        this.defaultBtnLs.indexOf(9) > -1 ||
        this.defaultBtnLs.indexOf(10) > -1
      ) {
        this.listShow = true;
        this.getUserInfo();
        this.getAllRoles();
        this.getAllschool();
        this.getAllProfit();
      } else {
        this.listShow = false;
        this.textTips = "暂无权限";
      }
    }, 300);
  },
  methods: {
    //   获取用户列表
    getUserInfo(val) {
       if (val == "filterList") {
        this.pagination.page = 1;
      }
      const data = {
        role_id: this.filter.roles,
        school_id: this.filter.school,
        profit_center_id: this.filter.profit,
        status: this.filter.status,
        account: this.filter.account,
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      };
      usersList(data)
        .then(res => {
          if (!res) return;
          let arr = [];
          for (const i of res.table_data) {
            arr = [];
            for (const j of i.role_id) {
              arr.push(j.name);
              i["role_name"] = arr.join("、");
            }
          }
          this.tableData = res.table_data;
          this.pagination.total = res.total;
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

    // 获取全部校区
    getAllschool() {
      schoolids({
        type: 0
      })
        .then(res => {
          this.cityData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //
    // 获取利润中心
    getAllProfit() {
      profitcenter({
        type: 0
      })
        .then(res => {
          this.profitData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 修改用户状态
    changeStatus(val) {
      this.$confirm("请确认是否要更改用户状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        const data = {
          type: 1,
          id: val.id,
          status: val.status == 1 ? 2 : 1
        };
        changeStatus(data)
          .then(res => {
            this.$message.success('用户状态更改成功!');
            val.status = val.status == 1 ? 2 : 1;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(() => {
        val.status = val.status == 1 ? 1 : 2;         
      });
    },
    //   重置
    reset() {
      this.filter = {
        roles: "",
        school: "",
        profit: "",
        status: "",
        account: ""
      };
      this.getUserInfo();
    },

    //   跳转详情页
    goToDetail(val) {
      this.$router.push({
        path: "/user/userdetail",
        query: {
          id: val.id
        }
      });
    },

    // 分页-每页多少条
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getUserInfo();
    },

    // 分页-当前页
    handleCurrentChange(val) {
      console.log(val);
      this.pagination.page = val;
      this.getUserInfo();
    }
  }
};
</script>

<style lang="scss" scoped>
$bg-color: #3c0060;
.user-manager {
  height: 100%;
  // margin: 20px 30px;
  text-align: left;

  .userOperation {
    margin: 20px auto;
    font-size: 18px;
  }
}
.text-hide {
  // width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter {
  margin: 20px 0 20px 0;
  display: flex;
  justify-content: space-between;
  .el-select {
    margin: 0 10px 0 0;
    width: 10vw;
    font-size: 14px;
  }
  .filter-inp {
    width: 15vw;
    font-size: 14px;
  }
  .filter-btn {
    width: 96px;
    height: 32px;
    color: $bg-color;
    border-color: $bg-color;
    font-size: 14px;
  }
  .filter-search {
    border-radius: 0 4px 4px 0;
    background: #774c90;
    border: 1px solid #774c90;
    color: #fff;
  }
  .search-reset {
    display: flex;
  }
  .search-inp {
    display: flex;
    margin-right: 20px;
    // width: 300px;
  }
}

.table-container {
  background: white;
  padding: 20px 40px;
  .el-button--text {
    color: $bg-color;
  }
  .status-span {
    margin-right: 20px;
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

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #e6e4f3 !important;
  color: $bg-color !important;
}
.el-select-dropdown__item.selected {
  color: $bg-color !important;
}
</style>

<style lang="scss">
$bg-color: #3c0060;
.user-manager {
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
  .search-reset {
    .el-input__inner {
      border-radius: 3px 0 0 3px;
    }
  }
  .el-table__body {
  // 使表格兼容safari，不错位
  width: 100%;
  table-layout: fixed !important;
}
}
</style>