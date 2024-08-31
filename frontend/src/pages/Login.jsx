import Form from '../components/Form'
import NavBar from '../components/NavBar'

import '../styles/Login.css'


function Login() {
    return (
        <div className='LoginPage'>
            <NavBar />
            <Form route="/api/token/" method="login" />
        </div>
)}

export default Login