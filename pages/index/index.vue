<template>
	<view class="content">
		<view class="page-body">
			<view class="sign-title">
				<view class="sign-title-l">
					<view class="portrait">
						{{name.substr(-2)}}
					</view>
					<view class="text">
						<view class="name">
							{{name}}
						</view>
						<view class="gz">
							<text style="width: 35px;">部门:</text>
							<text class="t1">{{department}}</text>
						</view>
					</view>
				</view>
				<view class="sign-title-r">
					<view class="date">
						<picker disabled mode="date" :value="date" @change="bindDateChange">
							<view class="uni-input">{{date}}
								<uni-icon type="arrowdown"></uni-icon>
							</view>

						</picker>
					</view>
				</view>
			</view>
			<view style="text-align: center;padding: 20upx 0;color:" @click="openLocation">位置(点击刷新): <text style="color: #FF0000;"
				 @click="openLocation">{{address}}</text></view>
			<view class="content-show">
				<view>
					<view class="module CBlue" @click="clickSign">
						<view class="text">记录</view>
						<view class="time">{{time}}</view>
					</view>
				</view>
			</view>

			<view class="uni-timeline">
				<view class="uni-timeline-item uni-timeline-first-item">
					<view class="uni-timeline-item-divider" :style="{ background : (!isAm ? '#1AAD19' : '#bbb')}"></view>
					<view class="uni-timeline-item-content" style="height: 150px;">
						<view class="uni-timeline-item-content-t1">上午{{Timer[0].time}}</view>
						<view class="desc-pad" v-if="isAm">
							<view class="time uni-timeline-item-content-t">
								记录时间 {{(record.morning.time).substring(10,16)}}
							</view>
							<view>
								<uni-icon type="location-filled" /> {{record.morning.address}}</view>
							<view class="bz last" @click="showBz('amSign')">
								备注 <uni-icon :style="{color:'rgb(0, 122, 255)'}" type="forward"></uni-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-timeline-item uni-timeline-last-item">
					<view class="uni-timeline-item-divider" :style="{ background : (isAm&&!isPm ? '#1AAD19' : '#bbb')}"></view>
					<view class="uni-timeline-item-content" style="height: 150px;">
						<view>
							<view class="uni-timeline-item-content-t1">下午{{Timer[1].time}}</view>
							<view v-if="isAm" class="desc-pad">
								<view class="desc-pad" v-if="isPm">
									<view class="time uni-timeline-item-content-t">
										记录时间:{{(record.afternoon.time).substring(10,16)}}
									</view>
									<view>
										<uni-icon type="location-filled" />{{record.afternoon.address}}</view>
									<view class="bz last" @click="showBz('pmSign')">
										备注
										<uni-icon :style="{color:'rgb(0, 122, 255)'}" type="forward" />
									</view>
								</view>

							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
		<!-- 备注 -->
		<uni-popup :show="type === 'middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
			<view class="title" style="padding: 20upx 0;font-weight: bold;width: 100%;text-align: center;border-bottom: 1px solid #666;">记录备注</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<text class="text">记录时间:</text>
				<text>{{bzText.time}}</text>
				<view class="text">记录地点:</view>
				<view>{{bzText.address}}</view>
			</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<view>{{bzText.remarks}}</view>
			</view>
			<view class="bottom" style="padding: 20upx 10upx;color: cadetblue;width: 100%;text-align: center;border-top: 1px solid #666;"
			 @click="togglePopup('')">关闭</view>
		</uni-popup>
	</view>
</template>

