<template>
    <div class="role-list">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>角色权限</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="add-role">
			<button type="button" class="MBtn" v-if="defaultBtnLs.indexOf(2) > -1" @click="handleAddRole('roleForm')" >创建角色</button>
		</div>

        <el-card class="box-card">
            <div v-if="!listShow">
                <p class="n-list">暂无权限</p>
            </div>
            <el-table
                v-else
                v-loading="loading"
                :header-cell-class-name="tableRowClassName"
                :data="roleData"
                :height="roleData.length > 0 ? '700' : '0'"
                size="mini"
                style="width: 100%">
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="角色名称"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="角色描述"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column prop label="角色状态" align="center" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">启用</span>
                        <span v-else>禁用</span>
                        <el-switch
                            class="role-switch"
                            v-if="defaultBtnLs.indexOf(4) > -1"
                            :value="scope.row.status == 1 ? true : false"
                            active-color="#13ce66" 
                            inactive-color="#CCCCCC"
                            @change="changeRoleState(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop label="操作" align="center" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" class="editBtn" v-if="defaultBtnLs.indexOf(3) > -1"  @click="edit(scope.row)">修改</el-button>
                        <el-button type="text" v-if="defaultBtnLs.indexOf(5) > -1 || defaultBtnLs.indexOf(6) > -1"  @click="editPermission(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                v-if="roleData.length > 0"
                background
                class="pagination"
                @size-change="PagesizeChange"
                @current-change="CurrentChange"
                :current-page="page"
                :page-sizes="[10,20,30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total">
            </el-pagination>
        </el-card>

        <el-dialog :visible.sync="DialogRole" width="500px" :close-on-click-modal="false" :modal-append-to-body="false" :modal="true" custom-class="DialogClass"
            :center="true" class="role-dialog" :title="DialogType == 1 ? '创建角色' : '修改角色'" :before-close="cancelDialogRole">
            <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px" class="roleForm">
                <div>
                    <el-form-item label="角色名称：" size="mini" prop="name">
                        <el-input maxlength="10" v-model.trim="roleForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="角色描述：" size="mini" prop="desc">
                        <el-input  maxlength="200" type="textarea" rows="5" cols="20" v-model="roleForm.desc"></el-input>
                    </el-form-item>
                </div>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <button type="button" class="MBtn" @click="CreateRole('roleForm')" v-if="DialogType == 1">创建角色</button>
                <button type="button" class="MBtn" @click="CreateRole('roleForm')" v-if="DialogType == 2">保存</button>
                <button type="button" class="MBtn Generalcolor" @click="cancelDialogRole()">取消</button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
