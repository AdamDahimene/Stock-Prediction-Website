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

function Request() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate()

    document.body.style.overflow = "hidden";

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            setValidated(true);
            e.preventDefault();
            e.stopPropagation();

        } else {
            setValidated(true);

            try {
                const res = await api.post("/api/reset/request/", { email })
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
                        controlId="floatingEmail"
                        label="Email"
                        className="mb-3"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    >
                        <F.Control type="email" placeholder="Email" required/>
                        
                        <F.Control.Feedback type="invalid">Please enter a username</F.Control.Feedback>
                    </FloatingLabel>
                </div>
                <div className='buttonField'>
                    <button id='button' class="btn btn-primary" type="submit">Reset</button>
                </div>
                <p id='field'>Go back to <a href='/login'>Login</a></p>
            </F>
        </div>
    )
}
export default Request