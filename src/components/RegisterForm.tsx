import {type ChangeEvent, useState} from "react";
import {register} from "../api/api.ts";

type RegisterFormData = {
    email: string,
    password: string,
    password2: string,
}

export function RegisterForm() {
    const [registrationData, setRegistrationData] = useState<RegisterFormData>({
        email: "",
        password: "",
        password2: "",
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(registrationData.password !== registrationData.password2) {
            console.log("password", registrationData.password, "password2", registrationData.password2)
            setError("Пароли не совпадают")
            return
        }
        setIsLoading(true)
        setError(null)
        register({email: registrationData.email, password: registrationData.password})
            .then(response => {
                console.log(response)
            })
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "Something went wrong"
                setError(errorMessage)
            })
            .finally(() => setIsLoading(false))
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegistrationData({...registrationData, [e.target.name]: e.target.value})
    }
    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input id="email"
                   type="email"
                   name="email"
                   placeholder="you@example.com"
                   autoComplete="email"
                   value={registrationData.email}
                   onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <input id="password"
                   name="password"
                   type="password"
                   autoComplete="current-password"
                   value={registrationData.password}
                   onChange={handleChange}
            />

            <label htmlFor="password2">Duplicate password</label>
            <input id="password2"
                   name="password2"
                   type="password"
                   autoComplete="current-password"
                   value={registrationData.password2}
                   onChange={handleChange}
            />

            {error && <p className="register-form__error">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
            >{isLoading? "Регистрируемся" : "Зарегистрироваться"}</button>
        </form>
    )
}