const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// add axios
// import dataGetter file
var axios = require("axios").default;
const dataGetter = require('./topTenStocksGetter');

// register service
(async () => {
  try {
    var config = {
      method: 'post',
      baseURL: 'http://localhost:44444',
      url: '/AddService',
      data: {
        serviceId: 2,
        serviceName: 'Top Ten Stocks'
      }
    };
    const response =  await axios.request(config);
  } catch (e) {
      console.log("Couldn't register service.")
  }
})();

// initiate port
const port = process.argv.slice(2)[0];
app.listen(port, function() {
  console.log(`Top Ten Active Stocks service listening on port ${port}`);
});

// index page
app.get('/', (req, res) => {
  res.status(200).send("Index Page for Top Ten Stocks Service");
});

async function getActiveList() {
  const response = await axios.request(dataGetter.options);
  var activeList = response.data.finance.result[0].quotes;
  var results = [];
  for (let index in activeList) { // values will need to be formatted
    let stock = activeList[index];
    let symbol = stock.symbol;
    let name = stock.shortName;
    let price = stock.regularMarketPrice;
    let change = stock.regularMarketChange;
    let changePer = stock.regularMarketChangePercent;
    let volume = stock.regularMarketVolume;
    let marketCap = stock.marketCap;
    let peRatio = (!!stock.trailingPE) ? stock.trailingPE : "---";
    results.push({"symbol": symbol, "name": name, "price": price, "change": change, 
      "changePer": changePer, "volume": volume, "marketCap": marketCap, "peRatio": peRatio});
  }
  return results;
};

// main page for top ten stocks
// app.get('/topTenStocks', async (req, res) => {
//   const results = await getActiveList();
//   res.send(results);
// });

// route to manually get and update service data from yfinance api
// send data to api gateway
app.get('/topTenStocks', async (req, res) => {
  (async () => {
    const results = await getActiveList();
    try {
      var config = {
        method: 'post',
        baseURL: 'http://localhost:44444',
        url: '/UpdateData',
        data: {
          serviceId: 2,
          serviceName: 'Top Ten Stocks',
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

// unregister service
process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  try {
    var config = {
      method: 'delete',
      baseURL: 'http://localhost:44444',
      url: '/RemoveService/2'
    };
    const response =  await axios.request(config);
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
      baseURL: 'http://localhost:44444',
      url: '/RemoveService/2'
    };
    const response =  await axios.request(config);
    process.exit(0);
  } catch (e) {
      console.log(e);
      console.log("Couldn't unregister service.");
      process.exit(0);
  }
});