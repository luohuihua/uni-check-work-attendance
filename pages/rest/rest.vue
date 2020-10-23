<template>
	<view class="warp">
		<uni-fab :pattern="pattern" :content="content" horizontal="left" vertical="bottom" direction="vertical" @trigger="trigger"></uni-fab>
		<view class="box">
			<view class="title">休息记录列表</view>
			<t-table border="2" border-color="#1296db" :is-check="false" @change="change">
				<t-tr font-size="14" color="#1296db" align="left">
					<t-th align="left">休假人</t-th>
					<t-th align="left">开始时间</t-th>
					<t-th align="left">结束时间</t-th>
					<t-th align="center">操作</t-th>
				</t-tr>
				<t-tr font-size="12" color="#1296db" align="right" v-for="(item,index) in restList" :key="item._id">
					<t-td align="left">{{ item.nickName }}</t-td>
					<t-td align="left">{{ item.startDate }}</t-td>
					<t-td align="left">{{ item.endDate}}</t-td>
					<t-td align="left"><button @click="update(index)">修改</button></t-td>
				</t-tr>
			</t-table>
		</view>

		<!-- 备注 -->
		<uni-popup :show="isAddView" position="middle" mode="fixed" @hidePopup="togglePopup(false)">
			<view class="title" style="padding: 20upx 0;font-weight: bold;width: 100%;text-align: center;border-bottom: 1px solid #666;">休假信息</view>
			<view class="content" style="padding: 20upx 10upx;width: 100%;">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">休假人:</view>
					<view class="uni-list-cell-db">
						<text>{{rest.applicant}}</text>
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-list-cell-left">开始时间:</view>
					<view class="uni-list-cell-db">
						<picker mode="date" :value="rest.startDate" @change="bindStartDateChange">
							<view class="uni-input">{{rest.startDate}}
								<uni-icon type="arrowdown"></uni-icon>
							</view>
						</picker>
					</view>
				</view>

				<view class="uni-list-cell">
					<view class="uni-list-cell-left">结束时间:</view>
					<view class="uni-list-cell-db">
						<picker mode="date" :value="rest.endDate" @change="bindEndDateChange">
							<view class="uni-input">{{rest.endDate}}
								<uni-icon type="arrowdown"></uni-icon>
							</view>
						</picker>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<textarea type="text" :value="rest.note" @input="bindTextAreaBlur" placeholder="备注信息" />
						</view>
				</view>
			</view>
		
		<view class="bottom" style="padding: 20upx 10upx;color: cadetblue;width: 100%;text-align: center;border-top: 1px solid #666;"
		 @click="onAddRest()">确定</view>
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
	import uniFab from '@/components/uni-fab/uni-fab.vue';

	import {
		formateDate
	} from "@/common/util.js"

	let _self = null;
	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd,
			uniFab
		},
		data() {
			return {
				isAddView: false, //是否显示新增
				pattern: {
					buttonColor: '#1296db'
				}, //样式
				content: [{
					text: '新增',
					iconPath: '../../static/img/btn-add.png'
				}],
				restList: [], //记录数据列表
				rest: {
					applicant: '',
					startDate:  formateDate(new Date(), 'Y-M-D'),
					endDate:  formateDate(new Date(), 'Y-M-D'),
					note: ''
				}
			}
		},
		onShow() {
			//加载列表数据
			_self.initDatas();
		},
		onLoad() {
			_self = this;
		},

		methods: {
			initDatas:()=>{
				_self.$api.request('get-rest', {}).then((res) => {
					_self.restList = res.data;
				})
				_self.rest.applicant = _self.$api.getUserNickName();
			},
			 bindTextAreaBlur: function (e) {
				 _self.rest.note=e.detail.value;
			   
			},
			togglePopup: (isAddView) => {
				_self.isAddView = isAddView;
			},
			trigger: (data) => {
				_self.togglePopup(true);
			},
			update: (index) => {
				let item=_self.restList[index];
				_self.togglePopup(true);
				for(let key in item){
					_self.rest[key]=item[key];
				}
			},
			// 选择开始日期
			bindStartDateChange: (e) =>{
				_self.rest.startDate = e.target.value
			},
			// 选择结束日期
			bindEndDateChange: (e) =>{
			_self.rest.endDate = e.target.value
			},
			/**
			 * 新增休假
			 */
			onAddRest:()=>{
				_self.$api.request('add-rest',_self.rest).then((res)=>{
					_self.togglePopup(false);
					_self.initDatas();
					_self.$api.request('send-temp-message',_self.rest).then((res)=>{
						_self.$api.msg('通知成功');
					});
				});
			}
		}
	}
</script>

<style>

</style>
