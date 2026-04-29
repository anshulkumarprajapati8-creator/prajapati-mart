import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useLang } from '../hooks/useLang';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, updateQuantity, items } = useCartStore();
  const { t } = useLang();

  const cartItem = items.find((i) => i.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <Link to={`/product/${product.id}`} className="product-img-link">
        <div className="product-img-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
          {discount > 0 && <span className="discount-badge">{discount}% {t('OFF', 'छूट')}</span>}
          {!product.inStock && <div className="oos-overlay">{t('Out of Stock', 'स्टॉक नहीं')}</div>}
        </div>
      </Link>

      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{t(product.name, product.nameHindi)}</h3>
        </Link>
        <p className="product-unit">{product.unit}</p>

        <div className="product-rating">
          {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          <span>({product.reviews})</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-current">₹{product.price}</span>
            {product.originalPrice && (
              <span className="price-original">₹{product.originalPrice}</span>
            )}
          </div>

          {product.inStock ? (
            qty === 0 ? (
              <button className="add-btn" onClick={() => addItem(product)}>
                {t('Add', 'जोड़ें')}
              </button>
            ) : (
              <div className="qty-control">
                <button onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
                <span>{qty}</span>
                <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
              </div>
            )
          ) : (
            <button className="add-btn" disabled>{t('Notify', 'सूचित करें')}</button>
          )}
        </div>
      </div>
    </div>
  );
}
