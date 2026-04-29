import { useState, useMemo } from 'react';
import { products, categories, categoryEmojis } from '../data/products';
import { Category } from '../types';
import ProductCard from '../components/ProductCard';
import { useLang } from '../hooks/useLang';

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const { t } = useLang();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameHindi.includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            {t('Groceries at', 'ग्रोसरी')}
            <br />
            <span className="hero-highlight">{t('lightning speed ⚡', 'बिजली की रफ्तार से ⚡')}</span>
          </h1>
          <p>{t('Order now and get delivery in minutes. Fresh products, great prices.', 'अभी ऑर्डर करें और मिनटों में डिलीवरी पाएं। ताज़ा उत्पाद, शानदार कीमतें।')}</p>
          <div className="hero-pills">
            <span>🚀 {t('10-min delivery', '10 मिनट डिलीवरी')}</span>
            <span>✅ {t('Fresh & quality', 'ताज़ा और गुणवत्ता')}</span>
            <span>💸 {t('Best prices', 'सबसे अच्छी कीमतें')}</span>
          </div>
        </div>
        <div className="hero-visual">🛒</div>
      </section>

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('Search for groceries, snacks, beverages…', 'किराना, स्नैक्स, पेय खोजें…')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {/* Categories */}
      <div className="category-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat as Category)}
          >
            {categoryEmojis[cat]} {t(cat, cat === 'All' ? 'सभी' : cat === 'Grocery' ? 'किराना' : cat === 'Dairy' ? 'डेयरी' : cat === 'Snacks' ? 'स्नैक्स' : cat === 'Beverages' ? 'पेय' : 'घरेलू')}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="section-header">
        <h2>{activeCategory === 'All' ? t('All Products', 'सभी उत्पाद') : t(activeCategory, activeCategory)}</h2>
        <span className="count">{filtered.length} {t('items', 'आइटम')}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>😕</span>
          <p>{t('No products found', 'कोई उत्पाद नहीं मिला')}</p>
          <button onClick={() => { setQuery(''); setActiveCategory('All'); }}>
            {t('Clear filters', 'फ़िल्टर साफ़ करें')}
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
