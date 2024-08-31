import NavBar from "../components/NavBar"
import Sidebar from "../components/SideBar";
import api from '../api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from "../components/Loading";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Container, Row, Col } from 'react-bootstrap';
import "../styles/Home.css";

function Home() {
    const [api_key, setapi_key] = useState("")
    const [loading, setLoading] = useState(false)
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate()

    const account = localStorage.getItem("user_id")

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            const res = await api.put("/trading212/update/", {account: account, api_key: api_key})

            if (res.data === "null") {
                alert("API key not updated")
                setLoading(false)

                window.location.reload()
                return
            }
            
            localStorage.setItem("api_key", api_key)
            alert("API key updated")
        } catch (error) {
            alert(error)
        }

        setLoading(false)

        window.location.reload()

    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div id="main-home">
            <Container fluid>
                <NavBar />
                <Row>
                    <Col xs={2}>
                      <Sidebar />
                    </Col>
                    <Col  xs={10} id="main">
                        <h1 id="title-h">Welcome to the Stock Trading App</h1>
                        <p id="home-description">This app allows you to look at the stock predictions for the week ahead.</p>
                        <p id="home-description">You can also track your stock portfolio and view your account balance.</p>
                        <p id="home-description">There is a history tab to see all previous buy and sell orders placed.</p>
                        <p id="home-description">You can find your API key by logging into your Trading 212 account and going to the settings page.</p>
                        <p id="home-description">Please note that this app only works with Trading 212 Demo accounts.</p>
                        <p id="home-description">If you would like a demo please use the API: 15118970ZDgvexajeSpXUPlhuNeVywUhVdxmt</p>
                        <p id="home-description">Please enter your Trading 212 Demo API key below:</p>

                        <Form onSubmit={handleSubmit}>
                            <div id="field" className="form-floating mb-3">
                                <Form.Group id="api-group" controlId="formApiKey">
                                    <Form.Label
                                        controlId="floatingKey"
                                        label="API Key"
                                        className="mb-3"
                                        id="box"
                                        placeholder="API Key"
                                        value={api_key}
                                        onChange={(e) => setapi_key(e.target.value)}>
                                    API Key:
                                    
                                        <Form.Control type="text" placeholder="Enter your API key" />
                                    </Form.Label>
                                </Form.Group>
                            </div>
                            <Button id="api-button" variant="primary" type="submit">
                                Update API Key
                            </Button>
                        </Form>
                    </Col> 
                </Row>

            </Container>
        </div>
    )
}

export default Home