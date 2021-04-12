const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

var axios = require("axios").default;
const dataGetter = require('./twitterSentimentsGetter');
const gateway = config.gateway;


// ignore request for FavIcon. so there is no error in browser
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
    }
    next();
};

// fn to create express server
const create = async () => {

    // register service
    (async () => {
        const results = await axios.request(dataGetter.options);
        try {
            var config = {
                method: 'post',
                baseURL: gateway,
                url: '/AddService',
                data: {
                    serviceId: 3,
                    serviceName: 'Twitter Sentiments',
                    serviceData: results.data
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
        res.status(200).send("Twitter Sentiments Service");
    });

    // route to manually get and update service data from twitter api
    // send data to api gateway
    app.get('/twitterSentiments', async (req, res) => {
        (async () => {
            //Need to make a method to call API async
            const results = await axios.request(dataGetter.options);
            try {
                var config = {
                    method: 'post',
                    baseURL: gateway,
                    url: '/UpdateData',
                    data: {
                        serviceId: 3,
                        serviceName: 'Twitter Sentiments',
                        serviceData: results.data
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
                url: '/RemoveService/3'
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
