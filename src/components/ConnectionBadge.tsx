import type {ConnectionStatusType} from "../types/statuses.ts";


const ConnectionStatusMapper: Record<ConnectionStatusType, { text: string }> = {
    checking: {text: "Checking..."},
    connected: {text: "Successfully connected to backend"},
    disconnected: {text: "Failed to connect to backend"},
}

type ConnectionBadgeProps = {
    status: ConnectionStatusType
}

export function ConnectionBadge({status}: ConnectionBadgeProps) {
    return <p className={`status status--${status}`}>
        <span className="status__dot"/>
        {ConnectionStatusMapper[status].text}
    </p>
}