import type {Product} from "../api.ts";

type ProductModalProps = {
    product: Product;
    onClose: () => void
}

export function ProductModal({product, onClose}: ProductModalProps) {
    return <div className="modal-overlay">
        <div className="modal">
            <h2>{product.offer_id}</h2>
            <div className="modal-row">
                <span className="modal-label">Product ID</span>
                <span className="modal-value">{product.product_id}</span>
            </div>
            <div className="modal-row">
                <span className="modal-label">SKU</span>
                <span className="modal-value">{product.sku}</span>
            </div>
            <div className="modal-row">
                <span className="modal-label">Archived</span>
                <span className="modal-value">{product.archived ? 'Yes' : 'No'}</span>
            </div>
            <div className="modal-row">
                <span className="modal-label">FBO stocks</span>
                <span className="modal-value">{product.has_fbo_stocks ? 'Yes' : 'No'}</span>
            </div>
            <div className="modal-row">
                <span className="modal-label">FBS stocks</span>
                <span className="modal-value">{product.has_fbs_stocks ? 'Yes' : 'No'}</span>
            </div>
            <div className="modal-row">
                <span className="modal-label">Discounted</span>
                <span className="modal-value">{product.is_discounted ? 'Yes' : 'No'}</span>
            </div>

            <button onClick={onClose}>Close</button>
        </div>

    </div>
}