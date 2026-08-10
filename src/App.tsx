import {useEffect, useState} from 'react'
import './App.css'
import {type Filters, getProducts, isBackendHealth, type Product} from "./api.ts";

const ConnectionStatus = {
    Checking: 'checking',
    Connected: 'connected',
    Disconnected: 'disconnected',
} as const

type ConnectionStatusType = typeof ConnectionStatus[keyof typeof ConnectionStatus]

type ConnectionStatusFields = { text: string }

const FetchStatus = {
    Loading: 'loading',
    Error: 'error',
    Success: 'success',
} as const

type FetchStatusType = typeof FetchStatus[keyof typeof FetchStatus]

const ConnectionStatusMapper: Record<ConnectionStatusType, ConnectionStatusFields> = {
    checking: {text: "Checking..."},
    connected: {text: "Successfully connected to backend"},
    disconnected: {text: "Failed to connect to backend"},
}
const PAGE_SIZE = 15   // constant, not state (never changes)

function App() {
    const [filters, setFilters] = useState<Filters>({
        hasFbo: false,
        hasFbs: false,
        archived: false,
        isDiscounted: false,
    })
    const [status, setStatus] = useState<ConnectionStatusType>(ConnectionStatus.Checking)
    const [products, setProducts] = useState<Product[]>([])
    const [fetchStatus, setFetchStatus] = useState<FetchStatusType>(FetchStatus.Loading)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

// Derived — computed every render
    const totalPages = Math.ceil(products.length / PAGE_SIZE)
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const pageProducts = products.slice(start, end)

    useEffect(() => {
        const timer = setTimeout(() => {
            setFetchStatus(FetchStatus.Loading)
            getProducts(filters, searchTerm)
                .then(productsResponse => {
                    setProducts(productsResponse.items)
                    setFetchStatus(FetchStatus.Success)
                })
                .catch(error => {
                    console.error(error)
                    setFetchStatus(FetchStatus.Error)
                })
        }, 300)


        return () => clearTimeout(timer)
    }, [searchTerm, filters])

    useEffect(() => {
        isBackendHealth()
            .then((isHealth) => {
                setStatus(isHealth ? ConnectionStatus.Connected : ConnectionStatus.Disconnected)
            })
            .catch((error) => {
                console.error("Failed to fetch health status: ", error)
                setStatus(ConnectionStatus.Disconnected)
            })
    }, [])

    let content
    if (fetchStatus === FetchStatus.Loading) {
        content = <p>Loading...</p>
    } else if (fetchStatus === FetchStatus.Error) {
        content = <p>Something was wrong with fetching products</p>
    } else if (fetchStatus === FetchStatus.Success && products.length === 0 && searchTerm === '') {
        content = <p>No products found</p>
    } else if (fetchStatus === FetchStatus.Success && products.length === 0 && searchTerm !== '') {
        content = <p>No products found by this search term</p>
    } else {
        content = <>
            <table>
                <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Offer ID</th>
                    <th>sku</th>
                    <th>Archived</th>
                    <th>Has FBO stocks</th>
                    <th>Has FBS stocks</th>
                    <th>Is discounted</th>
                </tr>
                </thead>
                <tbody>
                {
                    pageProducts.map(product => {
                        return (<tr key={product.product_id}
                                    onClick={() => {
                                        setSelectedProduct(product)
                                    }}>
                            <td>{product.product_id}</td>
                            <td>{product.offer_id}</td>
                            <td>{product.sku}</td>
                            <td>{product.archived ? "Yes" : "No"}</td>
                            <td>{product.has_fbo_stocks ? "Yes" : "No"}</td>
                            <td>{product.has_fbs_stocks ? "Yes" : "No"}</td>
                            <td>{product.is_discounted ? "Yes" : "No"}</td>
                        </tr>)
                    })
                }
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}        // ← can't go before page 1
                >
                    Previous
                </button>

                <span>Page {currentPage} of {totalPages}</span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}  // ← can't go past last page
                >
                    Next
                </button>
            </div>
        </>

    }

    return (
        <div className="app">
            <h1>Frontend ↔ Backend</h1>
            <p className={`status status--${status}`}>
                <span className="status__dot"/>
                {ConnectionStatusMapper[status].text}
            </p>
            <div className="toolbar">
                <div className="filters">
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.hasFbo}
                            onChange={() => {
                                setFilters({...filters, hasFbo: !filters.hasFbo})
                                setCurrentPage(1)
                            }}
                        />
                        FBO stocks
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.hasFbs}
                            onChange={() => {
                                setFilters({...filters, hasFbs: !filters.hasFbs})
                                setCurrentPage(1)
                            }}
                        />
                        FBS stocks
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.archived}
                            onChange={() => {
                                setFilters({...filters, archived: !filters.archived})
                                setCurrentPage(1)
                            }}
                        />
                        Archived
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.isDiscounted}
                            onChange={() => {
                                setFilters({...filters, isDiscounted: !filters.isDiscounted})
                                setCurrentPage(1)
                            }}
                        />
                        Is discounted
                    </label>
                </div>
                <input
                    className="search-box"
                    type="text"
                    placeholder="Search by offer_id, product_id or sku"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                />
            </div>
            <div className="table-container">
                {content}
            </div>
            {/* Modal — only shows when a product is selected */}
            {selectedProduct && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{selectedProduct.offer_id}</h2>
                        <div className="modal-row">
                            <span className="modal-label">Product ID</span>
                            <span className="modal-value">{selectedProduct.product_id}</span>
                        </div>
                        <div className="modal-row">
                            <span className="modal-label">SKU</span>
                            <span className="modal-value">{selectedProduct.sku}</span>
                        </div>
                        <div className="modal-row">
                            <span className="modal-label">Archived</span>
                            <span className="modal-value">{selectedProduct.archived ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="modal-row">
                            <span className="modal-label">FBO stocks</span>
                            <span className="modal-value">{selectedProduct.has_fbo_stocks ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="modal-row">
                            <span className="modal-label">FBS stocks</span>
                            <span className="modal-value">{selectedProduct.has_fbs_stocks ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="modal-row">
                            <span className="modal-label">Discounted</span>
                            <span className="modal-value">{selectedProduct.is_discounted ? 'Yes' : 'No'}</span>
                        </div>

                        <button onClick={() => setSelectedProduct(null)}>Close</button>
                    </div>

                </div>
            )}
        </div>

    )
}

export default App