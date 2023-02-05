const db = require('../config/db');
const crypto = require('crypto');
const { required } = require('joi');
const { hashPassword, comparePass } = require('../helper/password.helper');

let inputData = {
  User: [
    {
      name: {
        min: 3,
        max: 40,
        required: true,
      },
      email: {
        min: 7,
        max: 10,
        required: true,
      },
      password: {
        min: 8,
        max: 25,
        required: true,
      },
      status: {
        value: 1 || 0 || 2,
        required: false,
      },
    },
  ],
  findAll: [
    {
      page: {
        min: 1,
        required: false,
      },
      sortBy: {
        value: 'name' || 'email',
        required: false,
      },
      order: {
        value: 1 || 0,
        required: false,
      },
    },
  ],
  updateById: [
    {
      id: {
        min: 1,
        required: true,
      },
      name: {
        min: 3,
        max: 40,
        required: false,
      },
      email: {
        min: 7,
        max: 40,
        required: false,
      },
      status: {
        value: 1 || 0 || 2,
        required: false,
      },
    },
  ],
  deleteById: [
    {
      id: {
        min: 1,
        required: true,
      },
    },
  ],
  search: [
    {
      page: {
        min: 1,
        required: false,
      },
      sortBy: {
        value: 'name' || 'email',
        required: false,
      },
      order: {
        value: 1 || 0,
        required: false,
      },
      search: {
        min: 3,
        max: 40,
        required: true,
      },
    },
  ],
  forgetPassword: [
    {
      email: {
        min: 7,
        max: 40,
        required: true,
      },
    },
  ],
  resetPassword: [
    {
      token: {
        min: 18,
        max: 22,
        required: true,
      },
      newPassword: {
        min: 8,
        max: 25,
        required: true,
      },
    },
  ],
  changePassword: [
    {
      id: {
        min: 1,
        required: true,
      },
      oldPassword: {
        min: 8,
        max: 25,
        required: true,
      },
      newPassword: {
        min: 8,
        max: 25,
        required: true,
      },
    },
  ],
  changeEmail: [
    {
      id: {
        min: 1,
        required: true,
      },
      email: {
        min: 7,
        max: 40,
        required: true,
      },
    },
  ],
  confirmEmail: [
    {
      token: {
        min: 18,
        max: 22,
        required: true,
      },
      email: {
        min: 7,
        max: 40,
        required: true,
      },
    },
  ],
};

class User {
  constructor(data) {
    if (data?.status === undefined) data.status = 1;
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

  static async findAll(data) {
    const page = data.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let sortBy = data.query.sortBy || 'name';
    //let order = data.query.order || 'ASC';
    let order =
      data.query.order === undefined
        ? 'ASC'
        : data.query.order === 1
        ? 'ASC'
        : 'DESC';
    const rows = await db.execute(
      `SELECT * FROM user WHERE status = 1 ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit}`
    );

    return rows;
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

  static async deleteById(id) {
    try {
      // Begin transaction
      await db.beginTransaction();
      // Update state status to 0 where country_id = id
      await db.execute(`UPDATE user SET status = 0 WHERE id = ${id}`);

      // Update town status to 0 where country_id = id
      await db.execute(`UPDATE client SET status = 0 WHERE uid = ${id}`);

      // Commit transaction
      await db.commit();

      return true;
    } catch (err) {
      // Rollback transaction if there is an error
      await db.rollback();
      throw err;
    }
  }

  static async search(data) {
    try {
      const page = data.page || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      let sortBy = data.sortby || 'name';
      let order =
        data.query.order === undefined
          ? 'ASC'
          : data.query.order === 1
          ? 'ASC'
          : 'DESC';

      let query = 'SELECT * FROM user WHERE ';
      let queryParams = [];

      if (data.status) {
        query += 'status = ? AND ';
        queryParams.push(data.status + '%');
      }

      if (data.name) {
        query += 'name LIKE ? AND ';
        queryParams.push(data.name + '%');
      }
      if (data.email) {
        query += 'email LIKE ? AND ';
        queryParams.push(data.email + '%');
      }
      query = query.slice(0, -4);
      return db.execute(
        `${query} ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`,
        queryParams
      );
    } catch (err) {
      next(err);
    }
  }

  static async select() {
    try {
      return db.execute('SELECT id,name FROM user');
    } catch (err) {
      next(err);
    }
  }

  static async forgetPassword(email) {
    const token = crypto.randomBytes(20).toString('hex');
    await db.execute(
      'UPDATE user SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?',
      [token, Date.now() + 3600000, email]
    );
    // Send an email to the user with the password reset link
    const mailOptions = {
      from: 'AHOPE@mail.com',
      to: email,
      subject: 'Password reset',
      text:
        'You are receiving this because you have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        `http://localhost:3000/reset/${token}\n\n` +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    };
    //! SEND MAIL
  }

  async resetPassword(token, newPassword) {
    // Check if the token is valid
    const result = await db.execute(
      'SELECT * FROM user WHERE reset_password_token = ? AND reset_password_expires > ?',
      [token, Date.now()]
    );
    if (!result[0]) {
      return { error: 'Invalid token' };
    }
    // Update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute(
      'UPDATE user SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?',
      [hashedPassword, result[0].email]
    );
    return { success: 'Password reset successful' };
  }

  static async changePassword(id, oldPassword, newPassword) {
    //compare the password
    const result = await db.execute('SELECT * FROM user WHERE id = ?', [id]);
    const isMatch = await bcrypt.compare(oldPassword, result[0].password);
    if (!isMatch) {
      return { error: 'Invalid password' };
    }
    // Update the password
    const hashedPassword = await bcrypt.hash(newPassword, 13);
    await db.execute('UPDATE user SET password = ? WHERE id = ?', [
      hashedPassword,
      id,
    ]);
    return { success: 'Password changed successfully' };
  }

  static async changeEmail(data) {
    const result = await db.execute('SELECT * FROM user WHERE id = ?', [
      data.id,
    ]);
    //send a new email a confirmation mail with a token
    const token = crypto.randomBytes(20).toString('hex');
    await db.execute(
      'UPDATE user SET change_email_token = ?, change_email_expires = ? WHERE id = ?',
      [token, Date.now() + 3600000, data.id]
    );
    //! Send an email to the user with the password reset link
  }

  static async confirmEmail(data) {
    // Check if the token is valid
    const result = await db.execute(
      'SELECT * FROM user WHERE change_email_token = ? AND change_email_expires > ?',
      [data.token, Date.now()]
    );
    if (!result[0]) {
      return { error: 'Invalid token' };
    }
    // Update the email
    await db.execute(
      'UPDATE user SET email = ?, change_email_token = NULL, change_email_expires = NULL WHERE id = ?',
      [data.email, data.id]
    );
    return { success: 'Email changed successfully' };
  }
}
module.exports = User;
