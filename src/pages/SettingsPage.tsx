import {useState, type ChangeEvent, type FormEvent} from "react";
import {connectOzon, type OzonCredentials} from "../api/api.ts";
import {OzonStatusBadge} from "../components/OzonStatusBadge.tsx";
import {type OzonStatusType} from "../types/statuses.ts";

export function SettingsPage() {
    const [{clientId, apiKey}, setCredentials] = useState<OzonCredentials>({
        clientId: '',
        apiKey: '',
    })
    const [isLoading, setIsLoading] = useState(false);
    const [ozonStatus, setOzonStatus] = useState<OzonStatusType | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredentials({clientId, apiKey, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setIsLoading(true)
        connectOzon({ clientId, apiKey})
            .then(status => {
                setOzonStatus(status)
            })
            .catch(console.error)
            .finally(() => { setIsLoading(false) })

    }

    return (
        <div>
            <h2>Настройки магазина</h2>
            <form className="settings-form" onSubmit={handleSubmit}>
                <label htmlFor="clientId">Client ID</label>
                <input
                    type="text"
                    id="clientId"
                    name="clientId"
                    value={clientId}
                    onChange={handleChange}
                />

                <label htmlFor="apiKey">API Key</label>
                <input
                    type="password"
                    id="apiKey"
                    name="apiKey"
                    value={apiKey}
                    onChange={handleChange}
                />
                <button type="submit" disabled={isLoading}>
                    Проверить подключение
                </button>
                {ozonStatus && <OzonStatusBadge status={ozonStatus}/>}
            </form>

        </div>
    )
}