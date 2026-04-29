import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useLang } from '../hooks/useLang';

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const { lang, toggle, t } = useLang();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">🛒</span>
        <div>
          <div className="brand-name">Prajapati Mart</div>
          <div className="brand-tag">{t('Fast delivery in minutes', 'मिनटों में डिलीवरी')}</div>
        </div>
      </Link>

      <div className="nav-actions">
        <button className="lang-btn" onClick={toggle} title="Toggle language">
          {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
        </button>

        <button className="cart-btn" onClick={() => navigate('/checkout')}>
          <span>🛍️</span>
          <span>{t('Cart', 'कार्ट')}</span>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>
    </nav>
  );
}
