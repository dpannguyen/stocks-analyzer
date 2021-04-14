const config = {
    twitter: {
        baseURL: 'https://financial-twitter-sentiment.p.rapidapi.com/api/fin-twitter/stocks/sentiment',
        key: '{apikey}',
        host: '{apihost}'
    },
    port: 3030,
    // gateway: 'http://4471-apigateway.azurewebsites.net',
    gateway: 'http://localhost:4444'
};

module.exports = config;