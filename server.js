require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { product, size, color, quantity } = req.body;

    // Map product names to Stripe Price IDs
    const priceMap = {
      "Fleece Crew": "prod_Td4mQjZIb6Zh7J",     // ✅ Replace with actual Price ID
      "Shorts": "prod_Td4ma8CCP24h5G",            // ✅ Replace with actual Price ID
      "Hoodie": "prod_Td4kKE08K02e86",            // ✅ Replace with actual Price ID
      "T-Shirt": "prod_Tc0JleaXuAeba9",           // ✅ Replace with actual Price ID
      "Bracelet": "prod_TdRIjkl7JI2BEe",        // ✅ Replace with actual Price ID
      "Coaster": "prod_TdRIfuxgt9ahcl",          // ✅ Replace with actual Price ID
      "Cup": "prod_TdRKVgOjr39820",                  // ✅ Replace with actual Price ID
    };

    const selectedPrice = priceMap[product];

    if (!selectedPrice) {
      throw new Error("Invalid product selected.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: selectedPrice,
          quantity: Number(quantity || 1),
        },
      ],
      metadata: {
        product,
        size,
        color,
      },
      success_url: "http://localhost:5500/success.html",
      cancel_url: "http://localhost:5500/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => {
  console.log("✅ Server running on http://localhost:4242");
});
