import {useEffect, useState} from 'react'
import './App.css'
import {isBackendHealth} from "./api/api.ts";
import {ConnectionStatus, type ConnectionStatusType} from "./types/statuses.ts";
import {ConnectionBadge} from "./components/ConnectionBadge.tsx";
import {Link, Navigate, Route, Routes} from "react-router-dom";
import {ProductsPage} from "./pages/ProductsPage.tsx";
import {LoginPage} from "./pages/LoginPage.tsx";
import {ForgotPasswordPage} from "./pages/ForgotPasswordPage.tsx";
import {RegisterPage} from "./pages/RegisterPage.tsx";
import {useAuth} from "./auth/AuthContext.tsx";
import {SettingsPage} from "./pages/SettingsPage.tsx";


function App() {

    const [status, setStatus] = useState<ConnectionStatusType>(ConnectionStatus.Checking)
    const {token, logout} = useAuth();

    useEffect(() => {
        isBackendHealth()
            .then((isHealth) => {
                setStatus(isHealth ? ConnectionStatus.Connected : ConnectionStatus.Disconnected)
            })
            .catch((error) => {
                console.error("Failed to fetch health status: ", error)
                setStatus(ConnectionStatus.Disconnected)
            })
    }, [])


    return (
        <div className="app">
            <h1>Frontend ↔ Backend</h1>
            <ConnectionBadge status={status}/>

            <nav className="nav">
                <Link to="/">Товары</Link>
                {token
                    ? <button type="button" onClick={logout}>Выйти</button>
                    : <Link to="/login">Войти</Link>}
                <Link to="/register">Регистрация</Link>
                <Link to="/forgot-password">Забыли пароль?</Link>
                {token && <Link to="/settings">Настройки</Link>}
            </nav>

            <Routes>
                <Route path="/" element={
                   token ? <ProductsPage/> : <Navigate to="/login" replace={true}/>
                } />
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/settings" element={
                    token ? <SettingsPage/> : <Navigate to="/login" replace/>
                }/>

            </Routes>

        </div>

    )
}

export default App