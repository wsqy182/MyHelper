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
import {Dao} from '../main/db'

// 定义菜单项的功能
const menu = new Menu()

let context = null;

var MenuFunc = {
    /**
     * 菜单刷新
     */
    refresh_: function () {
        console.log("refresh_");
        Dao.getAll();
        context.webContents.send("data-refresh","a");
    },
    zzz: function () {

    },
    /**
     * 创建相关的菜单
     * @private
     */
    _init_: function (webContent) {
        menu.append(new MenuItem({label: '刷新', click: this.refresh_}))
        menu.append(new MenuItem({label: '复制', click: this.zzz}))
        menu.append(new MenuItem({label: '粘贴'}))
        menu.append(new MenuItem({label: '删除'}))
        menu.append(new MenuItem({label: '寻找'}))
        menu.append(new MenuItem({label: '同步'}))
        menu.append(new MenuItem({label: '帮助'}))
        // 窗口创建时绑定上下文菜单
        app.on('browser-window-created', function (event, win) {
            win.webContents.on('context-menu', function (e, params) {
                menu.popup(win, params.x, params.y)
            })
            context = win;
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


