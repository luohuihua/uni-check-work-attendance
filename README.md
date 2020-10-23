# uni-check-work-attendance
日常报到小程序项目，服务端使用云函数，持久层使用云数据库
主要功能：
1：签到
2：部门人员签到记录列表
3：休假管理，包括微信消息订阅，模板消息发送([申请开通微信订阅以及模板申请路径](https://mp.weixin.qq.com/)，[订阅消息发送api路径](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html))
4：我的，账号管理，用于姓名以及部门修改

# 开发工具使用HBuilderx
[下载地址](https://www.dcloud.io/hbuilderx.html)

## 打开项目后需要修改
## manifest.json   基础配置：重新获取appid  微信小程序配置：需要修改为自己的appid
## cloudfunctions-aliyun/get_openid/index.js   需要修改appid,secret，用于获取微信的唯一标记
## cloudfunctions-aliyun/send-temp-message/index.js   需要修改appid,secret，用于微信消息模板发送的唯一标记

## 功能截图
![image](static/page1.jpg)
![image](static/page2.jpg)
![image](static/page3.jpg)
![image](static/page4.jpg)

## 小程序码
![image](static/小程序演示码.jpg)

