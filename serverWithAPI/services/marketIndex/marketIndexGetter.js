var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://yahoo-finance-low-latency.p.rapidapi.com/v11/finance/quoteSummary/AAPL',
  params: {modules: 'defaultKeyStatistics,assetProfile'},
  headers: {
    'x-rapidapi-key': 'place your api key here',
    'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
  }
};
module.exports = {options};
