const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_ncLX6jH3XUFMP5",
  key_secret: "KbQRmzji0xPvuY7fjJ9uzWhx",
});

const checkout = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // Added receipt ID
    };

    const order = await instance.orders.create(options);

    console.log("Order Created:", order); // ✅ Log order details

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error in Checkout:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const paymentVerification = async (req, res) => {
  try {
    console.log("Payment Verification Triggered"); // ✅ Log for debugging

    const { razorpayOrderId, razorpayPaymentId } = req.body;

    // Ensure both IDs are received
    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    res.status(200).json({
      success: true,
      razorpayOrderId,
      razorpayPaymentId,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkout,
  paymentVerification,
};
