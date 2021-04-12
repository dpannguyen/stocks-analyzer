import React from "react";

import {Card, CardBody, Col, Row} from "reactstrap";


const ServicePage = ({service: {name, description, elements}}) => {

  return (
    <Col xs={12} className={"mt-5"}>
      <h4>{name}</h4>
      <p className="card-title-desc">{description}</p>
      <Card>
        <CardBody>
          {elements?.map(row => <Row>{row?.map(element => <Col>{element}</Col>)}</Row>)}
        </CardBody>
      </Card>
    </Col>
  );
}

export default ServicePage;
