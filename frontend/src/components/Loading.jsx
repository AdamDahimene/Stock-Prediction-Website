import Sidebar from "./SideBar";
import NavBar from "./NavBar";
import { Container, Row, Col } from 'react-bootstrap';

function Loading() {
    return (
        <div id="main">
                <Container fluid>
                    <NavBar />
                    <Row>
                        <Col xs={2}>
                            <Sidebar />
                        </Col>
                        <Col  xs={10} id="main">
                            <h2>Loading...</h2>
                            <p>Please wait while we load your data</p>
                            <p>Should take 5 seconds if not please reload page</p>
                        </Col>
                    </Row>
                </Container>
            </div>
      );
}

export default Loading;