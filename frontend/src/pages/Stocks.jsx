import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import NavBar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import Buy from '../components/Buy';
import Sell from '../components/Sell';
import Loading from '../components/Loading';

import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useRef } from 'react';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import api from '../api';
import "../styles/Stocks.css";

function sleep(num) {
    let now = new Date();
    let stop = now.getTime() + num;
    while(true) {
        now = new Date();
        if(now.getTime() > stop) return;
    }
}

function Stocks() {
    const [data, setData] = useState(null);
    const [stockPrices, setStockPrices] = useState({});
    const [quantity, setQuantity] = useState({});
    const [loading, setLoading] = useState(true);
    const isFetched = useRef(false);

    const MINUTE_MS = 60000;
    const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

    const fetchBalance = async () => {

        const apiKey = localStorage.getItem('api_key');

        try {
            const url = '/trading212/account/cash/'.concat(apiKey).concat('/');
            const res = await api.get(url);
            //console.log(res.data);
            setData(res.data);
            const stockPromises = stocks.map(stock => api.get(`/trading212/prices/${stock}/`));
            const results = await Promise.all(stockPromises);

            const newStockPrices = results.reduce((acc, res, index) => {
                acc[stocks[index]] = res.data;
                return acc;
            }, {});

            setStockPrices(newStockPrices);


            const res2 = await api.get(`/trading212/positions/AAPL/${apiKey}/`);
            setQuantity(res2.data);
            //console.log(res2.data);
            

            setLoading(false);
        } catch (error) {
            console.log("error");
            Navigate('/home');
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isFetched.current) {
            fetchBalance();
            isFetched.current = true; 
        }
    }, [])

    if (loading) {
        return <Loading />;
    }

  return (
    <div id="stock-main">
            <Container fluid>
                <NavBar />
                <Row>
                    <Col xs={2}>
                        <Sidebar />
                    </Col>
                    <Col  xs={10} id="main">
                        <h1>Stocks</h1>
                        <p id='stock-details'>Current Cash: {data.free}</p>
                        <p id='stock-details'>Invested Cash: {data.invested}</p>
                        
                        {stocks.map(stock => (
                            <div>
                                <p id='stock-names'>{stock}</p>
                                <Image src={stock+".png"} rounded />
                                <Buy Stock={stock} Price={stockPrices[stock]} FreeCash={data.free}/>
                                <Sell Stock={stock} Price={stockPrices[stock]} Quantity={quantity[stock]} />
                            </div>
                        ))}

                    </Col> 
                </Row>
            </Container>
        </div>
  );
}

export default Stocks;