import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import Table from 'react-bootstrap/Table';

import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import "../styles/History.css";
import Loading from '../components/Loading';

function History() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState({});


    useEffect(() => {
        const fetchHistory = async () => {

            const user_id = localStorage.getItem('user_id');

            try {
                const url = '/trading212/history/'.concat(user_id).concat('/');
                const res = await api.get(url);
                console.log(res.data[0]);
                setData(res.data);
                

                setLoading(false);
                
            } catch (error) {
                setLoading(false);
                Navigate('/home');
                
            }

            
        }
        fetchHistory();
    }, [])

    const withoutZeroDecimals = (value) => Number(value).toFixed(3).toString();
    
    

    if (loading) {
        return <Loading />
    }

  return (
        <div id="main-history">
            <Container fluid>
                <NavBar />
                <Row>
                    <Col xs={2}>
                        <Sidebar />
                    </Col>
                    <Col  xs={10} id="main">
                        <h1 id='title-h'>History</h1>
                        <Table className='table-h'>
                            <thead>
                                <tr className='cell-color'>
                                    <th id='margins'>Type</th>
                                    <th id='margins'>Date</th>
                                    <th id='margins'>Ticker</th>
                                    <th id='margins'>Quantity</th>
                                    <th id='margins'>Price</th>
                                    <th id='margins'>Total</th>
                                </tr>
                            </thead>
                        </Table>
                        { data.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Table className='table-b'>
                                        <tbody>
                                            <tr>
                                                <td className='gray' id='margins'>{item.type === 1 ? 'Bought' : 'Sold'}</td>
                                                <td id='margins'>{item.date}</td>
                                                <td className='gray' id='margins'>{item.ticker}</td>
                                                <td className='gray' id='margins'>{withoutZeroDecimals(item.quantity)}</td>
                                                <td id='margins'>{withoutZeroDecimals(item.priceOfStock)}</td>
                                                <td className='gray' id='margins'>{withoutZeroDecimals(item.quantity * item.priceOfStock)}</td>
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

export default History;