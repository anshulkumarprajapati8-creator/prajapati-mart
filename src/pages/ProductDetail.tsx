import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useLang } from '../hooks/useLang';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLang();
  const { addItem, updateQuantity, items } = useCartStore();

  const product = products.find((p) => p.id === id);
  if (!product) return (
    <div className="not-found">
      <h2>{t('Product not found', 'उत्पाद नहीं मिला')}</h2>
      <Link to="/">{t('Go Home', 'होम पर जाएं')}</Link>
    </div>
  );

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const cartItem = items.find((i) => i.id === product.id);
  const qty = cartItem?.quantity ?? 0;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← {t('Back', 'वापस')}</button>

      <div className="detail-grid">
        {/* Image */}
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.name} />
          {discount > 0 && <span className="discount-badge large">{discount}% {t('OFF', 'छूट')}</span>}
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="product-cat">{product.category}</span>
          <h1>{t(product.name, product.nameHindi)}</h1>
          <p className="detail-unit">{product.unit}</p>

          <div className="detail-rating">
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span className="rating-num">{product.rating}</span>
            <span className="review-count">({product.reviews} {t('reviews', 'समीक्षाएं')})</span>
          </div>

          <p className="detail-desc">{t(product.description, product.descriptionHindi)}</p>

          <div className="detail-price-row">
            <span className="price-current large">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="price-original">₹{product.originalPrice}</span>
                <span className="savings">You save ₹{product.originalPrice - product.price}</span>
              </>
            )}
          </div>

          <div className="delivery-info">
            <span>🚀 {t('Delivery in 10 minutes', '10 मिनट में डिलीवरी')}</span>
            <span>📦 {t('Free pickup available', 'मुफ्त पिकअप उपलब्ध')}</span>
          </div>

          {product.tags && (
            <div className="tag-list">
              {product.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          )}

          {product.inStock ? (
            <div className="detail-cart-actions">
              {qty === 0 ? (
                <button className="add-btn large" onClick={() => addItem(product)}>
                  🛒 {t('Add to Cart', 'कार्ट में जोड़ें')}
                </button>
              ) : (
                <div className="qty-control large">
                  <button onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                </div>
              )}
              {qty > 0 && (
                <Link to="/checkout" className="checkout-link">
                  {t('Go to Checkout →', 'चेकआउट पर जाएं →')}
                </Link>
              )}
            </div>
          ) : (
            <button className="add-btn large" disabled>
              {t('Out of Stock', 'स्टॉक खत्म')}
            </button>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="related-section">
          <h2>{t('Related Products', 'संबंधित उत्पाद')}</h2>
          <div className="product-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
