const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// add axios
// import dataGetter file
var axios = require("axios").default;
const dataGetter = require('./topTenStocksGetter');

// initiate port
const port = process.argv.slice(2)[0];
console.log(`Top Ten Active Stocks service listening on port ${port}`);
app.listen(port);

// index page
app.get('/', (req, res) => {
  res.status(200).send("Index");
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
app.get('/topTenStocks', async (req, res) => {
  const results = await getActiveList();
  res.send(results);
});