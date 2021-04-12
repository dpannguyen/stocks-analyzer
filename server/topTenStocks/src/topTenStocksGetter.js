const config = require('./config');

var options = {
  method: 'GET',
  url: config.yfinance.baseURL,
  params: {
    scrIds: 'most_actives',
    count: '10'
  },
  headers: {
    'x-rapidapi-key': config.yfinance.key,
    'x-rapidapi-host': config.yfinance.host
  }
};

module.exports = { options };
