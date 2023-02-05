const db = require('../config/db');
const User = require('./user.module');

let inputData = {
  Client: [
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
      mobile: {
        min: 10,
        max: 10,
        required: false,
      },
      gender: {
        value: 'male' || 'female' || 'other',
        required: false,
      },
      birthdate: {
        required: false,
      },
      address: {
        town: {
          min: 3,
          max: 40,
          required: false,
        },
        state: {
          min: 3,
          max: 40,
          required: false,
        },
        country: {
          min: 3,
          max: 40,
          required: false,
        },
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
      status: {
        value: 1 || 0 || 2,
        required: false,
      },
      mobile: {
        min: 10,
        max: 10,
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
      name: {
        min: 1,
        max: 40,
        required: false,
      },
      email: {
        min: 1,
        max: 40,
        required: false,
      },
      status: {
        value: 1 || 0 || 2,
        required: false,
      },
      mobile: {
        min: 10,
        max: 10,
        required: false,
      },
    },
  ],
};

class Client extends User {
  constructor(data) {
    super(data);
    this.mobile = data.mobile;
    this.gender = data.gender;
    this.birthdate = data.birthdate;
    this.address = data.address;
    this.reqBy = data.authData.user;
  }

  async save() {
    // save user data
    const user = await super.save();
    // save client data
    const [rows] = await db.execute(
      'insert into client (UID,mobile,gender,birthdate,town,state,country,created_by) values (?, ?, ?, ?, ?, ?, ?, ?);',
      [
        user.id,
        this.mobile,
        this.gender,
        this.birthdate,
        this.address.town,
        this.address.state,
        this.address.country,
        this.reqBy,
      ]
    );
    this.id = rows.insertId;
    return this;
  }

  static async findAll(req) {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    let sortBy = req.query.sortBy || 'name';
    let order =
      data.query.order === undefined
        ? 'ASC'
        : data.query.order === 1
        ? 'ASC'
        : 'DESC';

    if (sortBy == 'name') sortBy = 'user.name';
    if (sortBy == 'email') sortBy = 'user.email';

    const [rows, _] = await db.execute(
      `SELECT client.*, user.email, user.name, user.password FROM client INNER JOIN user ON client.uid = user.id WHERE user.status = 1 ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit}`
    );
    return rows;
  }

  static async findById(id) {
    // return client by id
    const [client] = await db.execute(
      `SELECT client.*, user.email, user.name, user.password FROM client INNER JOIN user ON client.uid = user.id WHERE id = ${id}`
    );
    return client;
    //const [user] = await User.findById(id);
    //return { ...client, ...user };
  }

  static async updateById(id, body) {
    const client = await Client.findById(id);
    const uid = client.uid;
    // update user data
    await User.updateById(uid, body);
    // update client data
    const setString = Object.keys(body)
      .map((key, index) => `${key} = '${body[key]}'`)
      .join(', ');
    await db.execute(`UPDATE client SET ${setString} WHERE uid = ${uid}`);
    //return updated data
    return db.execute(
      `SELECT client.*, user.email, user.name, user.password FROM client INNER JOIN user ON client.uid = user.id WHERE user.id = ${uid}`
    );
  }

  static async deleteById(id) {
    try {
      await db.beginTransaction();

      await db.execute(`UPDATE client SET status = 0 WHERE id = ${id}`);

      await db.commit();

      return true;
    } catch (err) {
      // Rollback transaction if there is an error
      await db.rollback();
      throw err;
    }
  }

  static async search(req) {
    try {
      const page = req.page || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      let sortBy = req.sortby || 'name';
      let order =
        data.query.order === undefined
          ? 'ASC'
          : data.query.order === 1
          ? 'ASC'
          : 'DESC';

      if (sortBy == 'name') sortBy = 'user.name';
      if (sortBy == 'email') sortBy = 'user.email';

      let query =
        'SELECT client.*,user.name,user.email FROM client inner join user on user.id=client.uid WHERE ';
      let queryParams = [];

      if (req.status) {
        query += 'user.status = ? AND ';
        queryParams.push(req.status + '%');
      }
      if (req.name) {
        query += 'user.name LIKE ? AND ';
        queryParams.push('%' + req.name + '%');
      }
      if (req.email) {
        query += 'user.email LIKE ? AND ';
        queryParams.push(req.email + '%');
      }
      if (req.mobile) {
        query += 'client.mobile LIKE ? AND ';
        queryParams.push(req.mobile + '%');
      }
      if (req.gender) {
        query += 'client.gender LIKE ? AND ';
        queryParams.push(req.gender + '%');
      }
      if (req.birthdate) {
        query += 'client.birthdate LIKE ? AND ';
        queryParams.push(req.birthdate + '%');
      }
      if (req.town) {
        query += 'client.town LIKE ? AND ';
        queryParams.push(req.town + '%');
      }
      if (req.state) {
        query += 'client.state LIKE ? AND ';
        queryParams.push(req.state + '%');
      }
      if (req.country) {
        query += 'client.country LIKE ? AND ';
        queryParams.push(req.country + '%');
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
    return await db.execute(
      'SELECT client.id,user.name FROM client inner join user on user.id=client.uid'
    );
  }
}

module.exports = Client;
