'use strict';
const db = uniCloud.database();
const collection = db.collection('record');

const restCollection = db.collection('rest');

const dbCmd = db.command
const $ = dbCmd.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	let datas = await collection.where({
		ymd: event.ymd,
		department: event.department
	}).get();


	let rest = await restCollection.where({endDate:dbCmd.gte(event.ymd)}).get()

	console.log('请假数据 : ', JSON.stringify(rest))


	for (let i = 0; i < rest.data.length; i++) {
		let restData = rest.data[i];
		let exists = false;
		for (let j = 0; j < datas.data.length; j++) {
			let recordData = datas.data[j];
			if (recordData.openid == restData.openid) {
				exists = true;
				// console.log('存在');
				recordData.morning.time = '休假';
				recordData.morning.address = '休假';
				recordData.afternoon.time = '休假';
				recordData.afternoon.address = '休假';
			}
		}
		if (!exists) {
			// console.log('不存在');
			datas.data.push({
				ymd: event.ymd,
				nickName: restData.applicant,
				morning: {
					time: '休假',
					address: '休假'
				},
				afternoon: {
					time: '休假',
					address: '休假'
				}
			});
		}
	}


	//返回数据给客户端
	return datas.data;
};