<script>
	let _self = null;
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import {
		formateDate,
		isSameDay
	} from "@/common/util.js"


	export default {
		components: {
			uniIcon,
			uniPopup
		},
		data() {
			return {
				name: '张三', //名称
				department: '未知', //部门
				bzText: {
					time: "",
					address: "",
					remarks: ""
				},
				type: "",
				Timer: [{
					time: "09:00",
				}, {
					time: "14:00"
				}], //上下班时间
				isAm: false, //上午是否记录
				isPm: false, //下午是否记录
				//记录
				record: {
					ymd: formateDate(new Date(), 'Y-M-D'),
					//上午
					morning: {
						time: "",
						address: "",
						remarks: "",
					},
					//下午
					afternoon: {
						time: "",
						address: "",
						remarks: "",
						img: ""
					}
				},
				isSign: false, //是否记录
				time: formateDate(new Date(), 'h:min:s'), //当前时分秒
				date: formateDate(new Date(), 'Y-M-D'),
				latitude: "", //当前经度
				longitude: "", //当前维度
				address: "请点击选择位置", //
				wqInfo: null,
				signInfo: {
					mode: "",
					latitude: "",
					longitude: "",
					address: "",
					time: "",
					remarks: ""
				}
			}
		},
		onShow() {

			_self.record.ymd = formateDate(new Date(), 'Y-M-D');
			_self.time = formateDate(new Date(), 'h:min:s');
			_self.date = formateDate(new Date(), 'Y-M-D');

			if (!this.$api.checkUserInfo(false))
				return;
			_self.name = this.$api.getUserNickName();
			_self.department = this.$api.getUserDepartment();
			_self.isAm = false;
			_self.isPm = false;
			_self.$api.request('find-record', {
				ymd: _self.record.ymd
			}).then((res) => {
				if (res && res.morning) {
					_self.record = res;
					if (_self.record.morning.time)
						_self.isAm = true;
					if (_self.record.afternoon.time)
						_self.isPm = true;
				}
			});

			_self.getLocation();
			_self.getTime();
		},
		// 初始化
		onLoad() {
			_self = this;
		},
		methods: {
			togglePopup(type) {
				this.type = type;
			},
			// 腾讯位置服务
			getAdd() {
				// if (this.isAm && this.isPm) {
				// 	return;
				// }
				var url =
					`https://apis.map.qq.com/ws/geocoder/v1/?location=${_self.latitude},${_self.longitude}&key=3DABZ-JP5EF-I6EJE-JALWN-IOBP6-A5FDF`;
				uni.request({
					url,
					success(res) {
						var data = res.data;
						if (data.status != 0) {
							uni.showToast({
								title: data.message,
								icon: "none"
							})
							return;
						}

						let address = res.data.result.address + res.data.result.formatted_addresses.recommend
						_self.address = address;
						_self.signInfo.address = address;

					}
				})
			},
			// 重新定位
			relocation() {
				uni.navigateTo({
					url: "/pages/sign/sign",
				})
			},
			// 选择记录日期
			bindDateChange: function(e) {
				this.date = e.target.value
			},

			// 显示备注
			showBz(type) {
				_self.type = 'middle-list';
				if (type == 'amSign') {
					_self.bzText.time = _self.record.morning.time;
					_self.bzText.address = _self.record.morning.address;
					_self.bzText.remarks = _self.record.morning.remarks;
				} else if (type == 'pmSign') {
					_self.bzText.time = _self.record.afternoon.time;
					_self.bzText.address = _self.record.afternoon.address;
					_self.bzText.remarks = _self.record.afternoon.remarks;
				}
			},
			// 实时时间
			getTime() {
				var that = this;
				setInterval(function() {
					that.time = formateDate(new Date(), 'h:min:s')
				}, 1000)
			},
			// 获取当前位置
			getLocation() {
				var that = this;

				uni.showLoading({
					title: "获取定位中...",
					mask: true
				})

				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success(res) {
						uni.hideLoading();
						that.latitude = res.latitude;
						that.longitude = res.longitude;


						that.signInfo.latitude = res.latitude;
						that.signInfo.longitude = res.longitude;
						that.signInfo.mode = "正常记录";

						that.getAdd()
					},
					fail(err) {
						uni.hideLoading();
						that.address = "请检查位置信息！"
						uni.showToast({
							title: "请检查位置信息状态！",
							icon: "none",
							mask: true,
							duration: 3000
						})
					}
				});
			},
			// 点击记录
			clickSign() {
				uni.requestSubscribeMessage({
					tmplIds: ['tzP66ph-WMw4ULXPl0oX7ibLnPSzeaeSqn7pFL-8sqc'],
					success(res) {
						console.log(res);
					}
				});
				if (_self.isAm && _self.isPm) {
					_self.$api.msg('已记录完成,不需要重复记录');
					return;
				}
				if (_self.address == '请点击选择位置') {
					uni.showToast({
						title: "请检查位置信息状态！",
						icon: "none",
						mask: true,
						duration: 3000
					})
					return;
				}

				_self.signInfo.time = formateDate(new Date(), 'Y-M-D h:min:s');

				//上午记录
				if (_self.isAm === false) {
					_self.record.morning = _self.signInfo;
					_self.$api.request('add-record', _self.record).then((res) => {
						_self.isAm = true;
						_self.record = res;
					});
				} else { //下午记录
					_self.record.afternoon = _self.signInfo;
					_self.$api.request('add-record', _self.record).then((res) => {
						_self.isPm = true;
						_self.record = res;
					});
				}

			},
			// 选择地址
			openLocation() {
				_self.getLocation();
				_self.getTime();
				return;
				uni.chooseLocation({
					success: function(res) {
						_self.address = res.address;
						_self.signInfo.address = res.address;
					}
				});
			},
		},
	}
