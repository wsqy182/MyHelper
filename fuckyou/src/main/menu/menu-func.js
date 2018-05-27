/* eslint-disable */
/**
 * 初始化菜单
 * @type {Electron}
 */
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain
const dialog = electron.dialog
const app = electron.app



/**
 * 导入数据库模块
 */
import {Dao} from '../db'

// 导入相关菜单事件的常量
import {channels} from './menu-event-const'

// 保存当前菜单的上下文
let context = null

// 保存MenuFunc中内部this的指针.
let that = undefined


// 定义菜单项的功能
const menu = new Menu()

/**
 * 菜单对外暴漏的函数
 * @type {{refresh_: MenuFunc.refresh_, copy_: MenuFunc.copy_, _init_: MenuFunc._init_}}
 */
var MenuFunc = {
    /**
     * 刷新菜单被按下
     */
    refresh_: function () {
        // 获取sqlite3数据库中最新的数据
        Dao.getAll().then((res) => {
            console.log("refresh_data", res)
            that.refresh_data(res);
            // 通知页面进行刷新
            context.webContents.send(channels.refresh_);
        }).catch(err => {
            console.log("refresh_faild", err)
        });
    },
    /**
     *  刷新共享数据
     */
    refresh_data(dbData) {
        console.log("data is ", dbData);
        global.sharedObject.dbData = dbData
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
    /**
     * 创建相关的菜单
     * @private
     */
    _init_: function (webContent) {
        that = this;
        menu.append(new MenuItem({label: '刷新', click: that.refresh_}))
        menu.append(new MenuItem({label: '复制', click: that.copy_}))
        menu.append(new MenuItem({label: '粘贴', click: that.paste_}))
        menu.append(new MenuItem({label: '删除', click: that.delete_}))
        menu.append(new MenuItem({label: '寻找', click: that.find_}))
        menu.append(new MenuItem({label: '同步', click: that.send_}))
        menu.append(new MenuItem({label: '帮助', click: that.help_}))
        // 窗口创建时绑定上下文菜单
        app.on('browser-window-created', function (event, win) {
            win.webContents.on('context-menu', function (e, params) {
                menu.popup(win, params.x, params.y)
            })
            context = win;
        })
        // 主进程监听确认删除事件
        ipc.on(channels.delete_confirm_, (event, arg) => {
            // 删除数据
            Dao.delete(arg).then(res => {
                    // 读取最新的数据
                    Dao.getAll().then(res => {
                        // 刷新数据
                        that.refresh_data(res)

                        event.returnValue = true
                    }).catch(res => {
                        event.returnValue = false
                    })
                }
            ).catch(err => {
                event.returnValue = false
            });
        })
        return true;
    },
}


/**
 * 初始化菜单
 */
MenuFunc._init_();
/**
 * 导出该模块
 */
export {MenuFunc}


