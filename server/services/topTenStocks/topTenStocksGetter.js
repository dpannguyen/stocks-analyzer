var options = {
  method: 'GET',
  url: 'https://yahoo-finance-low-latency.p.rapidapi.com/ws/screeners/v1/finance/screener/predefined/saved',
  params: {
    scrIds: 'most_actives', 
    count: '10'
  },
  headers: {
    'x-rapidapi-key': '2d5d406ff9msh278fd839ab3d0d7p12c314jsn35eb5ce9c082',
    'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
  }
};

module.exports = {options};