import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


/**
 * 认证token使用的key
 */
const tokenKey = 'accessToken';
/**
 * 提示
 */
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

/**
 * 确认框
 */
const confirm = (content, callBackFun, title = '确认提示') => {
	uni.showModal({
		content: content,
		title: title,
		success: function(res) {

			callBackFun(res.confirm);
			// if (res.confirm) {
			//     console.log('用户点击确定');
			// } else if (res.cancel) {
			//     console.log('用户点击取消');
			// }
		}
	})
}

//登陆锁
// let loginLock = false;
//过滤认证的路径
let filterUrl = ['get-openid'];
const request = (name, data = {}, failFun) => {
	let isCheck = true;
	for (let i = 0; i < filterUrl.length; i++) {
		if (name == filterUrl[i]) {
			isCheck = false;
		}
	}
	if (isCheck) {
		if (!checkUserInfo())
			return;
	}
	if (data.offset == null && data.pageNumber == null) {
		uni.showLoading({
			title: '加载中...'
		});
	}
	data['openid'] = getUserOpenid();
	data['nickName'] = getUserNickName();
	data['avatarUrl'] = getUserAvatarUrl();
	data['department'] = getUserDepartment();
	return new Promise(resolve => {
		uniCloud.callFunction({
			name: name,
			data: data,
			success: (res) => {
				console.log('云函数:' + name + '参数:' + JSON.stringify(data) + '调用成功返回:' + JSON.stringify(res.result))
				uni.hideLoading();
				if (res.success) {
					resolve(res.result);
				} else {
					if (failFun != null)
						failFun(res.result);
				}

			},
			fail: (fail) => {
				msg('云函数调用失败', 3000);
				console.log('云函数:' + name + '参数:' + JSON.stringify(data) + '调用失败返回:' + JSON.stringify(fail))
				uni.hideLoading();
				if (failFun != null)
					failFun(fail);
			}
		});
	});
};
/**
 * 获取用户
 */
const getUserInfo = () => {
	return uni.getStorageSync('userInfo');
}
/**
 * 设置用户
 */
const setUserInfo = (userInfo) => {
	uni.setStorageSync('userInfo', userInfo);
}

/**
 * 获取登录用户的唯一标记
 */
const getUserOpenid = () => {
	let userInfo = getUserInfo();
	if (!userInfo)
		return '';
	return userInfo.openid;
}
/**
 * 获取用户名
 */
const getUserNickName = () => {
	let userInfo = getUserInfo();
	if (!userInfo)
		return '';
	return userInfo.nickName;
}
/**
 * 获取头像
 */
const getUserAvatarUrl = () => {
	let userInfo = getUserInfo();
	if (!userInfo)
		return '';
	return userInfo.avatarUrl;
}
/**
 * 获取部门
 */
const getUserDepartment = () => {
	let userInfo = getUserInfo();
	if (!userInfo)
		return '';
	return userInfo.department;
}



/**
 * 检查用户
 */
const checkUserInfo = (isNavigate = true) => {
	let userInfo = getUserInfo();
	if (userInfo == null || userInfo == '' || userInfo.openid == null || userInfo.openid.length <= 0) {
		if (isNavigate) {
			//没登录情况
			uni.navigateTo({
				url: '/pages/user/login'
			});
		}
		// msg('需要授权才能访问');
		return false;
	}
	return true;
}
/**
 * 权限检查
 */
const checkReleaseJurisdiction = () => {
	let userInfo = getUserInfo();
	if (userInfo == null || !userInfo.releaseJurisdiction)
		return false;

	return userInfo.releaseJurisdiction;
}

var api = {
	request,
	msg,
	confirm,
	getUserInfo,
	setUserInfo,
	checkUserInfo,
	getUserOpenid,
	getUserAvatarUrl,
	getUserNickName,
	getUserDepartment,
	checkReleaseJurisdiction
};


export default api
