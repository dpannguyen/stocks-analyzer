const config = require('./config');

var options = {
  method: 'GET',
  baseURL: config.yfinance.baseURL,
  url: '',
  params: {
    modules: 'price'
  },
  headers: {
    'x-rapidapi-key': config.yfinance.key,
    'x-rapidapi-host': config.yfinance.host
  }
};

module.exports = { options };
