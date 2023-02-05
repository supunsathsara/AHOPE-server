//id, name, service, short_desc, long_desc, main_image, status, slug, created_at, updated_at, created_by, updated_by
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
      'INSERT INTO `subservice`(name,service, short_desc, long_desc, status, created_at, created_by,slug, main_image) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        data.name,
        data.service,
        data.short_desc,
        data.long_desc,
        data.status,
        dateTime,
        data.authData.user,
        data.slug,
        data.main_image,
      ]
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
      `UPDATE subservice SET ${setString} , updated_at=${dateTime}, updated_by=${data.authData.id} WHERE id = ${id}`
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
    let result = await query('DELETE FROM `subservice` WHERE id = ?', [
      data.id,
    ]);

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
      `SELECT * FROM subservice WHERE status = ${data.status} ORDER BY ${sortBy} ${order} LIMIT ${offset}, ${limit}`
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
    let result = await query('SELECT * FROM `subservice` WHERE id = ?', [
      data.id,
    ]);

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

    let query = `SELECT * FROM subservice WHERE status = ${data.status}`;
    if (data.name) {
      query += ` AND name LIKE '%${data.name}%'`;
    }
    if (data.service) {
      query += ` AND service LIKE '%${data.service}%'`;
    }

    if (data.short_desc) {
      query += ` AND short_desc LIKE '%${data.short_desc}%'`;
    }
    if (data.long_desc) {
      query += ` AND long_desc LIKE '%${data.long_desc}%'`;
    }
    if (data.slug) {
      query += ` AND slug LIKE '%${data.slug}%'`;
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
    let result = await query(
      'SELECT id, name FROM `subservice` WHERE status = 1'
    );

    if (!result.status) {
      return response.error('0500');
    }

    return response.success('0200', result.data);
  } catch (err) {
    return response.error('0500');
  }
};
