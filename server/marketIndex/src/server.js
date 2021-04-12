const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

var axios = require("axios").default;
const dataGetter = require('./marketIndexGetter');
const gateway = config.gateway;


// ignore request for FavIcon. so there is no error in browser
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
    }
    next();
};

async function getPriceInfo(options) {
    const response = await axios.request(options);
    var priceObject = response.data.quoteSummary.result[0].price;
    var symbol = priceObject.symbol;
    var name = priceObject.shortName;
    var price = priceObject.regularMarketPrice.fmt;
    var change = priceObject.regularMarketChange.fmt;
    var changePer = priceObject.regularMarketChangePercent.fmt;
    var volume = priceObject.regularMarketVolume.fmt;
    return { "symbol": symbol, "name": name, "price": price, "change": change, "changePer": changePer, "volume": volume };
}

async function getMarketIndex() {
    var indices = ["%5EGSPC", "%5EDJI", "%5EIXIC", "%5EGSPTSE"]; // 4 indices S&P 500, Dow Jones, NASDAQ, S&P/TSX. list expandable
    var results = [];
    for (let index in indices) {
        dataGetter.options.url = indices[index];
        const priceInfo = await getPriceInfo(dataGetter.options);
        results.push(priceInfo);
    }
    return results;
}

// fn to create express server
const create = async () => {

    // register service
    (async () => {
        const results = await getMarketIndex();
        try {
            var config = {
                method: 'post',
                baseURL: gateway,
                url: '/AddService',
                data: {
                    serviceId: 1,
                    serviceName: 'Market Index',
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
        res.status(200).send("Market Index Service");
    });

    // route to manually get and update service data from yfinance api
    // send data to api gateway
    app.get('/marketIndex', async (req, res) => {
        (async () => {
            const results = await getMarketIndex();
            try {
                var config = {
                    method: 'post',
                    baseURL: gateway,
                    url: '/UpdateData',
                    data: {
                        serviceId: 1,
                        serviceName: 'Market Index',
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
                url: '/RemoveService/1'
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
