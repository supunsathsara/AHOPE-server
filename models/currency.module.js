const db = require('../config/db');
const fs = require('fs');

let inputData = {
  Currency: [
    {
      name: {
        min: 3,
        max: 40,
        required: true,
      },
      code: {
        min: 2,
        max: 4,
        required: true,
      },
      symbol: {
        min: 1,
        max: 5,
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
        value: 'name' || 'code',
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
      code: {
        min: 2,
        max: 4,
        required: false,
      },
      symbol: {
        min: 1,
        max: 5,
        required: false,
      },
      status: {
        value: 1 || 0 || 2,
        required: false,
      },
    },
  ],
};

class Currency {
  constructor(data) {
    this.name = data.name;
    this.code = data.code;
    this.symbol = data.symbol;
    this.status = data.status;
  }

  async save() {
    // save to database
    const [rows] = await db.execute(
      'insert into currency (name, code, symbol, status) values (?, ?, ?, ?);',
      [this.name, this.code, this.symbol, this.status]
    );
    this.id = rows.insertId;
    return this;
  }

  static async findAll(data) {
    const page = data.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let sortBy = data.sortBy || 'name';
    let order =
      data.query.order === undefined
        ? 'ASC'
        : data.query.order === 1
        ? 'ASC'
        : 'DESC';
    const rows = await db.execute(
      `SELECT * FROM currency WHERE status = 1 ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit}`
    );

    return rows;
  }

  static findById(id) {
    // return currency by id
    return db.execute('select * from currency where id = ?;', [id]);
  }

  static async updateById(id, body) {
    const setString = Object.keys(body)
      .map((key, index) => `${key} = '${body[key]}'`)
      .join(', ');
    await db.execute(`UPDATE currency SET ${setString} WHERE id = ${id}`);
    //return updated data
    return db.execute(
      `select id,name,code,symbol from currency WHERE id = ${id}`
    );
  }

  static async deleteById(id) {
    const [rows] = await db.execute(
      `UPDATE currency SET status = 0 WHERE id = ${id}`
    );
    return rows;
  }

  static async search(data) {
    const page = data.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = data.search;
    const rows = await db.execute(
      `SELECT * FROM currency WHERE status = 1 AND name LIKE '%${search}%' ORDER BY name ASC LIMIT ${offset}, ${limit}`
    );
    return rows;
  }

  static async select() {
    const rows = await db.execute(
      `SELECT id,name FROM currency WHERE status = 1`
    );
    return rows;
  }

  static async getAll() {
    try {
      const data = await fs.promises.readFile(
        path.join(__dirname, 'json/currencies.json'),
        'utf8'
      );
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Currency;
