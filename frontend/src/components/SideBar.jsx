import React, { useEffect } from "react";
import {Nav} from "react-bootstrap";
import '../styles/SideBar.css';
import Image from "react-bootstrap/Image";

function SideBar() {

    const apiKey = localStorage.getItem('api_key');

    const display = () => {
        if (apiKey === "null" || apiKey === null || apiKey === "") {
            document.getElementById('sidebar-link-home').style.pointerEvents = 'none';
            document.getElementById('sidebar-link-home').style.cursor = 'default';
            document.getElementById('sidebar-link-home').style.color = 'grey';

            document.getElementById('sidebar-link-stocks').style.pointerEvents = 'none';
            document.getElementById('sidebar-link-stocks').style.cursor = 'default';
            document.getElementById('sidebar-link-stocks').style.color = 'grey';

            document.getElementById('sidebar-link-portfolio').style.pointerEvents = 'none';
            document.getElementById('sidebar-link-portfolio').style.cursor = 'default';
            document.getElementById('sidebar-link-portfolio').style.color = 'grey';

            document.getElementById('sidebar-link-history').style.pointerEvents = 'none';
            document.getElementById('sidebar-link-history').style.cursor = 'default';
            document.getElementById('sidebar-link-history').style.color = 'grey';
        } else {
            document.getElementById('sidebar-link-home').style.pointerEvents = 'auto';
            document.getElementById('sidebar-link-home').style.cursor = 'pointer';
            document.getElementById('sidebar-link-home').style.color = 'rgba(38, 0, 255, 0.838)';

            document.getElementById('sidebar-link-stocks').style.pointerEvents = 'auto';
            document.getElementById('sidebar-link-stocks').style.cursor = 'pointer';
            document.getElementById('sidebar-link-stocks').style.color = 'rgba(38, 0, 255, 0.838)';

            document.getElementById('sidebar-link-portfolio').style.pointerEvents = 'auto';
            document.getElementById('sidebar-link-portfolio').style.cursor = 'pointer';
            document.getElementById('sidebar-link-portfolio').style.color = 'rgba(38, 0, 255, 0.838)';

            document.getElementById('sidebar-link-history').style.pointerEvents = 'auto';
            document.getElementById('sidebar-link-history').style.cursor = 'pointer';
            document.getElementById('sidebar-link-history').style.color = 'rgba(38, 0, 255, 0.838)';
        }
    }

    useEffect(() => {
        display();
    }, []);

    return (
        <section className="sidebar-section noselect">
            <Nav className="d-none d-md-block sidebar">
                <div className="sidebar-sticky">
                    <Nav.Item className="sidebar-link">
                        <Image id="icon" src="house-black.svg"></Image>
                        <Nav.Link id="sidebar-link-home" href="/home">Home</Nav.Link>
                    </Nav.Item>
                    <hr id="sidebar-line"></hr>
                    <Nav.Item className="sidebar-link">
                        <Image id="icon" src="graph-black.svg"></Image>
                        <Nav.Link id="sidebar-link-stocks" href="/stocks">Stocks</Nav.Link>
                    </Nav.Item>
                    <hr id="sidebar-line"></hr>
                    <Nav.Item className="sidebar-link">
                        <Image id="icon" src="pie-black.svg"></Image>
                        <Nav.Link id="sidebar-link-portfolio" href="/portfolio" >Portfolio</Nav.Link>
                    </Nav.Item>
                    <hr id="sidebar-line"></hr>
                    <Nav.Item className="sidebar-link">
                        <Image id="icon" src="history-black.svg"></Image>
                        <Nav.Link id="sidebar-link-history" href="/history">History</Nav.Link>
                    </Nav.Item>
                    <hr id="sidebar-line"></hr>
                </div>
            </Nav>
        </section>
    )
}

export default SideBar