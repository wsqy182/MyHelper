/**
 * Created by Administrator on 2016/5/11.
 */

var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);  //connect to our file/database

var table_name="student"  //创建一张表，名字是student


db.serialize(function() {  //serialize   call.

    //creat a table student
    db.run("CREATE TABLE IF NOT EXISTS  "+table_name+"  (" +
        "sid  TEXT PRIMARY KEY NOT NULL," +     //字段
        "name  TEXT    ," +                     //字段
        "sex   INTEGER ," +                     //字段
        "age   INTEGER  " +                     //字段
        ") ");
//数据库对象的run函数可以执行任何的SQL语句，该函数一般不用来执行查询
    var insert = db.prepare("INSERT OR REPLACE  INTO "+table_name+"(sid,name) VALUES (?,?)"); //插入或者替换数据，
    for (var i = 0; i < 10; i++) {
        insert.run( i, "stu"+i);   //insert some data.
    }
    insert.finalize();     //operater finish

    //删除一条数据：
    var  del=db.prepare("DELETE from "+table_name+" where sid=?")
    del.run(4)
    del.finalize();


    //修改一条数据：
    var modify=db.prepare("UPDATE "+table_name+" set name=? where sid =?")
    modify.run("bolin",5)
    modify.finalize();


    //数据库查询
    db.each("SELECT rowid AS id, sid,name FROM "+table_name+"", function(err, row) {
        console.log(row.id + ": " + row.sid+"  "+row.name);
    });


});

export{}
/*
db.close(); //close

console.log("end")*/
