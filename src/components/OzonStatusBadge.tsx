import {type OzonStatusType} from "../types/statuses.ts";

type OzonStatusProps = {
    status: OzonStatusType;
}

const OzonStatusMapper: Record<OzonStatusType, string> = {
    connected: "Успешно подключено к Ozon API",
    authError: "Ошибка подключения к Ozon API",
    unavailable: "Ozon API пока не доступен, попробуйте позже",
    reconnectionRequired: "Сессия подключения истекла, требуется переподключение"
}

export function OzonStatusBadge({status}: OzonStatusProps) {
    return (
        <p className={`ozon-status ozon-status--${status}`}>
            <span className="ozon-status__dot"/>
            {OzonStatusMapper[status]}
        </p>
    )
}