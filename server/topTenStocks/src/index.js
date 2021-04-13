const server = require('./server');
const config = require('./config');
var axios = require("axios").default;

const port = process.env.PORT || config.port;
const gateway = config.gateway;

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
      url: '/RemoveService/2'
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
      url: '/RemoveService/2'
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