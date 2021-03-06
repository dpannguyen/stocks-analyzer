var options = {
  method: 'GET',
  url: 'https://yahoo-finance-low-latency.p.rapidapi.com/v1/finance/trending/US',
  headers: {
    'x-rapidapi-key': 'place your API key here',
    'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
  }
};

module.exports = {options};