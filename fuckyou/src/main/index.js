'use strict'

/**
 * 使用该注释对没用到的组件不进行检查,否则对当前文件的修改不生效.
 */
/* eslint-disable */
import {app, BrowserWindow} from 'electron'

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

    mainWindow.on('closed', () => {
        release_();
    })
    /**
     * web页面加载完毕
     * @type {Electron.WebContents}
     */
    let webContent = mainWindow.webContents;
    webContent.on("did-finish-load", () => {
        // 首次加载数据
        MenuFunc.refresh_();
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
