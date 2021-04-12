var options = {
  method: 'GET',
  url: 'https://financial-twitter-sentiment.p.rapidapi.com/api/fin-twitter/stocks/sentiment',
  params: { stocks: '$aapl,$tsla,$QBTC.U,$AMZN' },
  headers: {
    'x-rapidapi-key': 'f2b2894089mshd8a9ba67febdf74p14c035jsnebb83df78f7e',
    'x-rapidapi-host': 'financial-twitter-sentiment.p.rapidapi.com'
  }
};

module.exports = { options };

