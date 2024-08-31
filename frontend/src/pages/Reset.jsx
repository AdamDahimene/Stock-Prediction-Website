import {useState} from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import NavBar from '../components/NavBar'
import { useLocation } from 'react-router-dom'


import FloatingLabel from 'react-bootstrap/FloatingLabel';
import F from 'react-bootstrap/Form';
import "../styles/Form.css"
import "../styles/Login.css"

function Reset() {
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [loading, setLoading] = useState(false)
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate()

    document.body.style.overflow = "hidden";

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        const form = e.currentTarget;

        if (password !== password2) {
            setValidated(true);
            e.preventDefault();
            e.stopPropagation();
            return
        }

        if (form.checkValidity() === false) {
            setValidated(true);
            e.preventDefault();
            e.stopPropagation();

        } else {
            setValidated(true);

            try {
                const location = window.location.pathname
                const token = location.split('/').pop();
                const url = "/api/user/reset/".concat(token).concat("/")
                const new_password = password
                const confirm_password = password2
                const res = await api.post(url, { new_password, confirm_password })
                alert(res.data)
                navigate("/login")
            } catch (error) {
                alert(error)
            }
        }

        setLoading(false)
    }

    return (
        <div className='LoginPage'>
            <NavBar />
            <F className='Form' noValidate validated={validated} onSubmit={handleSubmit}>
                <h1>Reset</h1>
                <div id="field" className="form-floating mb-3">
                    <FloatingLabel
                        controlId="floatingPassword"
                        label="Password"
                        className="mb-3"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    >
                    <F.Control type="password" placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required/>
                        
                        <F.Control.Feedback type="invalid">Must contain at least one number and one uppercase 
                        and lowercase letter, and at least 8 or more characters</F.Control.Feedback>
                    </FloatingLabel>
                </div>
                <div id="field" className="form-floating mb-3">
                    <FloatingLabel
                        controlId="floatingPassword2"
                        label="Confirm Password"
                        className="mb-3"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    >
                    <F.Control type="password" placeholder="Confirm Password" required/>
                        
                        <F.Control.Feedback type="invalid">Please confirm password</F.Control.Feedback>
                    </FloatingLabel>
                </div>
                <div className='buttonField'>
                    <button id='button' class="btn btn-primary" type="submit">Submit</button>
                </div>
            </F>
        </div>
    )
}

export default Reset;