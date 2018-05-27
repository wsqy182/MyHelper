/**
 * Created by Administrator on 2016/5/11.
 */
/* eslint-disable */

var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var datasource = new sqlite3.Database(file);  //connect to our file/database

const table_name = "student"  //创建一张表，名字是student


/**
 * 设置共享内容
 * @type {{dbData: string}}
 */
global.sharedObject = {
    dbData: []
}

var Dao = {
    database: null,
    /**
     * 私有化方法,不建议外部继续调用
     * @private
     */
    _init_: function (db) {
        this.database = db;
        /**
         * 数据库初始化
         */
        this.database.serialize(() => {
            //serialize   call.
            //create a table student
            this.database.run("CREATE TABLE IF NOT EXISTS  " + table_name + "  (" +
                "id INTEGER PRIMARY KEY NOT NULL," +     //字段
                "cmd  TEXT    ," +                     //字段
                "desc   TEXT ," +                     //字段
                "mark   TEXT  " +                     //字段
                ") ");
        });
    },
    /**
     * 移除整张表
     * @param tableName
     */
    dropTable: function (tableName) {
        this.database.run("drop table " + tableName);
    },
    /**
     * 获取全部
     * @private
     */
    getAll: function () {
        return new Promise((resolve, reject) => {
            let sql = "select * from " + table_name;
            this.database.all(sql, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    },
    /**
     * 插入一条数据
     * @private
     */
    insert: function () {
        //数据库对象的run函数可以执行任何的SQL语句，该函数一般不用来执行查询
        var insert = this.database.prepare("INSERT OR REPLACE  INTO " + table_name + "(cmd,desc,mark) VALUES (?,?,?)"); //插入或者替换数据，
        for (var i = 0; i < 10; i++) {
            insert.run("cmd" + i, null, null);   //insert some data.
        }
        insert.finalize();     //operater finish
    },

    /**
     * 删除一条数据
     * @param id 欲删除的数据ID
     * @returns {Promise<any>} 删除成功
     */
    delete: function (id) {
        return new Promise((res, rej) => {
            if (!id || id <= 0) {
                rej(new Error("your input of number <=0"));
            }
            // 准备sql
            let sql = "delete from " + table_name + " where id=?";
            // 预处理sql
            let del = this.database.prepare(sql);
            // 设置参数
            del.run(id, function (err, result) {
                if (err) {
                    console.log(err);
                    rej(err)
                } else {
                    console.log("delete !")
                    // 提交
                    del.finalize();
                    res(result);
                }
            })
        })
    },

    /**
     * 修改一条数据：
     */
    update: function update_() {
        var modify = this.database.prepare("UPDATE " + table_name + " set name=? where sid =?")
        modify.run("bolin", 5)
        modify.finalize();
    },
    /**
     * 数据库遍历
     * @private
     */
    each: function () {
        // 数据库查询
        this.database.each("SELECT rowid AS id, sid,name FROM " + table_name + "", function (err, row) {
            console.log(row.id + ": " + row.sid + "  " + row.name);
        });
    },
    /**
     * 关闭数据库
     */
    close: function () {
        this.database.close();
    },
    /**
     * 查找数据库
     */
    find(cmd) {
        return new Promise((resolve, reject) => {
            if (!cmd) {
                reject(new Error("您不能输入无关的内容!"));
            }
            let sql = "select * from " + table_name + " where cmd like '%?%'";
            this.database.prepare(sql);
            this.database.run(cmd, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows);
                }
            })
        })
    }
}

/**
 * 初始化dao对象
 */
Dao._init_(datasource);
// Dao.insert();
// Dao.dropTable(table_name);
// Dao.delete(-1).then((res) => {
//     console.log("delete cg!");
// }).catch((err) => {
//     console.log("delete " + err);
// })
/**
 * 导出该对象模块
 */
export {Dao}