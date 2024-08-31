import React from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import About from "./pages/About"
import Stocks from "./pages/Stocks"
import Portfolio from "./pages/Portfolio"
import History from "./pages/History"
import ProtectedRoute from "./components/ProtectedRoute"
import Request from "./pages/Request"
import Reset from "./pages/Reset"

import 'bootstrap/dist/css/bootstrap.min.css';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function LoginAndLogout() {
  localStorage.clear()
  return <Login />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/stocks" element={
          <ProtectedRoute>
            <Stocks />
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/login" element={<LoginAndLogout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/request/reset" element={<Request />} />
        <Route path="/reset/:token" element={<Reset />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
