/* eslint-disable */
import {channels} from "./event-const";
import {Dao} from "../db";

const electron = require('electron')
const app = electron.app
const ipc = electron.ipcMain
const globalShortcut = electron.globalShortcut


// 绑定一些普通事件
function __bind_event__() {
    // 主进程监听搜索事件
    ipc.on(channels.search_, (event, arg) => {
        // 查找数据
        Dao.find(arg).then(res => {
            setVueData(res);
            event.returnValue = res.length;
        }).catch(err => {
            event.returnValue = -1;
        })
    });

    // 主进程监听确认删除事件
    ipc.on(channels.delete_confirm_, (event, arg) => {
        // 删除数据
        Dao.delete(arg).then(res => {
                // 读取最新的数据
                Dao.getAll().then(res => {
                    // 刷新数据
                    setVueData(res)
                    event.returnValue = true
                }).catch(res => {
                    event.returnValue = false
                })
            }
        ).catch(err => {
            event.returnValue = false
        });
    })
}


/**
 * 重置当前缓存的数据
 */
function setVueData(dbData) {
    global.sharedObject.dbData = dbData
}

/**
 * 绑定事件
 */
__bind_event__();
// 导出
export {setVueData}