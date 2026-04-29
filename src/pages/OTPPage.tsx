import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useLang } from '../hooks/useLang';

const RESEND_SECONDS = 30;
const DEMO_OTP = '123456';

export default function OTPPage() {
  const { order, clearCart } = useCartStore();
  const { t } = useLang();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!order) navigate('/checkout');
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    setError('');
    if (val && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      setError(t('Enter all 6 digits', '6 अंक दर्ज करें'));
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    if (entered !== DEMO_OTP) {
      setError(t(`Wrong OTP. (Hint: use ${DEMO_OTP})`, `गलत OTP। (संकेत: ${DEMO_OTP} उपयोग करें)`));
      setLoading(false);
      return;
    }
    clearCart();
    navigate('/tracking');
    setLoading(false);
  };

  const handleResend = () => {
    setTimer(RESEND_SECONDS);
    setOtp(Array(6).fill(''));
    setError('');
    inputs.current[0]?.focus();
  };

  return (
    <div className="otp-page">
      <div className="otp-card glass-card">
        <div className="otp-icon">📱</div>
        <h2>{t('Verify Your Number', 'अपना नंबर वेरिफाई करें')}</h2>
        <p>
          {t(`We've sent a 6-digit OTP to`, 'हमने 6-अंकीय OTP भेजा है')}{' '}
          <strong>{order?.details.phone || '******'}</strong>
        </p>
        <p className="demo-hint">
          💡 {t(`Demo OTP: ${DEMO_OTP}`, `डेमो OTP: ${DEMO_OTP}`)}
        </p>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`otp-input ${error ? 'otp-error' : digit ? 'filled' : ''}`}
            />
          ))}
        </div>

        {error && <p className="err-msg">{error}</p>}

        <button
          className="verify-btn"
          onClick={handleVerify}
          disabled={loading || otp.some((d) => !d)}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            t('Verify & Place Order', 'वेरिफाई करें और ऑर्डर दें')
          )}
        </button>

        <div className="resend-row">
          {timer > 0 ? (
            <span>{t('Resend OTP in', 'OTP फिर भेजें')} <strong>{timer}s</strong></span>
          ) : (
            <button className="resend-btn" onClick={handleResend}>
              🔄 {t('Resend OTP', 'OTP फिर भेजें')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
