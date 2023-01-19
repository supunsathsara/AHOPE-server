//import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');

exports.hashPassword = async function (password) {
  const hash = await bcrypt.hash(password, 13);
  return hash;
};

exports.comparePass = async function (password, password_hash) {
  const match = await bcrypt.compare(password, password_hash);
  return match;
};
