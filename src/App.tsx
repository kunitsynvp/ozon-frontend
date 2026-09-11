import {useEffect, useState} from 'react'
import './App.css'
import {type Filters, getProducts, isBackendHealth, type Product} from "./api/api.ts";
import {Pagination} from "./components/Pagination.tsx";
import {ProductModal} from "./components/ProductModal.tsx";
import {FiltersPanel} from "./components/FiltersPanel.tsx";
import {ProductTable} from "./components/ProductTable.tsx";
import {StatusMessage} from "./components/StatusMessage.tsx";
import {ConnectionStatus, type ConnectionStatusType, FetchStatus, type FetchStatusType} from "./types/statuses.ts";
import {ConnectionBadge} from "./components/ConnectionBadge.tsx";

const PAGE_SIZE = 15

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


        return () => {
            clearTimeout(timer)
        }
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

    return (
        <div className="app">
            <h1>Frontend ↔ Backend</h1>
            <ConnectionBadge status={status}/>
            <div className="toolbar">
                <FiltersPanel filters={filters}
                              onChange={(next) => {
                                  setFilters(next)
                                  setCurrentPage(1)
                                }
                              }
                />
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

                <StatusMessage
                    status={fetchStatus}
                    products={products}
                    searchTerm={searchTerm}
                />

                {fetchStatus === FetchStatus.Success && products.length > 0 &&
                    (<>
                        <ProductTable
                            products={pageProducts}
                            onRowClick={setSelectedProduct}
                        />
                        <Pagination
                            page={currentPage}
                            totalPages={totalPages}
                            onPrev={() => setCurrentPage(currentPage - 1)}
                            onNext={() => setCurrentPage(currentPage + 1)}
                        />
                    </>)
                }

            </div>
            {/* Modal — only shows when a product is selected */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>

    )
}

export default App