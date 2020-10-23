'use strict';
const appid = 'xxxxxxxx'; //小程序的appid
const secret = 'xxxxxxxx'; //小程序的secret
const getTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' +
	secret; //请求网址

const db = uniCloud.database();
const collection = db.collection('user');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	//获取授权token
	let res = await uniCloud.httpclient.request(getTokenUrl, {
		data: {},
		dataType: 'json'
	})

	let sendUrl = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + res.data.access_token;

	//查询当前部门所有用户
	let userList = await collection.where({
		department: event.department
	}).get();

	for (let i = 0; i < userList.data.length; i++) {
		let user = userList.data[i];
		let postData = {
			template_id: 'tzP66ph-WMw4ULXPl0oX7ibLnPSzeaeSqn7pFL-8sqc',
			touser: user.openid,
			page:'pages/record-list/record-list',
			data: {
				thing1: {
					value: event.applicant
				},
				time2: {
					value: event.startDate + '~' + event.endDate
				},
				thing4: {
					value: event.note
				}
			}
		};
		console.log('参数 : ', JSON.stringify(postData));
		//发模板消息
		res = await uniCloud.httpclient.request(sendUrl, {
			method: 'POST',
			data: JSON.stringify(postData),
			dataType: 'json',
			// contentType:'json'
		})
	}


	//返回数据给客户端
	return res;
};
