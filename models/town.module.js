const db = require('../config/db');

/**fields: id,name, postal_code, status, state, country, added_by */

let inputData = {
  Town: [
    {
      name: {
        min: 3,
        max: 40,
        required: true,
      },
      postal_code: {
        min: 3,
        max: 40,
        required: true,
      },
      state: {
        min: 1,
        required: true,
      },
      country: {
        min: 1,
        required: true,
      },
      added_by: {
        min: 1,
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
        value: 'name' || 'postal_code' || 'state' || 'country',
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
      postal_code: {
        min: 3,
        max: 40,
        required: false,
      },
      state: {
        min: 1,
        required: false,
      },
      country: {
        min: 1,
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
  findById: [
    {
      id: {
        min: 1,
        required: true,
      },
    },
  ],
};

class Town {
  constructor(data) {
    if (data.status === undefined) data.status = 1;
    this.name = data.name;
    this.postal_code = data.postal_code;
    this.state = data.state;
    this.country = data.country;
    this.added_by = data.added_by;
    this.status = data.status;
  }

  async save() {
    const [rows] = await db.execute(
      'insert into town (name, postal_code, state, country, added_by,status) values (?, ?, ?,?,?,?);',
      [
        this.name,
        this.postal_code,
        this.state,
        this.country,
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

    if (sortBy == 'name') sortBy = 'town.name';
    if (sortBy == 'postal_code') sortBy = 'town.postal_code';
    if (sortBy == 'state') sortBy = 'state.name';
    if (sortBy == 'country') sortBy = 'country.name';
    // return all countries
    return db.execute(
      `SELECT town.name,town.postal_code, state.name as state, country.name as country,country.code as country_code,country.currency,country.currency_symbol,country.time_zone FROM town INNER JOIN state ON state.id = town.state INNER JOIN country ON country.id = town.country WHERE town.status = 1 ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`
    );
  }

  static findById(id) {
    // return country by id
    return db.execute('select * from town where id = ?;', [id]);
  }

  static async updateById(id, body) {
    const setString = Object.keys(body)
      .map((key, index) => `${key} = '${body[key]}'`)
      .join(', ');
    await db.execute(`UPDATE town SET ${setString} WHERE id = ${id}`);
    //return updated data
    return db.execute(
      `select id,name,postal_code,state,country from town WHERE id = ${id}`
    );
  }

  static deleteById(id) {
    let response = db.execute(`UPDATE town SET status = 0 WHERE id = ${id}`);
    return true;
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

    if (sortBy == 'name') sortBy = 'town.name';
    if (sortBy == 'postal_code') sortBy = 'town.postal_code';
    if (sortBy == 'state') sortBy = 'state.name';
    if (sortBy == 'country') sortBy = 'country.name';

    let query =
      'SELECT town.name,town.postal_code, state.name as state, country.name as country FROM town INNER JOIN state ON state.id = town.state INNER JOIN country ON country.id = town.country WHERE 1=1 ';
    if (data.status) {
      query += `AND town.status = ${data.status}`;
    }
    if (data.name) {
      query += `AND town.name like '%${data.name}%'`;
    }
    if (data.postal_code) {
      query += `AND town.postal_code like '%${data.postal_code}%'`;
    }
    if (data.state) {
      query += `AND state.name like '%${data.state}%'`;
    }
    if (data.country) {
      query += `AND country.name like '%${data.country}%'`;
    }

    query += ` ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`;
    return db.execute(query);
  }

  static async select() {
    try {
      return await db.execute('SELECT id, name FROM town ');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Town;
