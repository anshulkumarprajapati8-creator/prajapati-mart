import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore, createOrder } from '../store/cartStore';
import { useLang } from '../hooks/useLang';
import { OrderDetails } from '../types';

const DELIVERY_FEE = 40;

export default function Checkout() {
  const { items, totalPrice, updateQuantity, removeItem, setOrder, clearCart } = useCartStore();
  const { t } = useLang();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [form, setForm] = useState<OrderDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    deliveryType: 'delivery',
  });
  const [errors, setErrors] = useState<Partial<OrderDetails>>({});

  const subtotal = totalPrice();
  const deliveryCharge = deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryCharge;

  const validate = () => {
    const e: Partial<OrderDetails> = {};
    if (!form.name.trim()) e.name = t('Required', 'आवश्यक');
    if (!/^\d{10}$/.test(form.phone)) e.phone = t('Enter valid 10-digit phone', '10 अंकों का फ़ोन नंबर दर्ज करें');
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t('Enter valid email', 'सही ईमेल दर्ज करें');
    if (deliveryType === 'delivery' && !form.address.trim()) e.address = t('Required', 'आवश्यक');
    if (deliveryType === 'delivery' && !/^\d{6}$/.test(form.pincode)) e.pincode = t('Enter 6-digit pincode', '6 अंकों का पिनकोड दर्ज करें');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (items.length === 0) return;
    if (!validate()) return;
    const order = createOrder(items, { ...form, deliveryType }, total);
    setOrder(order);
    navigate('/otp');
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>{t('Your cart is empty', 'आपकी कार्ट खाली है')}</h2>
        <p>{t('Add some items to get started', 'शुरू करने के लिए कुछ आइटम जोड़ें')}</p>
        <Link to="/" className="add-btn large">{t('Shop Now', 'अभी खरीदें')}</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>🛒 {t('Checkout', 'चेकआउट')}</h1>

      <div className="checkout-grid">
        {/* Left: Form */}
        <div className="checkout-form-col">
          {/* Delivery Toggle */}
          <div className="glass-card">
            <h3>{t('Delivery Method', 'डिलीवरी तरीका')}</h3>
            <div className="delivery-toggle">
              <button
                className={deliveryType === 'delivery' ? 'active' : ''}
                onClick={() => setDeliveryType('delivery')}
              >
                🚀 {t('Home Delivery', 'होम डिलीवरी')}
                <small>₹{DELIVERY_FEE} {t('fee', 'शुल्क')}</small>
              </button>
              <button
                className={deliveryType === 'pickup' ? 'active' : ''}
                onClick={() => setDeliveryType('pickup')}
              >
                🏪 {t('Store Pickup', 'स्टोर पिकअप')}
                <small>{t('FREE', 'मुफ्त')}</small>
              </button>
            </div>
          </div>

          {/* User Form */}
          <div className="glass-card">
            <h3>{t('Your Details', 'आपकी जानकारी')}</h3>
            <div className="form-grid">
              <div className="field">
                <label>{t('Full Name', 'पूरा नाम')} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ramesh Prajapati"
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className="field">
                <label>{t('Phone', 'फ़ोन')} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  maxLength={10}
                />
                {errors.phone && <span className="err">{errors.phone}</span>}
              </div>
              <div className="field full">
                <label>{t('Email', 'ईमेल')} *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ramesh@example.com"
                />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              {deliveryType === 'delivery' && (
                <>
                  <div className="field full">
                    <label>{t('Address', 'पता')} *</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder={t('House no, Street, Area', 'मकान नंबर, गली, क्षेत्र')}
                      rows={3}
                    />
                    {errors.address && <span className="err">{errors.address}</span>}
                  </div>
                  <div className="field">
                    <label>{t('Pincode', 'पिनकोड')} *</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="121001"
                      maxLength={6}
                    />
                    {errors.pincode && <span className="err">{errors.pincode}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary-col">
          <div className="glass-card summary-card">
            <h3>{t('Order Summary', 'ऑर्डर सारांश')}</h3>
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-unit">{item.unit}</p>
                    <div className="qty-control small">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <span className="cart-item-price">₹{item.price * item.quantity}</span>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-lines">
              <div className="summary-line">
                <span>{t('Subtotal', 'उप-योग')}</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-line">
                <span>{t('Delivery', 'डिलीवरी')}</span>
                <span className={deliveryCharge === 0 ? 'free' : ''}>
                  {deliveryCharge === 0 ? t('FREE', 'मुफ्त') : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="summary-line total">
                <span>{t('Total', 'कुल')}</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button className="checkout-submit-btn" onClick={handleSubmit}>
              {t('Proceed to Verify OTP', 'OTP वेरिफाई करें')} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
