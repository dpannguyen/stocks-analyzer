const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

var axios = require("axios").default;
const dataGetter = require('./topTenStocksGetter');
const gateway = config.gateway;


// ignore request for FavIcon. so there is no error in browser
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
    }
    next();
};

async function getActiveList() {
    const response = await axios.request(dataGetter.options);
    var activeList = response.data.finance.result[0].quotes;
    var results = [];
    for (let index in activeList) { // values will need to be formatted
        let stock = activeList[index];
        let symbol = stock.symbol;
        let name = stock.shortName;
        let price = stock.regularMarketPrice;
        let change = stock.regularMarketChange;
        let changePer = stock.regularMarketChangePercent;
        let volume = stock.regularMarketVolume;
        let marketCap = stock.marketCap;
        let peRatio = (!!stock.trailingPE) ? stock.trailingPE : "---";
        results.push({
            "symbol": symbol, "name": name, "price": price, "change": change,
            "changePer": changePer, "volume": volume, "marketCap": marketCap, "peRatio": peRatio
        });
    }
    return results;
};

// fn to create express server
const create = async () => {

    // register service
    (async () => {
        const results = await getActiveList();
        try {
            var config = {
                method: 'post',
                baseURL: gateway,
                url: '/AddService',
                data: {
                    serviceId: 2,
                    serviceName: 'Top Ten Stocks',
                    serviceData: results
                }
            };
            await axios.request(config);
        } catch (e) {
            console.log("Couldn't register service.")
        }
    })();

    // server
    const app = express();
    // configure nonFeature
    app.use(ignoreFavicon);
    app.use(bodyParser.json());

    // root route
    app.get('/', (req, res) => {
        res.status(200).send("Top Ten Stocks Service");
    });

    // route to manually get and update service data from yfinance api
    // send data to api gateway
    app.get('/topTenStocks', async (req, res) => {
        (async () => {
            const results = await getActiveList();
            try {
                var config = {
                    method: 'post',
                    baseURL: gateway,
                    url: '/UpdateData',
                    data: {
                        serviceId: 2,
                        serviceName: 'Top Ten Stocks',
                        serviceData: results
                    }
                };
                await axios.request(config);
            } catch (e) {
                console.log("Couldn't update service.")
            }
        })();
        res.status(200).send();
    });

    // shutdown service
    app.get('/shutdown', async (req, res) => {
        try {
            var config = {
                method: 'delete',
                baseURL: gateway,
                url: '/RemoveService/2'
            };
            const response = await axios.request(config);
        } catch (e) {
            console.log("Couldn't shutdown service.")
        }
        res.status(200).send();
    });

    // Error handler
    /* eslint-disable no-unused-vars */
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
    return app;
};

module.exports = {
    create
};
