const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();
app.use(bodyParser.json());

const port = process.argv.slice(2)[0];
app.listen(port, function() {
    console.log(`User listening on port ${port}`); 
});

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'tmhhwavtdgsaoyvpzcniahajqqajakplhqvcuchr',
    baseURL: 'http://localhost:' + port,
    clientID: 'E8xyGbrDqzzjzdk5bz8xB4ebGVOFywmy',
    issuerBaseURL: 'https://dev-ldp7br7w.us.auth0.com'
};

app.use(auth(config));

app.get('/', (req, res) => {
    res.status(200).send("Market Index User " + (req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'));
});

var User = function (userData) {
    this.userData = userData;
    this.subscriber = redis.createClient();
};

var user = new User(requiresAuth());

user.subscriber.subscribe("marketIndex");
user.subscriber.on("message", (channel, message) => {
    console.log("Received data: " + message)
});