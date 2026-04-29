import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useLang } from '../hooks/useLang';
import { initiateRazorpayPayment } from '../utils/razorpay';
import { fireConfetti } from '../utils/confetti';
import { OrderStatus } from '../types';

const STEPS: { key: OrderStatus; label: string; labelHi: string; icon: string; eta: string }[] = [
  { key: 'placed', label: 'Order Placed', labelHi: 'ऑर्डर दिया', icon: '📋', eta: 'Just now' },
  { key: 'confirmed', label: 'Confirmed', labelHi: 'पुष्टि हुई', icon: '✅', eta: '1 min' },
  { key: 'packed', label: 'Packed', labelHi: 'पैक किया', icon: '📦', eta: '3 mins' },
  { key: 'dispatched', label: 'Out for Delivery', labelHi: 'डिलीवरी पर', icon: '🚴', eta: '7 mins' },
  { key: 'delivered', label: 'Delivered', labelHi: 'डिलीवर हुआ', icon: '🎉', eta: '10 mins' },
];

const STATUS_ORDER: OrderStatus[] = ['placed', 'confirmed', 'packed', 'dispatched', 'delivered'];

export default function TrackingPage() {
  const { order, updateOrderStatus, updateOrderPayment } = useCartStore();
  const { t } = useLang();
  const navigate = useNavigate();
  const [paymentDone, setPaymentDone] = useState(!!order?.paymentId);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }
    // Auto-advance status for demo
    const statuses = STATUS_ORDER.slice(STATUS_ORDER.indexOf(order.status) + 1);
    let delay = 3000;
    const timers: ReturnType<typeof setTimeout>[] = [];
    statuses.forEach((s) => {
      const t = setTimeout(() => updateOrderStatus(s), delay);
      timers.push(t);
      delay += 4000;
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const handlePayment = () => {
    if (!order) return;
    initiateRazorpayPayment(
      order,
      (pid) => {
        updateOrderPayment(pid);
        setPaymentDone(true);
        setPaymentFailed(false);
        fireConfetti();
      },
      () => {
        setPaymentFailed(true);
      }
    );
  };

  if (!order) return null;

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <h1>🚀 {t('Track Your Order', 'अपना ऑर्डर ट्रैक करें')}</h1>
        <p className="order-id">#{order.id}</p>
      </div>

      {/* Status Timeline */}
      <div className="glass-card timeline-card">
        <div className="timeline">
          {STEPS.map((step, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step.key} className={`timeline-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                <div className="step-dot">
                  {done ? <span className="step-icon">{step.icon}</span> : <span className="step-num">{i + 1}</span>}
                </div>
                {i < STEPS.length - 1 && <div className={`step-line ${i < currentIdx ? 'done' : ''}`} />}
                <div className="step-label">
                  <strong>{t(step.label, step.labelHi)}</strong>
                  <small>{step.eta}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="tracking-grid">
        <div className="glass-card">
          <h3>{t('Delivery To', 'डिलीवरी')}</h3>
          <p><strong>{order.details.name}</strong></p>
          <p>{order.details.phone}</p>
          {order.details.deliveryType === 'delivery' ? (
            <p>{order.details.address}, {order.details.pincode}</p>
          ) : (
            <p>🏪 {t('Store Pickup', 'स्टोर पिकअप')}</p>
          )}
        </div>

        <div className="glass-card">
          <h3>{t('Order Summary', 'ऑर्डर सारांश')}</h3>
          {order.items.map((item) => (
            <div key={item.id} className="tracking-item">
              <span>{t(item.name, item.nameHindi)} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="tracking-total">
            <strong>{t('Total', 'कुल')}</strong>
            <strong>₹{order.total}</strong>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="glass-card payment-card">
        {paymentDone ? (
          <div className="payment-success">
            <div className="success-icon">🎉</div>
            <h3>{t('Payment Successful!', 'भुगतान सफल!')}</h3>
            <p className="payment-id">ID: {order.paymentId}</p>
            <p>{t('Thank you for shopping with Prajapati Mart!', 'पजापति मार्ट पर खरीदारी के लिए धन्यवाद!')}</p>
            <Link to="/" className="add-btn large">{t('Shop Again', 'फिर खरीदें')}</Link>
          </div>
        ) : (
          <div className="payment-pending">
            <h3>💳 {t('Complete Payment', 'भुगतान पूरा करें')}</h3>
            <p className="payment-amount">₹{order.total}</p>
            {paymentFailed && (
              <p className="err-msg">
                ⚠️ {t('Payment was cancelled. Try again.', 'भुगतान रद्द हुआ। फिर से कोशिश करें।')}
              </p>
            )}
            <button className="pay-btn" onClick={handlePayment}>
              <img src="https://razorpay.com/favicon.png" alt="Razorpay" width={20} />
              {t('Pay with Razorpay', 'Razorpay से भुगतान करें')}
            </button>
            <p className="pay-secure">🔒 {t('Secured by Razorpay', 'Razorpay द्वारा सुरक्षित')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
