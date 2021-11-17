'use strict';

const axios = require('axios').default;

const zap = async (task) => {
  const { data } = await axios.post(process.env.ZAP_URL, { task });
  return data;
};

module.exports.log = async (event) => {
  const data = JSON.parse(event.body);
  const task = data.task || 'Pending...';
  const result = await zap(task);

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
  };
};
