<template>
    <div>
        <el-table
                :data="tableData"
                style="width: 100%"
                :border="true"
                :highlight-current-row="true"
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
    const {ipcRenderer} = require('electron');
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
                tableData: []
            }
        },
        mounted() {
            ipcRenderer.on("data-refresh", (event) => {
                console.log("me" +
                    "ssage is dd")
                this.refresh_();
            });
        },
        methods: {
            /**
             * 刷新
             * @private
             */
            refresh_() {
                let dbData = require('electron').remote.getGlobal('sharedObject').dbData;
                if (dbData) {
                    this.tableData = dbData;
                }
            }
        }
    }
</script>
<style>

</style>