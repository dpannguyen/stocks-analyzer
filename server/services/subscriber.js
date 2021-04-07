const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const crypto = require('crypto');
const IBM = require('ibm-cos-sdk');


// IBM Object Storage config
// needs to be moved to another file when cleanup
// keys can be put into config file if time permits
const ibmConfig = {
    endpoint: "s3.us-east.cloud-object-storage.appdomain.cloud",
    apiKeyId: "qPHHWYogiG5ChP_NmuzIF_4P_pXQBswUZyTRFH91Kj2D",
    serviceInstanceId: "crn:v1:bluemix:public:cloud-object-storage:global:a/f85ccdefdf384a2d873ecb845241cff6:e192a948-bb60-4fb9-803f-85417b761d7e::",
    signatureVersion: 'iam'
}

const cos = new IBM.S3(ibmConfig);
const bucketName = '4471-objectstorage-cos-standard-dm1'; // IBM Object Storage bucket

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

const app = express();
app.use(bodyParser.json());


// Auth0 authentication callback url set to port 3000
const port = '3000';
app.listen(port, function () {
    console.log(`User listening on port ${port}`);
});

// Auth0 config
// needs to be moved to another file when cleanup
// keys can be put into config file if time permits
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: crypto.randomBytes(32).toString('hex'),
    baseURL: 'http://localhost:' + port,
    clientID: 'E8xyGbrDqzzjzdk5bz8xB4ebGVOFywmy',
    issuerBaseURL: 'https://dev-ldp7br7w.us.auth0.com'
};

app.use(auth(config));

// user authentication
// if new user, create object storage
app.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        if (req.oidc.isAuthenticated()) {
            resolve(req.oidc.user.name);
        } else {
            reject(null);
        }
    }).then((user) =>
        getUserFromBucket(bucketName, user).then((data) => {
            var services = Buffer.from(data.Body).toString();
            res.status(200).send({ "user": user, "services": services });
        }).catch((NoSuchKey) => {
            addUserToBucket(bucketName, user, '');
        })
    ).catch((e) => {
        res.status(200).send({"error": "User not signed in."});
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
});


// get user general profile (name and service list)
app.get('/userProfile', (req, res) => {
    var user = req.oidc.user.name;
    getUserFromBucket(bucketName, user).then((data) => {
        var services = Buffer.from(data.Body).toString();
        res.send({ "user": user, "services": services });
    })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
});

// route for user to subscribe to service
app.get('/subscribe/:serviceName', (req, res) => {
    var user = req.oidc.user.name;
    var newService = req.params.serviceName;
    switch (newService) {
        case "marketIndex":
            newService = "Market Index";
            break;
        case "topTenStocks":
            newService = "Top Ten Stocks";
            break;
    }

    getUserFromBucket(bucketName, user).then((data) => {
        var serviceObject = Buffer.from(data.Body).toString();
        var serviceList = (!!serviceObject.length) ? serviceObject.split(", ") : [];
        var services = new Set(serviceList);

        services.add(newService);
        updateUserInBucket(bucketName, user, [...services].join(', '));
        res.send(`Subscribed to ${newService}`);
    })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
});

// route for user to unsubscribe to service
app.get('/unsubscribe/:serviceName', (req, res) => {
    var user = req.oidc.user.name;
    var newService = req.params.serviceName;
    switch (newService) {
        case "marketIndex":
            newService = "Market Index";
            break;
        case "topTenStocks":
            newService = "Top Ten Stocks";
            break;
    }

    getUserFromBucket(bucketName, user).then((data) => {
        var serviceObject = Buffer.from(data.Body).toString();
        var serviceList = (!!serviceObject.length) ? serviceObject.split(", ") : [];
        var services = new Set(serviceList);

        services.delete(newService);
        updateUserInBucket(bucketName, user, [...services].join(', '));
        res.send(`Unsubscribed from ${newService}`);
    })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
});