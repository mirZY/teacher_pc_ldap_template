<template>
	<div class="login">
		<div class="login-form">
			<p class="login-text">欢迎登录</p>
			<el-form
				:model="loginForm"
				status-icon
				ref="loginForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<el-form-item>
					<el-input size="mini" placeholder="请输入用户名" v-model.number="loginForm.phone"></el-input>
					</el-form-item>
					<el-form-item class="password-show">
					<el-input
						placeholder="请输入密码"
						:type="passwordShow ? 'password' : 'text'"
						size="mini"
						v-model="loginForm.password"
						autocomplete="off"
					></el-input>
					<img
						:src="passwordShow ? require('../assets/show.png') : require('../assets/hide.png')"
						@click="passwordShow = !passwordShow"
						alt
					/>
					</el-form-item>
				<el-form-item>
				<button type="button" class="MBtn loginBtn" @click="submitLogin()">登录</button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			passwordShow: true,
			loginFlag: true,
			loginForm: {
				phone: "",
				password: ""
			}
		};
	},
	methods: {
		submitLogin() {
			if (!this.loginForm.phone.trim()) {
				this.$message.error("请输入用户名");
				return;
			}
			if (!this.loginForm.password) {
				this.$message.error("请输入密码");
				return;
			}
			// if (!this.loginFlag) return;
			this.loginFlag = false;
			this.$store.dispatch("Login", {token: 'hjhadkhskshk'});
		}
	}
};
</script>
<style lang="scss" scoped>
.login {
	margin: 0 auto;
	height: 100vh;

	.login-form {
		margin: 200px auto;
		width: 500px;
		height: 300px;
		border-radius: 20px;
		border: 1px solid #ccc;

		.login-text {
			margin: 20px;
			text-align: center;
		}

		.el-input {
			width: 300px !important;
		}

		.password-show {
			position: relative;
			img {
				position: absolute;
				top: 10px;
				right: 110px;
				width: 20px;
				height: 20px;
			}
		}

		.loginBtn {
			width: 300px;
			height: 40px;
			line-height: 40px;
			outline: none;
		}
	}
}
</style>
