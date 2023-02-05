const db = require('../config/db');
const axios = require('axios');

let inputData = {
  Country: [
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
      time_zone: {
        min: 3,
        max: 40,
        required: true,
      },
      currency: {
        min: 3,
        max: 40,
        required: true,
      },
      currency_symbol: {
        min: 1,
        max: 5,
        required: true,
      },
      added_by: {
        min: 1,
        required: true,
      },
      status: {
        value: 1 || 0,
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
      time_zone: {
        min: 3,
        max: 40,
        required: false,
      },
      currency: {
        min: 3,
        max: 40,
        required: false,
      },
      currency_symbol: {
        min: 1,
        max: 5,
        required: false,
      },
      added_by: {
        min: 1,
        required: false,
      },
      status: {
        value: 1 || 0,
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
        min: 3,
        max: 40,
        required: true,
      },
      page: {
        min: 1,
        required: false,
      },
      order: {
        value: 1 || 0,
        required: false,
      },
      status: {
        value: 1 || 0 || 2,
        required: false,
      },
      code: {
        min: 2,
        max: 4,
        required: false,
      },
      time_zone: {
        min: 3,
        max: 40,
        required: false,
      },
      currency: {
        min: 3,
        max: 40,
        required: false,
      },
      currency_symbol: {
        min: 1,
        max: 5,
        required: false,
      },
    },
  ],
};

class Country {
  constructor(data) {
    if (data.status === undefined) data.status = 1;
    this.name = data.name;
    this.code = data.code;
    this.time_zone = data.time_zone;
    this.currency = data.currency;
    this.currency_symbol = data.currency_symbol;
    this.added_by = data.added_by;
    this.status = data.status;
  }

  async save() {
    // save to database
    const [rows] = await db.execute(
      'insert into country (name, code, time_zone,currency,currency_symbol,added_by,status) values (?, ?, ?,?,?,?,?);',
      [
        this.name,
        this.code,
        this.time_zone,
        this.currency,
        this.currency_symbol,
        this.added_by,
        this.status,
      ]
    );
    this.id = rows.insertId;
    return this;
  }

  static findAll(data) {
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
    // return all countries
    return db.execute(
      `SELECT * FROM country WHERE status = 1 ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`
    );
  }

  static findById(id) {
    // return country by id
    return db.execute('select * from country where id = ?;', [id]);
  }

  static async updateById(id, body) {
    const setString = Object.keys(body)
      .map((key, index) => `${key} = '${body[key]}'`)
      .join(', ');
    await db.execute(`UPDATE country SET ${setString} WHERE id = ${id}`);
    //return updated data
    return db.execute(
      `select id,name,code,time_zone,currency,currency_symbol from country WHERE id = ${id}`
    );
  }

  static async deleteById(id) {
    try {
      // Begin transaction
      await db.beginTransaction();
      // Update country status to 0
      await db.execute(`UPDATE country SET status = 0 WHERE id = ${id}`);

      // Update state status to 0 where country_id = id
      await db.execute(`UPDATE state SET status = 0 WHERE country = ${id}`);

      // Update town status to 0 where country_id = id
      await db.execute(`UPDATE town SET status = 0 WHERE country = ${id}`);

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

    let query = `SELECT * FROM country WHERE `;
    let queryParams = [];
    if (data.status) {
      query += 'status = ? AND ';
      queryParams.push(data.status + '%');
    }
    if (data.name) {
      query += 'name LIKE ? AND ';
      queryParams.push(data.name + '%');
    }
    if (data.code) {
      query += 'code LIKE ? AND ';
      queryParams.push(data.code + '%');
    }
    if (data.time_zone) {
      query += 'time_zone LIKE ? AND ';
      queryParams.push(data.time_zone + '%');
    }
    if (data.currency) {
      query += 'currency LIKE ? AND ';
      queryParams.push(data.currency + '%');
    }
    if (data.currency_symbol) {
      query += 'currency_symbol LIKE ? AND ';
      queryParams.push(data.currency_symbol + '%');
    }
    query = query.slice(0, -4);
    return db.execute(
      `${query} ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`,
      queryParams
    );
  }

  static async getCountryList(data) {
    const order = data.orderby || 'asc';
    const url = 'https://restcountries.com/v2/all?fields=name';
    const response = await axios.get(url);
    data = response.data.map((country) => {
      country.name;
    });
    if (order === 'desc') {
      data.sort((a, b) => b.localeCompare(a));
    } else {
      data.sort();
    }
    return data;
  }

  static async select() {
    return db.execute(`SELECT id,name FROM country;`);
  }
}

module.exports = Country;
