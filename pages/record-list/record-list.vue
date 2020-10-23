<template>
	<view class="warp">
		<view class="box">
			<view class="title">当天记录列表</view>
			<t-table border="2" border-color="#1296db" :is-check="false" @change="change">
				<t-tr font-size="14" color="#1296db" align="left">
					<t-th align="left">姓名</t-th>
					<t-th align="left">上午</t-th>
					<t-th align="left">下午</t-th>
					<t-th align="center">操作</t-th>
				</t-tr>
				<t-tr font-size="12" color="#1296db" align="right" v-for="(item,index) in recordList" :key="item._id">
					<t-td align="left">{{ item.nickName }}</t-td>
					<t-td align="left">{{ item.morning.time==null||item.morning.time==''||item.morning.time=='休假'?item.morning.time:item.morning.time.substring(10,16) }}</t-td>
					<t-td align="left">{{ item.afternoon.time==null||item.afternoon.time==''||item.afternoon.time=='休假'?item.afternoon.time:item.afternoon.time.substring(10,16)}}</t-td>
					<t-td align="left"><button @click="detail(index)">详情</button></t-td>
				</t-tr>
			</t-table>
		</view>

		<!-- 详情 -->
		<uni-popup :show="isShowDetail" position="middle" mode="fixed" @hidePopup="togglePopup(false)">
			<view class="title" style="padding: 20upx 0;font-weight: bold;width: 100%;text-align: center;border-bottom: 1px solid #666;">上午</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<text class="text">记录时间:</text>
				<text>{{record.morning.time}}</text>
				<view class="text">记录地点:</view>
				<view>{{record.morning.address}}</view>
			</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<view>{{record.morning.remarks}}</view>
			</view>
			
			<view class="title" style="padding: 20upx 0;font-weight: bold;width: 100%;text-align: center;border-bottom: 1px solid #666;">下午</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<text class="text">记录时间:</text>
				<text>{{record.afternoon.time}}</text>
				<view class="text">记录地点:</view>
				<view>{{record.afternoon.address}}</view>
			</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<view>{{record.afternoon.remarks}}</view>
			</view>
			
			<view class="bottom" style="padding: 20upx 10upx;color: cadetblue;width: 100%;text-align: center;border-top: 1px solid #666;"
			 @click="togglePopup('')">关闭</view>
		</uni-popup>

	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';

	import {
		formateDate
	} from "@/common/util.js"

	let _self = null;
	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd
		},
		data() {
			return {
				isShowDetail: false,//是否显示详情
				//记录
				record:{
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
				recordList: [] //记录数据列表
			}
		},
		onShow() {
			//加载列表数据
			_self.$api.request('get-record', {
				ymd: formateDate(new Date(), 'Y-M-D')
			}).then((res) => {
				_self.recordList = res;
			})
		},
		onLoad() {
			_self = this;
		},
		methods: {
			togglePopup(isShowDetail) {
				_self.isShowDetail = isShowDetail;
			},
			detail(index) {
				_self.isShowDetail = true;
				_self.record=_self.recordList[index];
			}
		}
	}
</script>

<style>

</style>
