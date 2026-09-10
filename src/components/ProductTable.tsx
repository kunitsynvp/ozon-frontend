import type {Product} from "../api.ts";

type ProductTableProps = {
    products: Product[];
    onRowClick: (product: Product) => void;
}

export function ProductTable({products, onRowClick}: ProductTableProps) {
    return <table>
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
            products.map(product => {
                return (<tr key={product.product_id}
                            onClick={() => onRowClick(product)}
                >
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
}