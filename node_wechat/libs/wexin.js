'use strict'
var config = require('../config/config')
var Wechat = require('./wechat')
const chalk = require('chalk');
var wechatApi = new Wechat(config.wechat)
var image = {}

exports.reply = function *(next) {
    let message = this.wexin.message
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫二维码进来： ' + message.EventKey + '' + message.ticket)
            }
            this.body = '你已经订阅了我的账号\r\n';
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = '无情取关'
        } else if(message.Event === 'LOCATION'){
            this.body = '您上传的位置是： ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
        } else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单： ' + message.EventKey
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫描二维码' + message.EventKey + '' + message.Ticket)
            this.body = '看到你扫了一下'
        } else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中链接： ' + meesage.EventKey
        }
    } else if(message.MsgType === 'text'){
        var content = message.Content
        var reply = '额，你说的'+ message.Content + '太复杂了'
        if (content === '1') {
            reply = '天下第一'
        } else if (content === '2') {
            reply = '天下第二'
        } else if (content === '3') {
            reply = '天下第三'
        } else if (content === '4') {
            reply = [{
                title: '技术改变世界',
                description: '描述改变生活',
                picUrl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
                url: 'https://nodejs.org/'
            }]
        } else if (content === '5'){
            if (!image.media_id) {
                image = yield wechatApi.uploadMaterial('image', __dirname + '/static/1.jpg')
            }
            reply = { 
                type: image.type,
                mediaId: image.media_id,
            }
        } else if (content === '7') {
            if (!image.media_id) {
                image = yield wechatApi.uploadMaterial('image', __dirname + '/static/1.jpg')
            }
            reply = { 
                type: 'music',
                title: '回复音乐内容',
                description: '一起麦动起来',
                musicUrl: 'http://www.ytmp3.cn/down/54307.mp3',
                hqMusicUrl: '',
                thumbMediaId: image.media_id
            }
        }
        this.body = reply
        // console.log('这不是事件推送')
    }
    yield next
}
