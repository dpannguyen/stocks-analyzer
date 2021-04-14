const config = {
    yfinance: {
        baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/v11/finance/quoteSummary/',
        key: '{apikey}',
        host: '{apihost}'
    },
    port: 3010,
    // gateway: 'http://4471-apigateway.azurewebsites.net',
    gateway: 'http://localhost:4444'
};

module.exports = config;