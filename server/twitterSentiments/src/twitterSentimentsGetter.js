const config = require('./config');

var options = {
  method: 'GET',
  url: config.twitter.baseURL,
  params: { stocks: '$aapl,$tsla,$QBTC.U,$AMZN' },
  headers: {
    'x-rapidapi-key': config.twitter.key,
    'x-rapidapi-host': config.twitter.host
  }
};

module.exports = { options };

