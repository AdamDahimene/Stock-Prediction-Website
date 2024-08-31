import {Navigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode"
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect } from 'react';

function ProtectedRoute({children, method}) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthenticated(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            })
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.error(error)
            setIsAuthenticated(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token) {
            setIsAuthenticated(false)
            return;
        }
        const decode = jwtDecode(token)
        const tokenExpiration = decode.exp
        const now = Date.now() / 1000

        if(tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthenticated(true)
        }
    }

    if(method === "NavbarLogin") {
        return isAuthenticated ? null : children;
    } else if(method === "NavbarLogout") {
        return isAuthenticated ? children : null;
    }

    if(isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;