</script>

<style>
	.map {
		width: 100%;
		height: 260px;
	}

	.uni-list-cell-left {
		padding: 0 30upx;
	}

	.text-desc {
		display: flex;
		justify-content: space-between;
		padding: 10upx 20upx
	}

	.colorRed {
		color: red;
	}

	.colorGreen {
		color: #32CD32;
	}

	.colorYellow {
		color: yellow;
	}

	.colorBlue {
		color: #007aff;
	}

	.bgBlue {
		background-color: #007aff;
	}

	.bgGreen {
		background-color: #32CD32;
	}

	.bgAsh {
		background-color: #C8C7CC;
	}

	.uni-timeline {
		padding: 30upx 20upx;
	}

	.uni-timeline-item-content-t {
		font-weight: bold;
	}

	.desc-pad {
		padding: 0 0upx
	}

	.desc-pad .bz {
		color: rgb(0, 122, 255);
	}

	.desc-pad .bz .icon {
		color: rgb(0, 122, 255)
	}

	.uni-timeline-last-item .uni-timeline-item-divider {
		background: #bbb;
	}

	.CBlue {
		background-color: #007aff;
		box-shadow: 0 5px 5px #007aff;
	}

	.CGreen {
		background-color: #32CD32;
		box-shadow: 0 5px 5px #32CD32;
	}

	.CAsh {
		background-color: #C8C7CC;
		box-shadow: 0 5px 5px #C8C7CC;
	}

	.module {
		overflow: hidden;
		margin: 20upx auto;
		width: 220upx;
		height: 220upx;
		border-radius: 50%;
		color: #fff;
		text-align: center;
	}

	.module .text {
		font-size: 20px;
		margin: 50upx auto 10upx;
	}

	.uni-timeline-item .uni-timeline-item-content {
		width: 100%;
		padding-right: 20upx;
	}

	.content-show {
		width: 100%
	}

	.sign-title {
		display: flex;
		justify-content: space-between;
		padding: 30upx 24upx;
		border-bottom: 1upx solid #333;
	}

	.sign-title .portrait {
		width: 100upx;
		height: 100upx;
		line-height: 100upx;
		border-radius: 50%;
		background-color: #007AFF;
		color: #fff;
		font-size: 28upx;
		text-align: center;
	}

	.sign-title .sign-title-l {
		display: flex;
	}

	.sign-title .sign-title-l .text {
		margin-left: 20upx;
	}

	.sign-title .sign-title-l .text .name {
		font-size: 32upx;
	}

	.sign-title .sign-title-l .text .gz {
		color: darkblue;
		display: inline-flex;
	}

	.sign-title .sign-title-l .text .gz text {
		display: inline-block;
	}

	.sign-title .sign-title-l .text .gz .t1 {
		overflow: hidden;
		/*超出部分隐藏*/
		text-overflow: ellipsis;
		/* 超出部分显示省略号 */
		white-space: nowrap;
		/*规定段落中的文本不进行换行 */
		width: 300upx;
		/*需要配合宽度来使用*/
	}

	.iswq {
		padding: 0px 12px;
		color: #99CC33;
		border: 1px solid #99CC33;
		width: 26px;
		height: 24px;
		border-radius: 4px;
		margin-left: 20upx;
		display: inline-block;
	}

	.desc-pad .last {
		margin-bottom: 80upx;
	}

	.relocation {
		color: #0000FF;
	}

	.uni-popup .content .text {
		color: #666666;
	}
</style>
