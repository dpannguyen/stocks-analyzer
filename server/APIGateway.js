const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

var serviceRegistry = [];

// initiate port
const port = process.argv.slice(2)[0];
console.log(`API Gateway listening on port ${port}`);
app.listen(port);

app.post('/AddService', (req, res) => {
    const ServiceId = parseInt(req.body["serviceId"]);
    const ServiceName = req.body["serviceName"];
    if (ServiceId && ServiceName) {
        serviceRegistry.push({"serviceId": ServiceId, "serviceName": ServiceName});
        res.status(202).send();
    } else {
        console.log(`Id and name not provided`);
        res.status(404).send();
    }
});

app.delete('/RemoveService/:serviceId', (req, res) => {
    const ServiceId = parseInt(req.params.serviceId);
    if (ServiceId) {
        serviceRegistry = serviceRegistry.filter(item => !(item.serviceId == ServiceId));
        res.status(202).send();
    } else {
        console.log(`Id not provided`);
        res.status(404).send();
    }
});

// index page
app.get('/', (req, res) => {
  res.status(200).send("Index");
});

// Services Available
app.get('/GetServices', (req, res) => {
    res.status(200).send(serviceRegistry);
  });