'use strict';
const db = uniCloud.database();
const collection = db.collection('rest');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let datas = await collection.where({
		openid: event.openid,
	}).orderBy('_id','desc').get();
	//返回数据给客户端
	return datas;
};
