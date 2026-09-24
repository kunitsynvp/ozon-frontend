
import {OzonStatus, type OzonStatusType} from "../types/statuses.ts";

export type Filters = {
    hasFbo: boolean
    hasFbs: boolean
    archived: boolean
    isDiscounted: boolean
}

export type Product = {
    product_id: number
    offer_id: string
    sku: number
    archived: boolean
    has_fbo_stocks: boolean
    has_fbs_stocks: boolean
    is_discounted: boolean
}

export type ProductsResponse = {
    items: Product[]
    last_id: string
    limit: number
}

export type LoginRequest = {
    email: string
    password: string
}

export type AuthResponse = {
    token: string
}

export type RegisterRequest = {
    email: string
    password: string
}
export type ForgotPasswordRequest = {
    email: string
}


export async function getProducts(filters: Filters, search?: string): Promise<ProductsResponse> {

    const params = new URLSearchParams()

    if (search) {
        params.set('search', search)
    }
    if (filters?.hasFbo) params.set('hasFbo', 'true')
    if (filters?.hasFbs) params.set('hasFbs', 'true')
    if (filters?.archived) params.set('archived', 'true')
    if (filters?.isDiscounted) params.set('isDiscounted', 'true')

    const url = `/api/ozon/products?${params}`
    console.log(`Fetching ${url}`)

    const response = await fetch(url)
    if(!response.ok) {
        throw new Error("Failed to fetch the products response")
    }

    return response.json()
}

export async function isBackendHealth(): Promise<boolean> {
    const response = await fetch('/api/health')
    return response.ok
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800))   // «сеть» 800 мс
    if (data.email === 'test@mail.ru' && data.password === '123') {
        return {token: 'fake-token'}
    }
    throw new Error('Invalid email or password')

    // const response = await fetch('/api/auth/login', {
    //     method: "POST",
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(data)
    // })
}

export async function register(data: RegisterRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))
    if (data.email === "test@mail.ru") {
        throw new Error("This email already registered")
    }
    return
}

export async function forgotPassword({email}: ForgotPasswordRequest): Promise<{ok: boolean}> {
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log("Sent email to: ", email)
    return {ok: true}
}

// api/api.ts — добавь:
export type OzonCredentials = {
    clientId: string
    apiKey: string
}

export async function connectOzon(creds: OzonCredentials): Promise<OzonStatusType> {
    await new Promise(resolve => setTimeout(resolve, 800))
    switch (creds.clientId) {
        case 'bad':
            return OzonStatus.AuthError
        case 'down':
            return OzonStatus.Unavailable
        case 'stale':
            return OzonStatus.ReconnectionRequired
        default:
            return OzonStatus.Connected
    }
}