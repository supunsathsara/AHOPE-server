const db = require('../config/db');
/** fileds : id, country, name, status, added_by*/

let inputData = {
  State: [
    {
      name: {
        min: 3,
        max: 40,
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
        value: 'name' || 'country',
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
};

class State {
  constructor(data) {
    if (data.status === undefined) data.status = 1;
    this.name = data.name;
    this.country = data.country;
    this.added_by = data.added_by;
    this.status = data.status;
  }

  async save() {
    // save to database
    const [rows] = await db.execute(
      'insert into state (name, country, added_by,status) values (?, ?, ?,?);',
      [this.name, this.country, this.added_by, this.status]
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

    if (sortBy == 'name') sortBy = 'state.name';
    if (sortBy == 'country') sortBy = 'country.name';

    // return all countries
    // return db.execute(
    //   `SELECT * FROM state WHERE status = 1 ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`
    // );
    return db.execute(
      `SELECT state.id,state.name,country.name as country,country.code as country_code,country.currency,country.currency_symbol,country.time_zone FROM state inner join country on country.id=state.country WHERE state.status=1 ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`
    );
  }

  static findById(id) {
    // return country by id
    return db.execute('select * from state where id = ?;', [id]);
  }

  static async updateById(id, body) {
    const setString = Object.keys(body)
      .map((key, index) => `${key} = '${body[key]}'`)
      .join(', ');
    await db.execute(`UPDATE state SET ${setString} WHERE id = ${id}`);
    //return updated data
    return db.execute(`select id,name,country from state WHERE id = ${id}`);
  }

  static async deleteById(id) {
    try {
      // Begin transaction
      await db.beginTransaction();
      await db.execute(`UPDATE state SET status = 0 WHERE id = ${id}`);

      await db.execute(`UPDATE town SET status = 0 WHERE state = ${id}`);

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

    if (sortBy == 'name') sortBy = 'state.name';
    if (sortBy == 'country') sortBy = 'country.name';

    let query =
      'SELECT state.id,state.name,country.name as country FROM state inner join country on country.id=state.country WHERE 1=1 ';

    if (data.name) {
      query += `AND state.name like '%${data.name}%'`;
    }
    if (data.country) {
      query += `AND country.name like '%${data.country}%'`;
    }
    if (data.status) {
      query += `AND state.status = ${data.status}`;
    }
    query += ` ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`;
    return db.execute(query);
  }

  static async select() {
    try {
      return db.execute(`select id,name from state`);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = State;
