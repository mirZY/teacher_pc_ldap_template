<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App"
};
</script>
<style  lang="scss">
* {
  margin: 0;
  padding: 0;
}
ul,li{
  list-style: none;
}
.el-breadcrumb{
	color: #999;
	font-size: 16px;
	font-weight: normal;
}
#app, html, body {
	height: 100%;
}
/* 文字颜色 */
.el-text--main {
	color: #3C0060 !important;
}
/* 背景颜色 */
.el-button--main {
	
	background: #3C0060 !important;
	border: #3C0060 1px solid !important;
	&.is-plain{
		color: #3C0060 !important;
		background:rgba(#3C0060, 0) !important;
		border-color: #3C0060 !important;
	}
	
}
.el-date-table td.end-date span, .el-date-table td.start-date span {
    background-color: #3C0060 !important;
}
.el-date-table td.in-range div, .el-date-table td.in-range div:hover, .el-date-table.is-week-mode .el-date-table__row.current div, .el-date-table.is-week-mode .el-date-table__row:hover div {
    background-color:rgba(#3C0060, 0.1) !important;
}
/* 主色调按钮 */
.el-button--main{
	background: #3C0060 !important;
}
/* 修改文字按钮样式 */
.el-button--text {
  color: #3c0060 !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

.editBtn {
  color: #ff5100 !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

/* 教师启用颜色修改 */
.status-btn1 {
  color: #8fc31e !important;
  font-weight: 500 !important;
}
/* 教师停用颜色修改 */
.status-btn2 {
  color: #ff5100 !important;
  font-weight: 500 !important;
}

/* 修改面包屑样式 */
.el-breadcrumb {
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #222333 !important;
  margin-bottom: 20px;
  margin-top: 2px;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  color: #303133 !important;
  font-weight: 700 !important;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333333 !important;
  font-weight: normal;
}

.el-checkbox__input .el-checkbox__inner,
.el-checkbox__input .el-checkbox__inner:hover {
  border-color: #8fc31e !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #8fc31e !important;
  border-color: #8fc31e !important;
}

/* 修改弹框底部样式 */
.el-dialog__footer {
  text-align: right !important;
}

/* 修改导航栏样式 */
.aside .el-menu-item {
  padding-left: 50px !important;
}

.aside .el-submenu {
  padding-left: 10px !important;
}

.el-menu-item:hover{
	background:#E6E4F3 !important;
	color: #3C0060 !important;
	border-right: 3px solid #3C0060 !important;
}

.el-menu-item.is-active {
  background: #e6e4f3 !important;
  color: #3c0060 !important;
  border-right: 3px solid #3c0060 !important;
}

/* 修改table表头样式 */
.table-header {
  background: #fafafa !important;
  height: 49px;
}
/* 修改分页 */
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #e5e4ed !important;
  color: #666666 !important;
}
.MBtn {
  margin-right: 10px;
  height: 30px;
  line-height: 30px;
  padding: 0 30px;
  background-color: #774c90;
  color: #fff;
  font-weight: 500;
  outline: none;
  border: none;
  border-radius: 5px;
}

.Generalcolor {
  background: #fafafa;
  color: #666666;
  border: 1px solid #dddddd;
}

.n-list {
	margin-top: 100px;
	text-align: center;
	font-size: 22px;
} 

.role-dialog .el-dialog__header{
	text-align: left !important;
	color: #333333 !important;
	border-bottom: 1px solid #EEEEEE;
}

/* 用户表格 */
.table-item .el-table__body{
  width: 100% !important;
  table-layout: fixed !important;
  border: 1px solid red !important;
}
</style>