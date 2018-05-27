'use strict'

/**
 * 使用该注释对没用到的组件不进行检查,否则对当前文件的修改不生效.
 */
/* eslint-disable */
import {app, BrowserWindow, globalShortcut, Menu, MenuItem} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`


import {MenuFunc} from './menu/menu-func'
import {Dao} from './db'

/**
 * 创建窗口
 */
function createWindow() {
    /**
     * 启动窗口的初始化选项
     */
    mainWindow = new BrowserWindow({
        show: true,
        autoHideMenuBar: true,
        height: 563,
        useContentSize: true,
        width: 1000,
        webPreferences: {
            devTools: true
        }
    })

    /**
     * 删除默认的菜单栏
     */
    mainWindow.setMenu(null)
    /**
     * 加载资源文件
     */
    mainWindow.loadURL(winURL)

    /**
     *
     */
    mainWindow.on('closed', () => {
        release_();
    })
    /**
     * web页面加载完毕
     * @type {Electron.WebContents}
     */
    let webContent = mainWindow.webContents;

    // 注册热键
    initHotKey();
    // 初始化菜单
    initMenu();

    // 资源加载完成,开始更新数据
    webContent.on("did-finish-load", () => {
        // 首次加载数据
        MenuFunc.refresh_();
    })

}

/**
 * 绑定快捷键
 */
function initHotKey() {
    globalShortcut.register('Ctrl+F', () => {
        MenuFunc.find_();
    })
}

const menu = new Menu()
/**
 * 初始化菜单
 */
function initMenu() {
    MenuFunc.setContext(mainWindow)
    menu.append(new MenuItem({label: '刷新', accelerator: "F5", click: MenuFunc.refresh_}))
    menu.append(new MenuItem({label: '复制', click: MenuFunc.copy_}))
    menu.append(new MenuItem({label: '粘贴', click: MenuFunc.paste_}))
    menu.append(new MenuItem({label: '删除', click: MenuFunc.delete_}))
    menu.append(new MenuItem({label: '寻找', accelerator: 'Ctrl+F', click: MenuFunc.find_}))
    menu.append(new MenuItem({label: '同步', click: MenuFunc.send_}))
    menu.append(new MenuItem({label: '帮助', click: MenuFunc.help_}))
    // 窗口创建时绑定上下文菜单
    mainWindow.webContents.on('context-menu', function (e, params) {
        menu.popup(mainWindow, params.x, params.y)
    })
}

/**
 * 释放相关的资源
 * @private
 */
function release_() {
    // 关闭数据库
    Dao.close();
    // 释放主窗口资源
    mainWindow = null
    console.log("closed")
}

/**
 * app 准备完毕创建窗口
 */
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
