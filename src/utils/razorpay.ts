import { Order } from '../types';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export function initiateRazorpayPayment(
  order: Order,
  onSuccess: (paymentId: string) => void,
  onFailure: () => void
) {
  if (!window.Razorpay) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const options: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
    amount: order.total * 100, // paise
    currency: 'INR',
    name: 'Prajapati Mart',
    description: `Order #${order.id}`,
    prefill: {
      name: order.details.name,
      email: order.details.email,
      contact: order.details.phone,
    },
    theme: { color: '#FF6B35' },
    handler: (response: RazorpayResponse) => {
      onSuccess(response.razorpay_payment_id);
    },
    modal: {
      ondismiss: onFailure,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
