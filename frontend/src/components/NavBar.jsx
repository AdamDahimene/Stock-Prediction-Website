import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useEffect, useState } from 'react';
import ProtectedRoute from './ProtectedRoute';
import "../styles/NavBar.css";

function NavBar() {

    const apiKey = localStorage.getItem('api_key');

    const visibility = () => {
        console.log("apiKey");

        if (apiKey === "null" || apiKey === null || apiKey === "") {
            document.getElementById('navbar-text').style.visibility = 'hidden';
        } else {
            document.getElementById('navbar-text').style.visibility = 'visible';
        }
    }

    const [color, setColor] = useState(false);
    const changeNavbarColor = () => {
        if (window.scrollY >= 9) {
            setColor(true);
        } else {
            setColor(false);
        }
    }

    window.addEventListener('scroll', changeNavbarColor);

    useEffect(() => {
        visibility();
    }, []);

    return (
    <Navbar fixed='top' className='Header noselect' id={color ? "Navbar-scroll" : "Navbar"}>
        <Container>
            <Navbar.Brand id='navbar-brand' href="/">Stock Predictions</Navbar.Brand>
            <Navbar.Text id='navbar-text' visibility={visibility}>API Key: {apiKey}</Navbar.Text>
            <Nav className='me-auto'>
            </Nav>
            <Nav className='justify-content-end'>
                <ProtectedRoute method={"NavbarLogin"}>
                    <Nav.Link href="/register">Register</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                </ProtectedRoute>
                <ProtectedRoute method={"NavbarLogout"}>
                    <Nav.Link href="/logout">Logout</Nav.Link>
                </ProtectedRoute>
            </Nav>
        </Container>
    </Navbar>
    
    
)}

export default NavBar;