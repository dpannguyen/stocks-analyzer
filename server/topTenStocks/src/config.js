const config = {
    yfinance: {
        baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/ws/screeners/v1/finance/screener/predefined/saved',
        key: '{apikey}',
        host: '{apihost}'
    },
    port: 3020,
    // gateway: 'http://4471-apigateway.azurewebsites.net',
    gateway: 'http://localhost:4444'
};

module.exports = config;