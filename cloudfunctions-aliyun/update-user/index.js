'use strict';
const db = uniCloud.database();
const collection = db.collection('user');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let res = await collection.where({
		openid: event.openid
	}).get();
	await collection.doc(res.data[0]._id).update({
		nickName: event.updateNickName,
		department: event.updateDepartment
	});

	res = await collection.where({
		openid: event.openid
	}).get();
	//返回数据给客户端
	return res.data[0];
};
