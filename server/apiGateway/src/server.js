const express = require('express');
const bodyParser = require('body-parser');
const IBM = require('ibm-cos-sdk');
const config = require('./config');

var serviceRegistry = [];

// ignore request for FavIcon. so there is no error in browser
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
    }
    next();
};

// IBM Object Storage config
const ibmConfig = {
    endpoint: config.ibm.endpoint,
    apiKeyId: config.ibm.apiKeyId,
    serviceInstanceId: config.ibm.serviceInstanceId,
    signatureVersion: config.ibm.signatureVersion
}

const cos = new IBM.S3(ibmConfig);
const bucketName = config.ibm.bucketName; // IBM Object Storage bucket

function addUserToBucket(bucketName, userName, userInfo) {
    console.log(`Creating new user: ${userName}`);
    return cos.putObject({
        Bucket: bucketName,
        Key: userName,
        Body: userInfo
    }).promise()
        .then(() => {
            console.log(`User: ${userName} created!`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

function updateUserInBucket(bucketName, userName, userInfo) {
    console.log(`Updating info for user: ${userName}`);
    return cos.putObject({
        Bucket: bucketName,
        Key: userName,
        Body: userInfo
    }).promise()
        .then(() => {
            console.log(`User info for: ${userName} updated!`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

function getUserFromBucket(bucketName, userName) {
    console.log(`Retrieving user from bucket: ${bucketName}, key: ${userName}`);
    return cos.getObject({
        Bucket: bucketName,
        Key: userName
    }).promise();
}

function deleteUserFromBucket(bucketName, userName) {
    console.log(`Deleting item: ${userName}`);
    return cos.deleteObject({
        Bucket: bucketName,
        Key: userName
    }).promise()
        .then(() => {
            console.log(`User: ${userName} deleted!`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

// fn to create express server
const create = async () => {

    // server
    const app = express();

    // configure nonFeature
    app.use(ignoreFavicon);
    app.use(bodyParser.json());

    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    // root route
    app.get('/', (req, res) => {
        res.status(200).send("API Gateway");
    });

    app.post('/AddService', (req, res) => {
        const ServiceId = parseInt(req.body["serviceId"]);
        const ServiceName = req.body["serviceName"];
        const ServiceData = req.body["serviceData"];
        const DateModified = Date.now();
        if (ServiceId && ServiceName) {
            serviceRegistry.push({ "serviceId": ServiceId, "serviceName": ServiceName, "serviceData": ServiceData, "dateModified": DateModified });
            res.status(200).send();
        } else {
            console.log(`Id and name not provided`);
            res.status(404).send();
        }
    });

    app.delete('/RemoveService/:serviceId', (req, res) => {
        const ServiceId = parseInt(req.params.serviceId);
        if (ServiceId) {
            serviceRegistry = serviceRegistry.filter(item => !(item.serviceId == ServiceId));
            res.status(200).send();
        } else {
            console.log(`Id not provided`);
            res.status(404).send();
        }
    });

    // Services Available
    app.get('/GetServices', (req, res) => {
        res.status(200).send(serviceRegistry);
    });

    // Services Available
    app.get('/ServiceExists/:serviceId', (req, res) => {
        res.status(200).send(serviceRegistry.some(x => x.serviceId == req.params.serviceId));
    });

    // DataChangedSince
    app.get('/DataChangedSince/:serviceId/:dateTime', (req, res) => {
        //Find entry if it exists
        var entryList = serviceRegistry.filter(x => x.serviceId == req.params.serviceId);
        if (entryList.length == 0) {
            res.status(301).send({ "error": "Service has been removed." });
        } else {
            var entry = entryList[0];
            if (entry.dateModified > req.params.dateTime) {
                res.status(200).send({ "data": entry.serviceData, "dateTime": entry.dateModified })
            } else {
                res.status(304).send();
            }
        }
    });

    // UpdateData
    // gets called whenever service updates data (e.g. when run /marketIndex)
    // new data will be publish to corresponding service channel
    app.post('/UpdateData', (req, res) => {
        const ServiceId = parseInt(req.body["serviceId"]);
        const ServiceName = req.body["serviceName"];
        const ServiceData = req.body["serviceData"];
        if (ServiceId && ServiceData) {
            var serviceArrayIndex = serviceRegistry.findIndex(x => x.serviceId == ServiceId);
            serviceRegistry[serviceArrayIndex].serviceData = ServiceData;
            serviceRegistry[serviceArrayIndex].dateModified = Date.now();
            console.log("Updating " + ServiceName + " in registry.");
            res.status(200).send();
        } else {
            console.log(`Id and data not provided`);
            res.status(404).send();
        }
    });

    // user authentication
    // if new user, create object storage
    app.get('/:user', (req, res) => {
        var user = req.params.user;

        getUserFromBucket(bucketName, user).then((data) => {
            var services = Buffer.from(data.Body).toString();
            res.status(200).send({ "user": user, "services": services });
        }).catch((NoSuchKey) => {
            addUserToBucket(bucketName, user, '');
            res.status(200).send({ "user": user, "services": [] });
        }).catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
            res.send({ "error": "Error when accessing IBM Object Storage." });
        }).catch((e) => {
            res.status(200).send({ "error": "User not signed in." });
        });
    });

    // route for user to subscribe to service
    app.get('/subscribe/:user/:serviceName', (req, res) => {
        var user = req.params.user;
        var newService = req.params.serviceName;

        getUserFromBucket(bucketName, user).then((data) => {
            var serviceObject = Buffer.from(data.Body).toString();
            var serviceList = (!!serviceObject.length) ? serviceObject.split(", ") : [];
            var services = new Set(serviceList);

            services.add(newService);
            updateUserInBucket(bucketName, user, [...services].join(', '));
            res.send({ "service": newService });
        })
            .catch((e) => {
                console.error(`ERROR: ${e.code} - ${e.message}\n`);
                res.send({ "error": "Error when accessing IBM Object Storage." });
            });
    });

    // route for user to unsubscribe to service
    app.get('/unsubscribe/:user/:serviceName', (req, res) => {
        var user = req.params.user;
        var newService = req.params.serviceName;

        getUserFromBucket(bucketName, user).then((data) => {
            var serviceObject = Buffer.from(data.Body).toString();
            var serviceList = (!!serviceObject.length) ? serviceObject.split(", ") : [];
            var services = new Set(serviceList);

            services.delete(newService);
            updateUserInBucket(bucketName, user, [...services].join(', '));
            res.send({ "service": newService });
        })
            .catch((e) => {
                console.error(`ERROR: ${e.code} - ${e.message}\n`);
                res.send({ "error": "Error when accessing IBM Object Storage." });
            });
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
