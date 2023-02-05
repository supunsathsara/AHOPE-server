//id, name, created_at, updated_at, created_by, updated_by, status
//id, subservice, name, status, marked_price, selling_price, created_at, updated_at, created_by, updated_by
const query = require('../helper/query');
const response = require('../helper/response');
const luxon = require('luxon');

exports.add = async (data) => {
  try {
    if (data.status === undefined) data.status = 1;

    const dateTime = luxon.DateTime.now()
      .setZone('UTC')
      .toFormat('y-MM-dd HH:mm:ss');

    let result = await query(
      'INSERT INTO `tag`(name, status, created_at, created_by) VALUES (?,?,?,?)',
      [data.name, data.status, dateTime, data.authData.user]
    );

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200');
  } catch (err) {
    return response.error('0500');
  }
};

exports.update = async (id, data) => {
  try {
    const dateTime = luxon.DateTime.now()
      .setZone('UTC')
      .toFormat('y-MM-dd HH:mm:ss');
    const setString = Object.keys(data)
      .map((key, index) => `${key} = '${data[key]}'`)
      .join(', ');
    let result = await query(
      `UPDATE tag SET ${setString} , updated_at=${dateTime}, updated_by=${data.authData.id} WHERE id = ${id}`
    );

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200');
  } catch (err) {
    return response.error('0500');
  }
};

exports.delete = async (data) => {
  try {
    let result = await query('DELETE FROM `tag` WHERE id = ?', [data.id]);

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200');
  } catch (err) {
    return response.error('0500');
  }
};

exports.getAll = async (data) => {
  try {
    if (data.status === undefined) data.status = 1;
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
    let result = await query(
      `SELECT * FROM tag WHERE status = ${data.status} ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit}`
    );

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200', result.data);
  } catch (err) {
    return response.error('0500');
  }
};

exports.getByID = async (data) => {
  try {
    let result = await query('SELECT * FROM `tag` WHERE id = ?', [data.id]);

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200', result.data);
  } catch (err) {
    return response.error('0500');
  }
};

exports.search = async (data) => {
  try {
    if (data.status === undefined) data.status = 1;
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

    let query = `SELECT * FROM tag WHERE status = ${data.status}`;
    if (data.name) {
      query += ` AND name LIKE '%${data.name}%'`;
    }
    query += ` ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit}`;
    let result = await query(
      `${query} ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit};`
    );

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200', result.data);
  } catch (err) {
    return response.error('0500');
  }
};

exports.select = async () => {
  try {
    let result = await query('SELECT id, name FROM `tag` WHERE status = 1');

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200', result.data);
  } catch (err) {
    return response.error('0500');
  }
};
