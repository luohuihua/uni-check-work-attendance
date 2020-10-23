'use strict';
const db = uniCloud.database();
const collection = db.collection('rest');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	//存在则更新
	if (event._id) {
		let id=event._id;
		delete event._id;
		await collection.doc(id).update(event);
		return event;
	}
	
	event['date'] = new Date().toISOString();
	let res = await collection.add(event);
	event._id = res.id;
	console.log('返回结果res : ' + JSON.stringify(event));
	return event;
};
