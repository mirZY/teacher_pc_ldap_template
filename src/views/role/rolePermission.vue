<template>
    <div class="permission">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/role' }">角色权限</el-breadcrumb-item>
            <el-breadcrumb-item>分配权限</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="add-permission">
            <button type="button" class="MBtn" v-if="permissionIds.length > 0 && defaultBtnLs.indexOf(5) > -1" @click="CheckPermission">保存</button>
        </div>
        <div v-if="!listShow">
            <p class="n-list">暂无权限</p>
        </div>
        <el-card class="permission-card" v-else>
            <div class="checkbox-table" v-for="(item, indexkey) in permissionList" :key="item.tag_id">
                <template>
                    <div class="checkLs">
                        <div class="check-select" v-if="!item.select"  @click="showPermissionItem(item)">
                            <span class="triange-open"></span>
                        </div>
                        <div class="check-select" v-else @click="showPermissionItem(item)">
                            <span class="triange-down"></span>
                        </div>
                        <el-checkbox v-model='permissionIds' :disabled="item.disabled == true ? true : false" :label="item.tagId" @change='handleCheck(1,indexkey,item.tag_name)'>
                        {{item.tag_name}}
                        {{checkTips}}
                        </el-checkbox>
                    </div>
                    <div class="checkItem" v-if="item.select">
                        <div v-for="list in item.data" class="line-check" :key="list.node_id">
                            <el-checkbox class="check2" :disabled="list.disabled == true ? true : false" @change='handleCheck(2,indexkey, list.node_name)' v-model="permissionIds" :label="list.node_id">
                                {{list.node_name}}
                            </el-checkbox>
                        </div>
                    </div>
                    <div class="checkItem" v-else></div>
                </template>
            </div>
        </el-card>
    </div>
</template>

