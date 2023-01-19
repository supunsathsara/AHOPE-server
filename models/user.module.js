const db = require('../config/db');

class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.status = data.status;
  }

  async save() {
    // save to database
    const [rows] = await db.execute(
      'insert into user (name, email, password,status) values (?, ?, ?,?);',
      [this.name, this.email, this.password, this.status]
    );
    this.id = rows.insertId;
    return this;
  }

  static findAll() {
    // return all users
    return db.execute('SELECT * FROM user WHERE status = 1;');
    //return db.execute('SELECT id,name,email FROM user WHERE status = 1;');
    //TODO: limit users filter,search
  }

  static findById(id) {
    // return user by id
    return db.execute('select * from user where id = ?;', [id]);
  }

  static async findByAuth(email) {
    return db.execute(`select * from user where email = '${email}';`);
  }

  static async updateById(id, body) {
    // return user by id
    // return db.execute('update user set ? where id = ?;', [body, id]);
    const setString = Object.keys(body)
      .map((key, index) => `${key} = '${body[key]}'`)
      .join(', ');
    await db.execute(`UPDATE user SET ${setString} WHERE id = ${id}`);
    //return updated data
    return db.execute(
      `select id,name,email,updated_at from user WHERE id = ${id}`
    );
  }

  static deleteById(id) {
    // return user by id
    // return db.execute('update user set ? where id = ?;', [body, id]);
    let response = db.execute(`UPDATE user SET status = 0 WHERE id = ${id}`);
    //return updated data
    return true;
  }
}

module.exports = User;
