import React from "react";
import {Container, Row} from "reactstrap";
import {connect} from "react-redux";
import ServicePage from "../ServicePage";
import {MDBDataTable} from "mdbreact";
import GaugeChart from 'react-gauge-chart'

const exampleTopTenData = [
  {
    "symbol": "NIO",
    "name": "NIO Inc.",
    "price": 38.11,
    "change": -1.1699982,
    "changePer": -2.9786105,
    "volume": 270803185,
    "marketCap": 59410059264,
    "peRatio": "---"
  },
  {
    "symbol": "PLTR",
    "name": "Palantir Technologies Inc.",
    "price": 23.95,
    "change": -0.7799988,
    "changePer": -3.1540592,
    "volume": 173468558,
    "marketCap": 43643367424,
    "peRatio": "---"
  },
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 121.42,
    "change": 1.2900009,
    "changePer": 1.0738375,
    "volume": 153766501,
    "marketCap": 2038411034624,
    "peRatio": 32.931923
  },
  {
    "symbol": "BCS",
    "name": "Barclays PLC",
    "price": 9.55,
    "change": 0.34000015,
    "changePer": 3.6916413,
    "volume": 147611977,
    "marketCap": 41386455040,
    "peRatio": 85.26785
  },
  {
    "symbol": "GE",
    "name": "General Electric Company",
    "price": 13.6,
    "change": 0.04,
    "changePer": 0.294985,
    "volume": 104975359,
    "marketCap": 119243980800,
    "peRatio": 23.611113
  },
  {
    "symbol": "NCLH",
    "name": "Norwegian Cruise Line Holdings ",
    "price": 28.85,
    "change": -4.050001,
    "changePer": -12.310033,
    "volume": 96474562,
    "marketCap": 9109156864,
    "peRatio": "---"
  },
  {
    "symbol": "TSLA",
    "name": "Tesla, Inc.",
    "price": 597.95,
    "change": -23.48999,
    "changePer": -3.7799287,
    "volume": 89395616,
    "marketCap": 573944692736,
    "peRatio": 934.29694
  },
  {
    "symbol": "CCL",
    "name": "Carnival Corporation",
    "price": 26.09,
    "change": -1.3099995,
    "changePer": -4.78102,
    "volume": 83747365,
    "marketCap": 30180130816,
    "peRatio": "---"
  },
  {
    "symbol": "F",
    "name": "Ford Motor Company",
    "price": 12.27,
    "change": 0.34000015,
    "changePer": 2.8499591,
    "volume": 79345704,
    "marketCap": 48818528256,
    "peRatio": "---"
  },
  {
    "symbol": "BAC",
    "name": "Bank of America Corporation",
    "price": 36.93,
    "change": 0.43,
    "changePer": 1.17808,
    "volume": 74292325,
    "marketCap": 318823727104,
    "peRatio": 19.748663
  }
]
const exampleMarketIndexData = [
  {
    "symbol": "^GSPC",
    "name": "S&P 500",
    "price": "3,841.94",
    "change": "73.47",
    "changePer": "1.95%",
    "volume": "3.33B"
  },
  {
    "symbol": "^DJI",
    "name": "Dow Jones Industrial Average",
    "price": "31,496.30",
    "change": "572.20",
    "changePer": "1.85%",
    "volume": "505.35M"
  },
  {
    "symbol": "^IXIC",
    "name": "NASDAQ Composite",
    "price": "12,920.15",
    "change": "196.65",
    "changePer": "1.55%",
    "volume": "2.47B"
  },
  {
    "symbol": "^GSPTSE",
    "name": "S&P/TSX Composite index",
    "price": "18,380.96",
    "change": "255.26",
    "changePer": "1.41%",
    "volume": "327.50M"
  }
]

function jsonToChartData(json) {
  return json.reduce((output, element) => {
    const existingFields = output.columns.map(element => element.field);
    const newFields = Object.keys(element).filter(field => !existingFields.includes(field));

    output.columns.push(...newFields.map(field => ({
      label: field,
      field: field,
      sort: "asc",
      width: 150
    })));

    output.rows.push(element)

    return output;
  }, ({columns: [], rows: []}))
}

const Dashboard = connect(x => x)(props => {
  const serviceConfigs = (xx) => [{
    name: "Top Ten Stocks",
    elements: [[<MDBDataTable responsive bordered data={jsonToChartData(xx.find(({serviceId}) => serviceId === 2)?.serviceData || exampleTopTenData)}/>]]
  }, {
    name: "Twitter Sentiments",
    elements: [

      xx.find(({serviceId}) => serviceId === 3)?.serviceData?.map(({sentiment}) =>
        <GaugeChart
          id="sentiment-gauge-chart"
          nrOfLevels={20}
          colors={["#ffb3b3", "#ff3333"]}
          percent={Math.min(Math.abs(sentiment), .9332)}
          textColor={"#808080"}
        />
      ),
      xx.find(({serviceId}) => serviceId === 3)?.serviceData?.map(({name}) =>
        <h4 className={"text-center"}>{name.toUpperCase()}</h4>
      )
    ]
  }, {
    name: "Market Index",
    elements: [[<MDBDataTable responsive bordered
                              data={jsonToChartData(xx.find(({serviceId}) => serviceId === 1)?.serviceData || exampleMarketIndexData)}/>]]
  }]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <h2>Dashboard</h2>
          <p className="card-title-desc">All of your current subscriptions are shown below</p>
          <Row>
            {serviceConfigs(props.Services.services)
              .filter(({name}) => props.Services.subscriptions?.find(x => x === name))
              .filter(({name}) => props.Services.services.find(({serviceName}) => serviceName === name))
              .map(service => <ServicePage service={service} key={service.name}/>)}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
})

export default Dashboard;
