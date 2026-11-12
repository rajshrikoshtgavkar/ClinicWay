interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key?: string;
  amount: number | string;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (
    response: RazorpayPaymentResponse,
  ) => void | Promise<void>;
  prefill?: {
    name?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
    close: () => void;
  };
}
