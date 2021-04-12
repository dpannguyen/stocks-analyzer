var options = {
  method: 'GET',
  baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/v11/finance/quoteSummary/',
  url: '',
  params: {
    modules: 'price'
  },
  headers: {
    'x-rapidapi-key': '2d5d406ff9msh278fd839ab3d0d7p12c314jsn35eb5ce9c082',
    'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
  }
};

module.exports = { options };
