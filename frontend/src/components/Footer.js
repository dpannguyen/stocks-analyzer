import React from "react";
import {Col, Container, Row} from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid>
          <Row>
            <Col>
              {new Date().getFullYear()} © Quincey James, An Nguyen, Jesse Davidson, Cameron Railton.
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
