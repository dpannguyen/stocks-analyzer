import React, {Component} from "react";

import {Card, CardBody, Col, Container, Row} from "reactstrap";
import GaugeChart from 'react-gauge-chart'
import ReactApexChart from "react-apexcharts";


const INITIAL_GRAPH_CONFIG = {
  series: [{
    name: "Sentiment",
    data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
  }, {
    name: "Volume",
    data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35]
  }],
  options: {
    chart: {zoom: {enabled: !1}, toolbar: {show: !1}},
    colors: ['#ff3333', '#ff9326'],
    dataLabels: {enabled: !1},
    stroke: {width: [3, 4, 3], curve: "smooth"},
    markers: {size: 0, hover: {sizeOffset: 6}},
    xaxis: {categories: ["01 Jan", "02 Jan", "03 Jan", "04 Jan", "05 Jan", "06 Jan", "07 Jan", "08 Jan", "09 Jan", "10 Jan", "11 Jan", "12 Jan"]},
    grid: {borderColor: "#f1f1f1"}
  }
}

const Graph = () => {
  const [config, setConfig] = React.useState(INITIAL_GRAPH_CONFIG);

  return (
    <ReactApexChart options={config.options} series={config.series} type="area" height="380"/>
  )
}

class SocialMediaTrends extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>

            <h2>Social Media Trends</h2>
            <p className="card-title-desc">Enter the service's description here</p>

            <Row>
              <Col xs={12}>
                <Card>
                  <CardBody>
                    <Row className={"my-5"}>
                      <Col xs={12} md={6} className={"text-center"}>
                        <GaugeChart
                          id="sentiment-gauge-chart"
                          nrOfLevels={20}
                          colors={["#ffb3b3", "#ff3333"]}
                          percent={0.86}
                          textColor={"#808080"}
                        />
                        <h4>Current Sentiment</h4>
                      </Col>
                      <Col xs={12} md={6} className={"text-center"}>
                        <GaugeChart
                          id="volume-gauge-chart"
                          nrOfLevels={20}
                          colors={["#ffdab3", "#ff9326"]}
                          percent={0.52}
                          textColor={"#808080"}
                        />
                        <h4>Current Volume</h4>
                      </Col>
                    </Row>
                    <Row className={"m-5"}>
                      <Col xs={12}>
                        <h4>7-Day History</h4>
                        <Graph/>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default SocialMediaTrends;
