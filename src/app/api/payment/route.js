import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (request) => {
  try {
    const data = await request.json();

    console.log("Received data:", data);

    const price = data.items[0]?.price;

    if (price === undefined || isNaN(price)) {
      return NextResponse.json(
        { error: "Invalid price value." },
        { status: 400 }
      );
    }

    const customer = await stripe.customers.create({
      email: data.email,
      address: {
        city: data.address?.city || "Default City",
        country: data.address?.country || "Default Country",
        line1: data.address?.line1 || "Default Line 1",
        line2: data.address?.line2 || "Default Line 2",
        postal_code: data.address?.postal_code || "00000",
        state: data.address?.state || "Default State",
      },
    });

    const checkOutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?token=${customer.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel?token=${customer.id}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: data.items[0].name,
            },
            unit_amount: Math.round(price * 100),
          },
        },
      ],
      customer: customer.id,
    });

    console.log("Checkout session URL:", checkOutSession.url);

    return NextResponse.json(
      { msg: checkOutSession, url: checkOutSession.url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
