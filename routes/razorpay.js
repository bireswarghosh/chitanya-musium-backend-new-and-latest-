const express = require('express');
const Razorpay = require("razorpay");
const router = express.Router(); 

const razorpay = new Razorpay({
  key_id: 'rzp_live_RkF1Uzk5QpuC1K',
  key_secret: 'HuUa2dBGIeaUrhm5TkHWWswp'
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const parsedAmount = Math.round(Number(amount) * 100);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    const order = await razorpay.orders.create({
      amount: parsedAmount, // paisa
      currency: "INR",
      receipt: "museum_receipt_" + Date.now()
    });

    res.json({
      ...order,
      key_id: 'rzp_live_RkF1Uzk5QpuC1K'
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;
