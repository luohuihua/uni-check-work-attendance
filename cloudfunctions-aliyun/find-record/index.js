'use strict';
const db = uniCloud.database();
const collection = db.collection('record');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	let datas = await collection.where({
		openid: event.openid,
		ymd: event.ymd
	}).get();
	if (datas.affectedDocs > 0)
		return datas.data[0];
	//返回数据给客户端
	return event
};
