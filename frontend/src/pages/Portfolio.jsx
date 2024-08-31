import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api'; // Import the api object
import { Table } from 'react-bootstrap';
import "../styles/Portfolio.css";
import Loading from '../components/Loading';

function Portfolio() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {

            const apiKey = localStorage.getItem('api_key');

            try {
                const url = '/trading212/account/position/'.concat(apiKey).concat('/');
                const res = await api.get(url);
                console.log(res.data[0].ticker);
                setData(res.data);
                setLoading(false);
                
            } catch (error) {
                Navigate('/home'); // Use the correct function name: navigate
                setLoading(false);
                
            }
        }
        fetchPortfolio();
    }, [])   
    
    

    if (loading) {
        return <Loading />
    }


    return (
        <div id="main-portfolio">
            <Container fluid>
                <NavBar />
                <Row>
                    <Col xs={2}>
                        <Sidebar />
                    </Col>
                    <Col  xs={10} id="main">
                        <h1 id='title-p'>Portfolio</h1>
                        <Table className='table-p'>
                            <thead>
                                <tr>
                                    <th id='space'>Ticker</th>
                                    <th id='space'>Quantity</th>
                                    <th id='space'>Average Price</th>
                                    <th id='space'>Current Price</th>
                                    <th id='space'>FX P/L</th>
                                </tr>
                            </thead>
                        </Table>
                        { data.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Table className='table-pb'>
                                        <tbody>
                                            <tr>
                                                <td id='space'>{item.ticker}</td>
                                                <td id='space'>{item.quantity}</td>
                                                <td id='space'>{item.averagePrice}</td>
                                                <td id='space'>{item.currentPrice}</td>
                                                <td id='space'>{item.fxPpl}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            );
                        })}
                    </Col> 
                </Row>
            </Container>
        </div>
    );
}

export default Portfolio;