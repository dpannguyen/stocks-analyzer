const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const User = require('./user.js');

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

var user = new User();

app.use(auth(config));

app.get('/', (req, res) => {
    res.status(200).send("User " + (req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'));
});

app.get('/userProfile', (req, res) => {
    res.send({"user": req.oidc.user.name, "services": user.services});
})

app.get('/subMarketIndex', (req, res) => {
    user.subscriber.subscribe("Market Index");
    user.addService("Market Index");
    res.send("Subscribed to Market Index");
})

app.get('/subTopTenStocks', (req, res) => {
    user.subscriber.subscribe("Top Ten Stocks");
    user.addService("Top Ten Stocks");
    res.send("Subscribed to Top Ten Stocks");
})

app.get('/subBoth', (req, res) => {
    user.subscriber.subscribe("Market Index", "Top Ten Stocks");
    user.addService("Market Index");
    user.addService("Top Ten Stocks");
    res.send("Subscribed to Market Index and Top Ten Stocks");
})

app.get('/unsubMarketIndex', (req, res) => {
    user.subscriber.unsubscribe("Market Index");
    user.removeService("Market Index");
    res.send("Unsubscribed from Market Index");
})

app.get('/unsubTopTenStocks', (req, res) => {
    user.subscriber.unsubscribe("Top Ten Stocks");
    user.removeService("Top Ten Stocks");
    res.send("Unsubscribed from Top Ten Stocks");
})

app.get('/unsubBoth', (req, res) => {
    user.subscriber.unsubscribe("Market Index", "Top Ten Stocks");
    user.removeService("Market Index");
    user.removeService("Top Ten Stocks");
    res.send("Unsubscribed from Market Index and Top Ten Stocks");
})

user.subscriber.on("message", (service, message) => {
    console.log("Received data from " + service + ": " + message)
});
user.subscriber.on("error", function(error) {
    console.log(error)
});