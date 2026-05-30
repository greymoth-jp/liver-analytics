import Stripe from "stripe";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
  }
  return _stripe;
}
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) { return getStripe()[prop as keyof Stripe]; },
});

export async function createCheckoutSession({
  customerId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string;
  email?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    subscription_data: {
      description: "LiverAnalytics — 自動継続課金。いつでもキャンセル可能。",
    },
    locale: "ja",
  };

  if (customerId) {
    params.customer = customerId;
  } else if (email) {
    params.customer_email = email;
  }

  return stripe.checkout.sessions.create(params);
}

export async function createCustomerPortal({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
