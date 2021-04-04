const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

var serviceRegistry = [];

// initiate port
const port = '44444';
app.listen(port, function() {
    console.log(`API Gateway listening on port ${port}`);
});

app.post('/AddService', (req, res) => {
    const ServiceId = parseInt(req.body["serviceId"]);
    const ServiceName = req.body["serviceName"];
    const ServiceData = req.body["serviceData"];
    const DateModified = Date.now();
    if (ServiceId && ServiceName) {
        serviceRegistry.push({"serviceId": ServiceId, "serviceName": ServiceName, "serviceData": ServiceData, "dateModified": DateModified});
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

// index page
app.get('/', (req, res) => {
  res.status(200).send("Index");
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
    if (entryList.length == 0){
        res.status(301).send();
    } else {
        var entry = entryList[0];
        if (entry.dateModified > req.params.dateTime){
            res.status(200).send({"data": entry.serviceData, "dateTime": entry.dateModified})
        } else {
            res.status(304).send();
        }
    }
});

//UpdateData
app.post('/UpdateData', (req, res) => {
    const ServiceId = parseInt(req.body["serviceId"]);
    const ServiceData = req.body["serviceData"];
    if (ServiceId && ServiceData) {
        var serviceArrayIndex = serviceRegistry.findIndex(x => x.serviceId == ServiceId);
        serviceRegistry[serviceArrayIndex].serviceData = ServiceData;
        serviceRegistry[serviceArrayIndex].dateModified = Date.now();
        res.status(200).send();
    } else {
        console.log(`Id and data not provided`);
        res.status(404).send();
    }
});