import { rolelist, addRole, editRole, statusRole } from '@/api/role'
import { defaultOperationBtn } from '@/utils/tools'
export default {
    data() {
        var validateName = (rule, value, callback) => {
            if (value.trim()) {
                if (value.length > 10) {
                    callback(new Error("请输入10位以内中文"));
                } else {
                    callback();
                }
            } else {
                callback('角色名称未填写');
            }
        }; 
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            roleData: [],
            loading: false,
            DialogRole: false,
            roleForm: {
                id: "",
                name: "",
                desc: "",
            },
            roleId: '',
            DialogType: 1,
            roleName: '',
            // OperationBtn: {},
            defaultBtnLs: [],  // 角色拥有按钮
            rules: {
                name: [
                    { required: true, validator: validateName, trigger: "blur" }
                ]
            },
            listShow: false,
            roleStatus: '',
            flag: true,
            editFlag: true
        }
    },
    created() {
        // 分配权限
        // const btnList = [1, 2, 3, 4, 7];
        // this.OperationBtn = isOperationBtn(this.$store.getters.menuBtn, this.$route.path, btnList);
        this.defaultBtnLs = defaultOperationBtn(this.$store.getters.menuBtn);
        if (this.defaultBtnLs.indexOf(1) > -1 || this.defaultBtnLs.indexOf(2) > -1 || 
            this.defaultBtnLs.indexOf(3) > -1 || this.defaultBtnLs.indexOf(4) > -1 || 
            this.defaultBtnLs.indexOf(5) > -1 || this.defaultBtnLs.indexOf(6) > -1) {
            this.getRoleList();
            this.listShow = true;
        } else {
            this.listShow = false;
        }
    },
    methods: {
        //  表头颜色
        tableRowClassName({row, column, rowIndex, columnIndex}) {
            return 'table-header';
        },

        // 分页切换
        PagesizeChange(val) {
            this.pageSize = val;
            this.getRoleList();
        },

        CurrentChange(val) {
            this.page = val;
            this.getRoleList();
        },

        // 角色列表
        getRoleList() {
            this.loading = true;
            rolelist({
                page: this.page,
                pageSize: this.pageSize
            }).then(res => {
                this.loading = false; 
                this.total = Number(res.total);
                res.table_data.map(item => {
                    item.checkState = item.status == 1 ? true : false;
                })
                this.roleData = res.table_data;
            })
            .catch(err => {})
            .finally(() => {
                this.loading = false;
            });
        },

        // 名字校验
        // filterRoleList() {
        //     let test = {
        //         name: this.roleForm.name
        //     }
        //     this.DialogType == 2 ? test.role_id = this.roleId : '';
        //     rolelist(test).then(res => {
        //         this.roleName = res.table_data && res.table_data.length > 0 ? res.table_data[0].name : '';
        //         console.log(this.roleName)
        //         // if (value == this.roleName) {
        //         //     callback('此角色名称已被占用');
        //         // } else {
        //         //     callback();
        //         // }
        //     })
        //     .catch(err => {
        //     })
        //     .finally(() => {
        //     });
        // },

        // 更改角色状态
        changeRoleState(row) {
            this.$confirm("请确认是否要更改角色状态?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                statusRole({
                    id: row.id,
                    status: row.status == 1 ? 2 : 1
                }).then(res => {
                    this.$message.success('角色状态更改成功!');
                    row.status = row.status == 1 ? 2 : 1;
                })
                .catch(err => {});
            })
            .catch(() => {
                row.status = row.status == 1 ? 1 : 2;       
            });
        },

        // 修改角色展示
        edit(row) {
            this.roleForm.name = '';
            this.DialogRole = true;
            this.roleId = row.id;
            this.DialogType = 2;
            this.roleStatus = row.status;
            this.roleForm.id = row.id;
            this.roleForm.name = row.name;
            this.roleForm.desc = row.desc;
        },
        
        // 添加角色展示
        handleAddRole() {
            this.DialogRole = true;
            this.DialogType = 1;
            for (let k in this.roleForm) {
                this.roleForm[k] = '';
                this.roleForm.status = 0;
            }
        },

        // 分配权限
        editPermission(row) {
            this.$router.push({path: '/role/rolePermission',query: {roleId: row.id, roleName: row.name}});
        },

        // 角色创建/修改
        CreateRole(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.DialogType == 1) {
                        if (!this.flag) return false;
                        this.flag = false;
                        addRole(this.roleForm).then(res => {
                            if (res) {
                                this.DialogRole = false;
                                this.$message.success('角色创建成功');
                                this.getRoleList();
                            }
                        })
                        .catch(err => {})
                        .finally(() => {
                            setTimeout(() => {
                                this.flag = true;
                            },1100)
                        });
                    }  else {
                        if (!this.editFlag) return false;
                        this.editFlag = false;
                        editRole(this.roleForm).then(res => {
                            if (res) {
                                this.DialogRole = false;
                                this.$message.success('角色修改成功');
                                this.getRoleList();
                            }
                        })
                        .catch(err => {})
                        .finally(() => {
                            setTimeout(() => {
                                this.editFlag = true;
                            },1100)
                        });
                    }
                } else {
                    return false;
                }
            });
        },

        // 取消操作
        cancelDialogRole() {
            this.$refs.roleForm.resetFields();
            this.DialogRole = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.role-list {
    position: relative;

    .add-role {
        position: absolute;
        top: 0;
        right: 100px;
    }

    .pagination {
        position: absolute;
        bottom: 0;
        right: 20px;
        margin: 40px 20px;
    }

    .box-card {
        margin-top: 40px !important;
        min-height: 550px;
 
        .el-table {
            margin-bottom: 80px;
        }
    }

    .role-switch {
        margin-left: 10px;
    }

    .dialog-footer {
        text-align: right;
    }
}
</style>
