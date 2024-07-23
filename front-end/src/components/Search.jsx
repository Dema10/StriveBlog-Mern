import { Col, Form, Row } from "react-bootstrap";

export default function Search( {search, handlerSearch} ) {
  return (
    <Row className="justify-content-center mb-4">
      <Col xs={12} sm={8} md={6} lg={4} data-bs-theme="dark">
        <Form.Group>
          <Form.Control
            type="search"
            placeholder="Search..."
            value={search}
            onChange={handlerSearch}
            data-custom-input
          />
        </Form.Group>
      </Col>
    </Row>
  )
}
