import {createContext, type ReactNode, useContext, useState} from "react";

type AuthContextType = {
    token : string | null
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: ReactNode}) {

    const [token, setToken] = useState(() => localStorage.getItem('token'))

    const login = (token: string ) => {
        setToken(token)
        localStorage.setItem('token', token)
    }

    const logout = () => {
        setToken(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)

    if(ctx === null) {
        throw new Error('useAuth вне AuthProvider')
    }
    return ctx
}