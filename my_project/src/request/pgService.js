// 引入连接pg库的代码
const pg = require("pg");
const pool = new pg.Pool({
  host: "localhost",
  user: "postgres",
  password: "qqq",
  database: "postgres",
});
// 创建一些数据库的语法(类的方法)
class Service {
  constructor() { }
  select(sql, values, callback) {
    pool.connect((error, connection) => {
      if (error) {
        callback(error, null);
        return;
      }
      connection.query(sql, values, (err, result) => {
        callback(err, result);
        connection.release(); // 释放连接
      });
    });
  }
  insert(sql, values, callback) {
    pool.connect((error, connection) => {
      if (error) {
        callback(error, null);
        return;
      }
      connection.query(sql, values,(error, result) => {
        callback(error, result);
        connection.release();
      });
    });
  }
  delete(sql, values, callback) {
    pool.connect((error,  connection) => {
      if (error) {
        callback(error, null);
        return;
      }
      connection.query(sql, values,(error, result) => {
        callback(error, result);
        connection.release();
      });
    });
  }
  update(sql, values, callback) {
    pool.connect((error, connection) => {
      if (error) {
        callback(error, null);
        return;
      }
      connection.query(sql, values, (error, result) => {
        callback(error, result);
        connection.release();
      });
    });
  }
}
module.exports = Service;