<script>
import { rolePower, savePower, statusRole } from '@/api/role'
// import { isOperationBtn } from '@/utils/tools'
import { defaultOperationBtn } from '@/utils/tools'
export default {
   data() {
      return {
            roleName: '',
            tempRole:[],  // 父级id
            permissionIds: [], //已选的菜单id数组
            permissionList: [],
            // OperationBtn: {},
            roleLs: ['2', '3', '4', '5', '6'], // 角色模块列表
            userLs: ['8', '9', '10'], //用户管理列表
            teacherLs: ['12', '13', '14', '15'], //教师管理列表
            defaultBtnLs: [],  // 角色拥有按钮
            checkTips: '', // 连带权限提示语
            listShow: '',
			Index: 0,
			perFlag: true
        }
    },
    created() {
		this.roleName = this.$route.query.roleName;
		this.checkTips = '(勾选新建、修改、禁用类权限无法取消基础列表查看权限)';
        // 分配权限（去除）
        // const btnList = [3];
        // this.OperationBtn = isOperationBtn(this.$store.getters.menuBtn, this.$route.path, btnList);
        this.tempRole = [];
        this.permissionIds = [];
        this.defaultBtnLs = defaultOperationBtn(this.$store.getters.menuBtn);
		this.listShow = this.defaultBtnLs.indexOf(5) > -1 || this.defaultBtnLs.indexOf(6) > -1 ? true : false;
		// 默认角色权限展示
        if (this.defaultBtnLs.indexOf(5) > -1 || this.defaultBtnLs.indexOf(6) > -1) {
            const roleId = this.$route.query.roleId ? this.$route.query.roleId : '';
            rolePower({
                role_id: roleId
            }).then(res => {
                if (res.list.length > 0) {
                    res.list.map(item => {
						item.select = false;
						item.disabled = this.defaultBtnLs.indexOf(5) > -1 ? false : true;
                        item.data.map((item1, index) => {
                            item1.tag_id = item.tag_id;
                            item1.disabled = this.defaultBtnLs.indexOf(5) > -1 ? false : true;
                        })
                        item.tagId = item.tag_id + '-1';
                    })
					this.permissionList = res.list;
					
                    if (res.table.length > 0) {
                        for (var i = 0; i < res.table.length; i++) {
                            this.permissionIds.push(res.table[i].node_id);
                        }

                        for (var i = 0; i < this.permissionList.length; i++) {
                            let idx = 0;
                            this.tempRole.push(this.permissionList[i].tagId)
                            this.permissionList[i].data.map(item => {
                                if (this.permissionIds.indexOf(item.node_id) > -1) {
                                    idx += 1;
                                    this.defaultPermission(item.node_id, i);
                                }
                            })
                            if (idx == this.permissionList[i].data.length) {
                                this.permissionIds.push(this.permissionList[i].tagId);
                            }
                            this.permissionList[i].select = true;
                        }
                    }
                }
            })
            .catch(err => {});
        }
    },
    methods: {
        // 连带选中角色权限（新建/编辑/禁用类）
        defaultPermission(nodeId, idx) {
            if (this.roleLs.indexOf(nodeId) > -1) {
				this.permissionIds.indexOf('1') < 0 ? this.permissionIds.push('1') : '';
				if (this.permissionIds.indexOf('5') > -1) {
					this.permissionIds.indexOf('6') < 0 ? this.permissionIds.push('6') : '';
				}
			} else if (this.userLs.indexOf(nodeId) > -1) {
				this.permissionIds.indexOf('7') < 0 ? this.permissionIds.push('7') : '';
				if (this.permissionIds.indexOf('8') > -1) {
					this.permissionIds.indexOf('10') < 0 ? this.permissionIds.push('10') : '';
				}
            } else if (this.teacherLs.indexOf(nodeId) > -1) {
				if (this.permissionIds.indexOf('15') > -1) {
					this.permissionIds.indexOf('13') < 0 ? this.permissionIds.push('13') : '';
				}
                this.permissionIds.indexOf('11') < 0 ? this.permissionIds.push('11') : '';
			}
        },

		// 不同模块选中处理
        handleCheck(type, a, name) { // 多选框
            if (type == 2) { // 二级菜单点击
                let index = 0;
                let Ids = 0;
                this.permissionList[a].data.map(item => {
                    if (this.permissionIds.indexOf(item.node_id) > -1) {
						this.defaultPermission(item.node_id, index);
					}

				})

				let checkLs = 0;
				this.permissionIds.map(item => {
					this.permissionList[a].data.map(item1 => {
						if (item == item1.node_id) {
							checkLs += 1;
						}
					})
				})
				if (checkLs == this.permissionList[a].data.length) {
					this.permissionIds.push(this.permissionList[a].tagId);
				} else {
					if (this.permissionIds.indexOf(this.permissionList[a].tagId) > -1) {
						this.permissionIds.splice(this.permissionIds.indexOf(this.permissionList[a].tagId), 1);
					}
				}
            } else {
                if (this.permissionIds.indexOf(this.permissionList[a].tagId) > -1) {
                    this.permissionList[a].data.map(item => {
                        if (this.permissionIds.findIndex((n) => n == item.node_id) < 0) {
                            this.permissionIds.push(item.node_id)
                        }
                    })
                } else {
                    this.permissionList[a].data.map(item => {
                        if  (this.permissionIds.findIndex((n) => n == item.node_id) > -1) {
                            this.permissionIds.splice(this.permissionIds.findIndex((n) => n == item.node_id), 1);
                        }
                    })
                }
            }

        },

		// 控制模块包含子级别是否展示
        showPermissionItem(item) {
            item.select = !item.select;
        },

		// 分配权限
        CheckPermission() {
			if (!this.perFlag) return false;
			this.perFlag = false;
            const roleArr = [];
            this.permissionList.map(item => {
                item.data.map( item1 => {
                    if (this.permissionIds.indexOf(item1.node_id) > -1) {
                        roleArr.push({
                            tag_id: item1.tag_id,
                            node_id: item1.node_id,
                            status: 1
                        })
                    }
                })
			})
			// 
            savePower({
                role_id: this.$route.query.roleId,
                data: JSON.stringify(roleArr)
            }).then(res => {
                if (res) {
                    const successTips = this.roleName + '角色权限已设置完毕';
                    this.$message.success(successTips)
					setTimeout(() => {
						this.$router.push({path: '/role'});
    				}, 200);
                }
            })
			.catch(() => {})
			.finally(() => {
              this.perFlag = false;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.permission {
   position: relative;

   .add-permission {
      position: absolute;
      top: 0;
      right: 100px;
   }

   .permission-card {
      margin-top: 30px;
      min-height: 570px;
      width: 95%;

        .checkbox-table {
            margin-bottom: 20px;
            background: #ffffff;
            border: 1px solid #eeeeee;

            

            .checkLs {
                position: relative;
                width: 100%;
                background: #fafafa;
                height: 49px;
                line-height: 49px;

                .check-select {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    left: 5px;
                    top: 15px;
                }

                .triange-down {
                    position: absolute;
                    left: 7px;
                    top: 7px;
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid #000000;
                    z-index: 999;
                }

                .triange-open {
                    position: absolute;
                    left: 7px;
                    top: 5px;
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border-top: 5px solid transparent;
                    border-left: 5px solid #000000;
                    border-bottom: 5px solid transparent;
                    z-index: 999;
                }

                .el-checkbox {
                    margin-left: 35px;
                }
            }

            .checkItem {
                padding-left: 30px;
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;

                .line-check {
                    margin: 0 50px 20px 0;
                    width: 260px;
                }
            }
        }
   }
}
</style>
