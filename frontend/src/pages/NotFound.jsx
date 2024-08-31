import NavBar from "../components/NavBar"
import Sidebar from "../components/SideBar"

import { Container, Row, Col } from 'react-bootstrap';

function NotFound() {
    return (
        <div id="main">
            <Container fluid>
                <NavBar />
                <Row>
                    <Col xs={2}>      
                    </Col>
                    <Col  xs={10} id="main">
                        <h1>404 Not Found</h1>
                        <p>The page you're looking for doesn't exist!</p>
                    </Col> 
                </Row>

            </Container>
        </div>
    )
}

export default NotFound