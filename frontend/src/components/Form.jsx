import {useState} from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'


import FloatingLabel from 'react-bootstrap/FloatingLabel';
import F from 'react-bootstrap/Form';
import "../styles/Form.css"

function Form({route, method}) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [loading, setLoading] = useState(false)
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    document.body.style.overflow = "hidden";

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        const form = e.currentTarget;

        if (method === "register" && password !== password2) {
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
                const res = await api.post(route, { username, email, password})
                if (method === "login") {
                    let url = "/api/user/".concat(username).concat("/")
                    const res2 = await api.get(url)
                    localStorage.setItem("user_id", res2.data.id[0])
                    localStorage.setItem("api_key", res2.data.api_key[0])

                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                    localStorage.setItem("username", username)
                    navigate("/home")
                } else {
                    navigate("/login")
                }
                
            } catch (error) {
                alert(error)
            }
        }
        setLoading(false)
    }

    return (
        <F className='Form' noValidate validated={validated} onSubmit={handleSubmit}>
            <h1>{name}</h1>
            <div id="field" className="form-floating mb-3">
                <FloatingLabel
                    controlId="floatingName"
                    label="Username"
                    className="mb-3"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                >
                    <F.Control type="text" placeholder="Username" required/>
                    
                    <F.Control.Feedback type="invalid">Please enter a username</F.Control.Feedback>
                </FloatingLabel>
            </div>
            {method === "register" && (
                <div id="field" className="form-floating mb-3">
                    <FloatingLabel
                        controlId="floatingEmail"
                        label="Email Address"
                        className="mb-3"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                        <F.Control type="email" placeholder="Email Address" required/>
                        <F.Control.Feedback type="invalid" >Please enter an email</F.Control.Feedback>
                    </FloatingLabel>
                </div>
            )}
            <div id="field" className="form-floating mb-3">
                <FloatingLabel
                    controlId="floatingPassword1"
                    label="Password"
                    className="mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                >
                    {method === "login" && <F.Control type="password" placeholder="Password" required />}

                    {method === "register" && <F.Control type="password" placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required/>}

                    {method === "login" && <F.Control.Feedback type="invalid">Please enter a password</F.Control.Feedback>}

                    {method === "register" &&<F.Control.Feedback type="invalid">Must contain at least one number and one uppercase 
                        and lowercase letter, and at least 8 or more characters</F.Control.Feedback>}
                </FloatingLabel>
            </div>
            {method === "register" && (
                <div id="field" className="form-floating mb-3">
                    <FloatingLabel
                        controlId="floatingPassword2"
                        label="Confirm Password"
                        className="mb-3"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        
                    >
                    <F.Control type="password" placeholder="Confirm Password" isInvalid={password !== password2} required/>
                        <F.Control.Feedback type="invalid">Passwords do not match</F.Control.Feedback>
                    </FloatingLabel>
                </div>
            )}
            <div className='buttonField'>
                <button id='button' class="btn btn-primary" type="submit">{name}</button>
            </div>
            <p id='field'>Forgot Password? <a href='/request/reset'>reset here</a></p>
        </F>
    )
}
export default Form