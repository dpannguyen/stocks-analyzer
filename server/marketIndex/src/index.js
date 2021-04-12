const server = require('./server');
var axios = require("axios").default;

const port = process.env.PORT || 3010;

// const gateway = 'http://4471-apigateway.azurewebsites.net';
const gateway = 'http://localhost:4444';

server.create()
  .then(app => {
    app.listen(port, () => {
      console.log(`Server has started on port ${port}!`);
    });
  }).catch(err => console.log(err));

// unregister service
process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  try {
    var config = {
      method: 'delete',
      baseURL: gateway,
      url: '/RemoveService/1'
    };
    const response = await axios.request(config);
    console.log("Unregistered service.");
    process.exit(0);
  } catch (e) {
    console.log("Couldn't unregister service.");
    process.exit(0);
  }
});

process.on('SIGINT', async () => {
  console.info('SIGINT signal received.');
  console.log('Closing http server.');
  try {
    var config = {
      method: 'delete',
      baseURL: gateway,
      url: '/RemoveService/1'
    };
    const response = await axios.request(config);
    console.log("Unregistered service.");
    process.exit(0);
  } catch (e) {
    console.log(e);
    console.log("Couldn't unregister service.");
    process.exit(0);
  }
});