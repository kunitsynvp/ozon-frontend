import type {Product} from "../api/api.ts";
import {FetchStatus, type FetchStatusType} from "../types/statuses.ts";


type StatusMessageProps = {
    status: FetchStatusType
    products: Product[]
    searchTerm: string
}
export function StatusMessage({status, products, searchTerm}: StatusMessageProps) {
    if (status === FetchStatus.Loading) {
        return <p>Loading...</p>
    } else if (status === FetchStatus.Error) {
        return  <p>Something was wrong with fetching products</p>
    } else if (status === FetchStatus.Success && products.length === 0 && searchTerm === '') {
        return <p>No products found</p>
    } else if (status === FetchStatus.Success && products.length === 0 && searchTerm !== '') {
        return <p>No products found by this search term</p>
    } else {
        return null
    }
}