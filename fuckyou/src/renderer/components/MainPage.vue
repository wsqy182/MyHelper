<template>
    <div>
        <el-table
                ref="main-table"
                :data="tableData"
                style="width: 100%"
                :border="true"
                :highlight-current-row="true"
                @current-change="change"
        >
            <el-table-column
                    prop="id"
                    label="命令"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="cmd"
                    label="命令"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="desc"
                    label="说明"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="mark"
                    label="描述">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    /**
     * 引入渲染器进程
     */
    const {ipcRenderer, clipboard} = require('electron');
    /**
     * 导入事件名变量
     */
    import {channels} from '../../main/menu/menu-event-const'

    /**
     * 多进程之间共享数据可以通过如下的全局变量进行注入.
     * 但是需要注意的是这里放进去的数据是字符串类型.
     * 也就是说跨进程通讯的数据共享的不可能是复杂类型
     * 因此只能通过另外的形式,比如在菜单刷新的时候发射一个事件,通知渲染进程进行处理.
     * 拿到数据后再转换为vue绑定的复杂类型
     * @type {Array|*|string}
     */
    // let dbData = require('electron').remote.getGlobal('sharedObject').dbData;
    export default {
        data() {
            return {
                tableData: [],
                current_row: null
            }
        },
        mounted() {
            /**
             * 主进程要求数据刷新
             */
            ipcRenderer.on(channels.refresh_, (event) => {
                this.refresh_();
            });
            /**
             * 主进程要求数据复制
             */
            ipcRenderer.on(channels.copy_, (event) => {
                this.copy_();
            });
            /**
             * 主进程要求数据粘贴
             */
            ipcRenderer.on(channels.paste_, (event) => {
                this.paste_();
            });
            /**
             * 主进程要求数据删除
             */
            ipcRenderer.on(channels.delete_, (event) => {
                this.delete_();
            });
            /**
             * 主进程要求打开查找窗口
             */
            ipcRenderer.on(channels.find_, (event) => {
                this.find_();
            });
            /**
             * 主进程要求同步数据
             */
            ipcRenderer.on(channels.send_, (event) => {
                this.send_();
            });
            /**
             * 主进程要求打开帮助窗口
             */
            ipcRenderer.on(channels.help_, (event) => {
                this.help_();
            });

        },
        methods: {
            /**
             * 从全局变量中取出变量强制刷新
             * @private
             */
            refresh_() {
                console.log("正在刷新数据")
                let dbData = require('electron').remote.getGlobal('sharedObject').dbData;
                if (dbData) {
                    this.tableData = dbData;
                }
            },
            /**
             * 复制当前webContent被选中的项目
             * @param current_index 现行选中项
             * @private
             */
            copy_() {
                console.log("copy ing", this.current_row)
                if (this.current_row) {
                    clipboard.writeText(this.current_row.cmd);
                }
            },
            /**
             * 当前行被改变
             * @param val
             */
            change(val) {
                this.current_row = val;
            },
            paste_: function () {

            },
            /**
             * 删除事件被触发
             * @private
             */
            delete_: function () {
                if (!this.current_row) {
                    return;
                }
                // 询问是否删除
                this.$alert('您确认要删除\ncmd:' + this.current_row.cmd + '\n这段内容么?', 'Info', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    // 发送同步消息,通知主进程确认删除某一项
                    let result = ipcRenderer.sendSync(channels.delete_confirm_, this.current_row.id)
                    if (result == true) {
                        console.log("删除成功");
                        this.refresh_();
                    } else {
                        console.log("删除失败!");
                    }
                });
            },
            find_: function () {

            },
            send_: function () {

            },
            help_: function () {

            },
        }
    }
</script>
<style>

</style>