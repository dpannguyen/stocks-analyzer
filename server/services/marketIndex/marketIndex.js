const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// add axios
// import dataGetter file
var axios = require("axios").default;
const dataGetter = require('./marketIndexGetter');

// register service
(async () => {
  try {
    var config = {
      method: 'post',
      baseURL: 'http://localhost:44444',
      url: '/AddService',
      data: {
        serviceId: 1,
        serviceName: 'Market Index'
      }
    };
    const response =  await axios.request(config);
  } catch (e) {
      console.log("Couldn't register service.")
  }
})();

// initiate port
const port = process.argv.slice(2)[0];
console.log(`Market Index service listening on port ${port}`);
app.listen(port);

// index page
app.get('/', (req, res) => {
  res.status(200).send("Index");
});

async function getPriceInfo(options) {
  const response =  await axios.request(options);
  var priceObject = response.data.quoteSummary.result[0].price;
  var symbol = priceObject.symbol;
  var name = priceObject.shortName;
  var price = priceObject.regularMarketPrice.fmt;
  var change = priceObject.regularMarketChange.fmt;
  var changePer = priceObject.regularMarketChangePercent.fmt;
  var volume = priceObject.regularMarketVolume.fmt;
  return {"symbol": symbol, "name": name, "price": price, "change": change, "changePer": changePer, "volume": volume};
};

async function getMarketIndex() {
  var indices = ["%5EGSPC", "%5EDJI", "%5EIXIC", "%5EGSPTSE"]; // 4 indices S&P 500, Dow Jones, NASDAQ, S&P/TSX. list expandable
  var results = [];
  for (let index in indices) {
    dataGetter.options.url = indices[index];
    const priceInfo = await getPriceInfo(dataGetter.options);
    results.push(priceInfo);
  }
  return results;
}

// main page for market index
app.get('/marketIndex', async (req, res) => {
  const results = await getMarketIndex();
  res.send(results);
});

process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  try {
    var config = {
      method: 'delete',
      baseURL: 'http://localhost:44444',
      url: '/RemoveService/1'
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
      url: '/RemoveService/1'
    };
    const response =  await axios.request(config);
    process.exit(0);
  } catch (e) {
      console.log(e);
      console.log("Couldn't unregister service.");
      process.exit(0);
  }
});