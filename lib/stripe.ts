import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-05-27.dahlia",
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
