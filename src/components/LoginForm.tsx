// src/components/LoginForm.tsx
import {type ChangeEvent, type FormEvent, useState} from 'react'
import {login as loginInBackend, type LoginRequest} from "../api/api.ts";
import {useAuth} from "../auth/AuthContext.tsx";
import {useNavigate} from "react-router-dom";


export function LoginForm() {
    const { login } = useAuth()
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        loginInBackend(formData)
            .then(response => {
                login(response.token)
                navigate('/', {replace: true})
            })
            .catch(error => {
                setError(error instanceof Error ? error.message : "Что-то пошло не так")
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
            />

            {error && <p className="auth-form__error">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
            >{isLoading ? 'Входим...' : 'Войти'}
            </button>
        </form>
    )
}

