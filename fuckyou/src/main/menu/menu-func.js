/* eslint-disable */
/**
 * 初始化菜单
 * @type {Electron}
 */
const electron = require('electron')
const ipc = electron.ipcMain

/**
 * 导入数据库模块
 */
import {Dao} from '../db'

// 导入相关菜单事件的常量
import {channels} from './event-const'

// 导入一个bind_event中的函数
import {setVueData} from './bind_event'


/**
 * 菜单函数
 * @type {{refresh_: MenuFunc.refresh_, copy_: MenuFunc.copy_, _init_: MenuFunc._init_}}
 */
let context = undefined

var MenuFunc = {
    setContext: function (p_context) {
        context = p_context
    },
    /**
     * 刷新菜单被按下
     */
    refresh_: function () {
        console.log("refresh_");
        // 获取sqlite3数据库中最新的数据
        Dao.getAll().then((res) => {
            setVueData(res);
            // 通知页面进行刷新
            context.webContents.send(channels.refresh_);
        }).catch(err => {
            console.log("refresh_faild", err)
        });
    },
    /**
     * 复制菜单被按下
     * @private
     */
    copy_: function () {
        context.webContents.send(channels.copy_);
    },
    /**
     * 粘贴菜单被按下
     * @private
     */
    paste_: function () {
        context.webContents.send(channels.paste_);
    },
    /**
     * 删除菜单被按下
     * @private
     */
    delete_: function () {
        console.log("menu_delete_")
        // 通知渲染层,是否准备删除?
        context.webContents.send(channels.delete_);
    },
    find_: function () {
        context.webContents.send(channels.find_);
    },
    send_: function () {
        context.webContents.send(channels.send_);
    },
    help_: function () {
        context.webContents.send(channels.help_);
    },
}

/**
 * 导出该模块
 */
export {MenuFunc}


