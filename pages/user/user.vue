<template>
	<view class="">
		<view class="center">
			<view class="logo" @click="bindLogin" :hover-class="!hasLogin ? 'logo-hover' : ''">
				<image class="logo-img" :src="avatarUrl"></image>
				<view class="logo-title">
					<text class="uer-name">Hi，{{hasLogin ? nickName : '您未登录'}}</text>
					<text class="go-login navigat-arrow" v-if="!hasLogin">&#xe65e;</text>
				</view>
			</view>
			<view class="center-list">
				<view class="center-list-item border-bottom" @click="togglePopup(true)">
					<text class="list-icon">&#xe60f;</text>
					<text class="list-text">帐号管理</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				<!-- <view class="center-list-item">
					<text class="list-icon">&#xe639;</text>
					<text class="list-text">新消息通知</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view> -->
			</view>
			<!-- 	<view class="center-list">
				<view class="center-list-item border-bottom">
					<text class="list-icon">&#xe60b;</text>
					<text class="list-text">帮助与反馈</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				<view class="center-list-item" >
					<text class="list-icon">&#xe65f;</text>
					<text class="list-text">服务条款及隐私</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
			</view> -->
			<view class="center-list">
				<view class="center-list-item">
					<text class="list-icon">&#xe614;</text>
					<text class="list-text">关于应用</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
			</view>
			<view class="btn-row">
				<button v-if="hasLogin" class="primary base-background-color" style="background-color: #1296db;" type="primary"
				 @tap="bindLogout">退出登录</button>
			</view>
		</view>


		<!-- 用户信息 -->
		<uni-popup :show="isShowUserInfoView" position="middle" mode="fixed" @hidePopup="togglePopup(false)">
			<view class="title" style="padding: 20upx 0;font-weight: bold;text-align: center!important;">用户信息</view>
			<view class="uni-list" style="padding: 20upx 10upx;width: 100%;">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">姓名:</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" v-model="updateNickName" />
					</view>
				</view>
			</view>
			<view class="uni-list" style="padding: 20upx 10upx;width: 100%;">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">部门:</view>
					<view class="uni-list-cell-db">
						<!-- <input class="uni-input" v-model="department" /> -->
						<picker @change="bindDepartmentChange" :value="departmentIndex" :range="departmentList" >
							<view class="uni-input">{{departmentList[departmentIndex]}}
							<uni-icon type="arrowdown"></uni-icon>
							</view>
						</picker>
					</view>
				</view>
			</view>
		<!-- 	
			<view class="uni-list" style="padding: 20upx 10upx;width: 100%;">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">姓名:</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" v-model="updateNickName" />
						<button type="default" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
					</view>
				</view>
			</view> -->
			
			
		
			
			
			<view class="bottom" style="padding: 20upx 10upx;color: cadetblue; text-align: center !important;" @click="onOk()">确定</view>
			<view class="bottom" style="padding: 20upx 10upx;color: cadetblue;text-align: center !important;" @click="togglePopup('')">关闭</view>
		</uni-popup>

	</view>

</template>

<script>
	let _self = null;
	export default {
		data() {
			return {
				departmentList: ['空','R1-PD1', 'R1-PD2'],
				departmentIndex: 0,
				isShowUserInfoView: false,
				avatarUrl: "../../static/logo.png",
				nickName: '您未登录',
				updateNickName: '',
				department: '',
				hasLogin: false,
			}
		},
		computed: {

		},
		onLoad() {
			_self = this;
		},
		onShow() {
			let userInfo = this.$api.getUserInfo();
			if (userInfo) {
				this.$data.avatarUrl = userInfo.avatarUrl;
				this.$data.nickName = userInfo.nickName;
				this.$data.hasLogin = this.$api.checkUserInfo();
				_self.updateNickName = userInfo.nickName;
				_self.department = userInfo.department;
				for (let i = 0; i < _self.departmentList.length; i++) {
					if (_self.departmentList[i] == _self.department)
						_self.departmentIndex = i;
				}
			}
		},
		methods: {
			bindLogin() {
				if (!this.$api.checkUserInfo()) {
					// uni.navigateTo({
					// 	url: '../user/login',
					// });
				}
			},
			bindLogout() {
				this.$api.setUserInfo(null);
				this.$data.avatarUrl = '../../static/logo.png';
				this.$data.nickName = '';
				this.$data.hasLogin = this.$api.checkUserInfo();
			},
			/**
			 * 获取手机号码
			 */
			getPhoneNumber:(e)=>{
				debugger;
			},
			/**
			 * 部门选择变更
			 * @param {Object} e
			 */
			bindDepartmentChange: function(e) {
				_self.departmentIndex = e.target.value
				_self.department = _self.departmentList[_self.departmentIndex];
			},
			/**
			 * 跳转到某路径
			 */
			goToPath: (path) => {
				uni.navigateTo({
					url: path
				});
			},
			togglePopup: (isShowUserInfoView) => {
				_self.isShowUserInfoView = isShowUserInfoView;
			},
			onOk: () => {
				if (_self.$api.checkUserInfo()) {
					_self.$api.request('update-user', {
						updateNickName: _self.updateNickName,
						updateDepartment: _self.department
					}).then((res) => {
						_self.$api.setUserInfo(res);
						_self.togglePopup(false);
						_self.nickName = _self.updateNickName;
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	page,
	view {
		display: flex;
	}

	page {
		background-color: #f8f8f8;
	}

	button {
		width: 100%;
	}

	.center {
		flex-direction: column;
	}

	.logo {
		width: 750rpx;
		height: 240rpx;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: $base-background-color;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
	}

	.logo-title {
		height: 150rpx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20rpx;
	}

	.uer-name {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 38rpx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38rpx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150rpx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		width: 750rpx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90rpx;
		width: 750rpx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0rpx 20rpx;
	}

	.border-bottom {
		border-bottom-width: 1rpx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		color: $base-background-color;
		text-align: center;
		font-family: texticons;
		margin-right: 20rpx;
	}

	.list-text {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90rpx;
		width: 40rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>
