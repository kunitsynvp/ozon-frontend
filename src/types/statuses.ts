export const ConnectionStatus = {
    Checking: 'checking',
    Connected: 'connected',
    Disconnected: 'disconnected',
} as const

export type ConnectionStatusType = typeof ConnectionStatus[keyof typeof ConnectionStatus]

export const FetchStatus = {
    Loading: 'loading',
    Error: 'error',
    Success: 'success',
} as const

export type FetchStatusType = typeof FetchStatus[keyof typeof FetchStatus]

