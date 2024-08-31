import Form from "../components/Form"
import NavBar from "../components/NavBar"

import '../styles/Login.css'

function Register() {
    return (
    <div className="LoginPage">
        <NavBar />
        <Form route="/api/user/register/" method="register" />
    </div>
)}

export default Register