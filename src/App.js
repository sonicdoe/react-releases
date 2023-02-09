import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import List from './List';

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>React Releases</h1>
          <p>All releases of <a href='https://github.com/facebook/react/'>facebook/react</a> on GitHub.</p>

          <List/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
