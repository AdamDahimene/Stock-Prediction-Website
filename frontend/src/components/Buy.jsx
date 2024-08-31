import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import api from '../api';
import { Navigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import "../styles/Buy_Sell.css";


function Buy({Stock, Price, FreeCash}) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(FreeCash / 2);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem('user_id');
    const api_key = localStorage.getItem('api_key');
    try {
      const url = "/trading212/buy/".concat(api_key).concat("/");
      const response = await api.post(url, {
        account: user_id,
        quantity: (value / Price).toFixed(3),
        ticker: Stock.concat('_US_EQ'),
      });
      handleClose();
      window.location.reload();
    } catch (error) {
      alert(error);
      
    }
  }


  return (
    <>
      <Button id='buy-button' variant="primary" onClick={handleShow}>
        Buy
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        
      >
        <Modal.Header id='gap' closeButton>
          <Modal.Title id='modal-title'>Buy {Stock}</Modal.Title>
          <Modal.Title id='modal-title' >Balance: { FreeCash }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Typography id="non-linear-slider" gutterBottom>
            <p id='middle'>Price: {Price} </p>
            <p id='middle'>Amount: {value} </p>
            <p id='middle'>Shares: {(Math.floor((value / Price) * 100) / 100).toFixed(2)} </p>
          </Typography>
          <Slider
            aria-label="Small steps"
            defaultValue={FreeCash / 2}
            step={0.1}
            marks
            min={1}
            max={FreeCash}
            onChange={(e) => setValue(e.target.value)}
            valueLabelDisplay="auto"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} >Buy</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Buy;