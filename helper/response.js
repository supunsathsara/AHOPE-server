const response = require('../json/response.json'); // All error codes defined here

const error = (code, msg = '') => {
  if (code == '0000') {
    return {
      status: false,
      code: '0000',
      message: msg,
    };
  }

  return {
    status: false,
    code: code,
    message: response[code],
  };
};

const success = (code = '200', data = '', msg = '') => {
  const res = {};
  res.status = true;
  res.code = code;
  if (msg == '') {
    res.message = response[code];
  } else {
    res.message = msg;
  }
  if (data !== '') {
    res.data = data;
  }
  return res;
};

module.exports = {
  error,
  success,
};
