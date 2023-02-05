const mysql = require('mysql2');

require('dotenv').config();

const query = async (sql, params) => {
  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    dateStrings: true,
  });

  /**
   * @detail
   * sql    (String)  "SELECT column FROM table WHERE column = ? && column = ?"
   * params (Array)   [ value1, value2 ]
   */
  let a = new Promise((resolve) => {
    conn.execute(sql, params, function (err, results) {
      if (err) {
        resolve({
          status: false,
          errno: err.errno,
          err: err,
        });
      } else {
        resolve({
          status: true,
          data: results,
        });
      }
    });
  });
  conn.end();
  let result = await a;
  return result;
};

module.exports = query;
