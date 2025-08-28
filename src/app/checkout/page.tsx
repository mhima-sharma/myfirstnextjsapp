"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface Address {
  id?: number;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load token and cart from backend
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);

    if (savedToken) {
      fetch("/api/cart", {
        method: "GET",
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setCart(data.cart);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch cart:", err);
          setLoading(false);
        });
    } else {
      setCart([]);
      setLoading(false);
    }
  }, []);

  // ✅ Fetch user addresses
  useEffect(() => {
    if (token) fetchUserAddresses();
  }, [token]);

  const fetchUserAddresses = async () => {
    try {
      const res = await fetch("/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.addresses.length > 0) {
        setAddresses(data.addresses);
        setAddress(data.addresses[data.addresses.length - 1]);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const saveAddress = async () => {
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.pincode) {
      alert("All fields are required!");
      return false;
    }

    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      const data = await res.json();
      if (data.success) {
        await fetchUserAddresses();
        alert("Address saved successfully!");
        return true;
      } else {
        alert(data.message || "Failed to save address");
        return false;
      }
    } catch (err) {
      console.error("Error saving address:", err);
      return false;
    }
  };

  // ✅ Cart operations using backend
  const updateCartBackend = async (payload: any) => {
    if (!token) {
      alert("Please login to update cart!");
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error("Cart operation failed:", err);
    }
  };

  const increaseQty = (id: string) => updateCartBackend({ product_id: id, quantity_change: 1 });
  const decreaseQty = (id: string) => updateCartBackend({ product_id: id, quantity_change: -1 });
  const removeFromCart = (id: string) => updateCartBackend({ product_id: id, remove: true });

  // ✅ Price calculations
  const getDiscountedPrice = (price: number) => price - price * 0.3;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((acc, item) => acc + item.price * 0.3 * item.quantity, 0);
  const platformFee = cart.length > 0 ? 10 : 0;
  const grandTotal = subtotal - totalDiscount + platformFee;

  // ✅ Payment handling
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    const addressSaved = await saveAddress();
    if (!addressSaved) return;

    if (paymentMethod === "COD") {
      alert("Order placed successfully via Cash on Delivery!");
      return;
    }

    const amount = grandTotal;
    const userId = 180002; // Replace with actual logged-in user ID
    const name = address.fullName;
    const email = "user@example.com"; // Replace with actual email
    const phone = address.phone;

    try {
      if (paymentMethod === "RAZORPAY") {
        const res = await fetch("/api/payment/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, userId }),
        });
        const data = await res.json();

        if (data.success) {
          const options = {
            key: data.key,
            amount: data.order.amount,
            currency: data.order.currency,
            name: "Next.js Store",
            description: "Purchase",
            order_id: data.order.id,
            handler: async function (response: any) {
              await fetch("/api/payment/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              alert("Payment successful via Razorpay!");
            },
            prefill: { name, email, contact: phone },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          alert("Failed to initiate Razorpay payment.");
        }
      }

      if (paymentMethod === "EASEBUZZ") {
        const res = await fetch("/api/payment/easebuzz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, userId, name, email, phone }),
        });
        const data = await res.json();

        if (data.success && data.data.payment_link) {
          window.location.href = data.data.payment_link;
        } else {
          alert("Failed to initiate Easebuzz payment.");
        }
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {["Cart", "Delivery", "Payment"].map((label, index) => (
          <div key={label} className="flex flex-col items-center w-full relative">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm ${
                step >= index + 1 ? "bg-[#B39452]" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm mt-2 ${
                step === index + 1 ? "font-semibold text-[#B39452]" : "text-gray-500"
              }`}
            >
              {label}
            </span>
            {index < 2 && (
              <div
                className={`absolute top-3 left-[50%] h-1 w-full ${
                  step > index + 1 ? "bg-[#B39452]" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Cart */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {cart.map((item) => {
                  const discountedPrice = getDiscountedPrice(item.price);
                  return (
                    <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-green-600 font-bold">₹{discountedPrice}</p>
                          <p className="text-gray-400 line-through text-sm">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                          <span className="px-2">{item.quantity}</span>
                          <button onClick={() => increaseQty(item.id)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:bg-gray-100 rounded">
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 mb-2">
                  <span>Discount (30%):</span>
                  <span>- ₹{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Platform Fee:</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Payable:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147]"
                >
                  Proceed to Delivery
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 2: Delivery */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          {addresses.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium">Select Saved Address</label>
              <select
                className="w-full border p-3 rounded-lg mt-2"
                onChange={(e) => {
                  const selected = addresses.find((a) => a.id === Number(e.target.value));
                  if (selected) setAddress(selected);
                }}
              >
                <option value="">Choose an address</option>
                {addresses.map((addr, index) => (
                  <option key={addr.id ?? index} value={addr.id}>
                    {addr.address}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg"
            />
            <input
              type="text"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg"
            />
            <textarea
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              placeholder="Street, City, Pincode"
              rows={3}
              className="w-full border p-3 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
                className="w-full border p-3 rounded-lg"
              />
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                placeholder="Pincode"
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </form>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="px-6 py-2 rounded-lg border hover:bg-gray-800">
              Back
            </button>
            <button onClick={saveAddress} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Save Address
            </button>
            <button onClick={() => setStep(3)} className="px-6 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147]">
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
          <div className="space-y-3">
            {["COD", "RAZORPAY", "EASEBUZZ"].map((method) => (
              <label key={method} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>
                  {method === "COD"
                    ? "Cash on Delivery"
                    : method === "RAZORPAY"
                    ? "Pay via Razorpay"
                    : "Pay via Easebuzz"}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 rounded-lg border hover:bg-gray-800"
            >
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              className="px-6 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147]"
            >
              {paymentMethod === "COD"
                ? "Place Order"
                : paymentMethod === "RAZORPAY"
                ? "Pay with Razorpay"
                : "Pay with Easebuzz"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
