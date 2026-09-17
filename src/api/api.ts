// src/api.ts
// This file holds ALL the HTTP calls. Components import from here.
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
    // ВРЕМЕННО (бэка нет): имитация сети — раскомментируй вместо fetch
    await new Promise(resolve => setTimeout(resolve, 800))   // «сеть» 800 мс
    if (data.email === 'test@mail.ru' && data.password === '123') {
        return {token: 'fake-token'}
    }
    throw new Error('Invalid email or password')

    // TODO (когда будет бэк): fetch POST /api/auth/login
    //   - method: 'POST'
    //   - headers: {'Content-Type': 'application/json'}
    //   - body: JSON.stringify(data)
    //   - проверка response.ok, иначе throw (как в getProducts)

    // const response = await fetch('/api/auth/login', {
    //     method: "POST",
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(data)
    // })
}

export async function register(data: RegisterRequest) {
    await new Promise(resolve => setTimeout(resolve, 800))
    if (data.email === "test@mail.ru" && data.password === '123') {
        return {token: 'fake-register-token'} as const
    }
    throw new Error("This email already exists")
}

export async function forgotPassword({email}: ForgotPasswordRequest): Promise<{ok: boolean}> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {ok: true}
}