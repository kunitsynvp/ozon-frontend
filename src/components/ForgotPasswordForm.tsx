import {type ChangeEvent, type FormEvent, useState} from "react";
import {forgotPassword} from "../api/api.ts";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState<string>('');
    const [isSent, setIsSent] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setIsSent(true)
        forgotPassword({email})
            .then(console.log)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    return (
        <form className='forgot-password-form' onSubmit={handleSubmit}>
            <label htmlFor='email'>Email:</label>
            <input
                id='email'
                type='email'
                name='email'
                autoComplete='email'
                value={email}
                onChange={handleChange}
            >
            </input>

            {isSent && <p>Письмо отправлено на почту, если оно существует</p>}
            <button
                className="forgot-password-submit-button"
                type='submit'
                disabled={isSent}>
                Восстановить пароль
            </button>
        </form>)
}
