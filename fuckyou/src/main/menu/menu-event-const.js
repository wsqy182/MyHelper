/* eslint-disable */
/**
 * 菜单相关的事件频道常量.
 * 渲染层和主进程都要使用
 * @type {Electron}
 */
var channels = {
    refresh_: "menu_refresh_",
    copy_: "menu_copy_",
    paste_: "menu_paste_",
    delete_: "menu_delete_",
    find_: "menu_find_",
    send_: "menu_send_",
    help_: "menu_help_",
    delete_confirm_: "menu_delete_confirm"
}
export {channels}


