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

// A reusable function that fetches products.
// The component will call this instead of writing fetch() itself.
//
// It returns a Promise<ProductsResponse> — a promise that resolves
// to the product data. Promises are like "I'll give you the answer later."
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