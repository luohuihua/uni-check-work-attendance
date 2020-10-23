<template>
	<view style="padding-top: 40upx;">
		<view class="inputArea" style="text-align: center;">
			<image class="logo-img" src="/static/logo.png"></image>
		</view>

		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V animate__animated animate__bounce" style="text-align: center;">该程序将获取一下授权</view>
			<view class="flex-item flex-item-V" style="text-align: center; font-size: 11px;color: #808080;padding-top: 10px;">获取你的公开信息(昵称，头像等)</view>
		</view>

		<view style="padding: 40px;">
			<button type="primary" class="login-button base-background-color" style="background-color: #007AFF;" open-type="getUserInfo" @getuserinfo="goLogin">授权</button>
			<button @click="onCancle()" style="background-color: #FFFFFF;font-size: 32upx; padding-top: 10px;color: #808080;">取消</button>
		</view>

	</view>
</template>

<script>
	let _self;
	export default {
		components: {},
		data() {
			return {

			}
		},
		onLoad() {
			_self = this;
		},
		methods: {
			goLogin() {
				_self.getUserInfo();
			},
			onCancle: () => {
				uni.navigateBack({
					delta: 1
				})
			},
			getUserInfo: () => {
				uni.showLoading({
					title: '正在授权登录中........'
				});
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							withCredentials: true,
							success: (infoRes) => {
								_self.$api.request('get-openid', {
									code: loginRes.code
								}).then((res) => {
									uni.hideLoading();
									//获取到openid
									let openid = res.data.openid;
									let userInfo = infoRes.userInfo;
									userInfo.openid = openid;

									_self.$api.setUserInfo(userInfo);
									_self.$api.request('login', userInfo).then((res) => {
										_self.$api.setUserInfo(res.data);
									});
									// callCloudFunction('user_add', userInfo, (res) => {

									// });
									console.log('用户信息:' + JSON.stringify(userInfo));
									// uni.switchTab({
									// 	url: '/pages/tabbar/home'
									// });
									uni.navigateBack({
										delta: 1
									})
								});
							},
							fail: (fail) => {
								uni.hideLoading();
								uni.showToast({
									icon: "none",
									title: '需要允许授权'
								});
							}
						});
					},
					fail: (fail) => {
						uni.hideLoading();
						console.log(JSON.stringify(fail));
					}
				});
			}
		}
	}
</script>

<style>
	button::after {
		border: none;
	}


	.inputArea {
		padding: 30upx 10%;
	}

	.inputClass {
		border: 2px solid #ccc;
		border-radius: 44upx;
		outline: 0;
		width: 90%;
		padding: 16upx 30upx;
		background-color: #FFFFFF;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.login-button {
		/* background: #2fc25b; */
		color: #FFFFFF;
		border-radius: 44upx;
		font-size: 35upx;
		text-align: center;
		padding: 20upx;
	}
</style>
