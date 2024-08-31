import NavBar from "../components/NavBar";
import Container from 'react-bootstrap/Container';
import { Button } from "react-bootstrap";
import ProtectedRoute from "../components/ProtectedRoute";
import { useState } from 'react';

import "../styles/About.css";


function About() {

  document.body.style.overflow = "hidden";
  document.body.style.backgroundImage = `url('../assets/background.jpg')`;

  return (
    <section className="page">
      <div>
        <h1 id="title">Stock Predictions</h1>
        <p id="description">Experience seamless trading with our app that predicts future prices. 
          Gain valuable insights to make informed decisions and optimize your trading strategy with ease</p>
        <div id="begin-buttons">
          <ProtectedRoute method={"NavbarLogout"}>
            <Button href="/home" id="begin">Home</Button>
            <Button href="/logout" id="begin">Logout</Button>
          </ProtectedRoute>
          <ProtectedRoute method={"NavbarLogin"}>
            <Button href="/login" id="begin">Login</Button>
            <Button href="/register" id="begin">Register</Button>
          </ProtectedRoute>
        </div>
      </div>
    </section>
  )
}


export default About;