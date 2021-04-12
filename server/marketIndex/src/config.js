const config = {
    yfinance: {
        baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/v11/finance/quoteSummary/',
        key: '2d5d406ff9msh278fd839ab3d0d7p12c314jsn35eb5ce9c082',
        host: 'yahoo-finance-low-latency.p.rapidapi.com'
    },
    port: 3010,
    // gateway: 'http://4471-apigateway.azurewebsites.net',
    gateway: 'http://localhost:4444'
};

module.exports = config;