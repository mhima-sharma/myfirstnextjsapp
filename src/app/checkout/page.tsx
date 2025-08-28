"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SideAuth from "../sideAuth/page"; // Import your login modal/component

interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface Address {
  id?: number | string;
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
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSideAuthOpen, setIsSideAuthOpen] = useState(false); // Control login modal

  // Load token and cart
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const userObj = JSON.parse(storedUser); // ✅ Corrected 'const'
    console.log(userObj, "local");
    if (userObj.id) {
      setUserId(userObj.id); // ✅ Set the userId state
    }
  }

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);

    fetch("/api/cart", {
      method: "GET",
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCart(data.cart);
        if (data.userId) setUserId(data.userId);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch addresses
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
      console.error(err);
    }
  };

  const validateAddress = (addr: Address): boolean => {
    return !!(
      addr.fullName &&
      addr.phone &&
      addr.address &&
      addr.city &&
      addr.pincode
    );
  };

  const saveAddress = async (): Promise<boolean> => {
    if (!validateAddress(address)) {
      alert("All address fields are required!");
      return false;
    }

    if (address.id != null) return true;

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
        return true;
      } else {
        alert(data.message || "Failed to save address");
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

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
      console.error(err);
    }
  };

  const increaseQty = (id: string) =>
    updateCartBackend({ product_id: id, quantity_change: 1 });
  const decreaseQty = (id: string) =>
    updateCartBackend({ product_id: id, quantity_change: -1 });
  const removeFromCart = (id: string) =>
    updateCartBackend({ product_id: id, remove: true });

  const getDiscountedPrice = (price: number) => price - price * 0.3;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce(
    (acc, item) => acc + item.price * 0.3 * item.quantity,
    0
  );
  const platformFee = cart.length > 0 ? 10 : 0;
  const grandTotal = subtotal - totalDiscount + platformFee;

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    const addressSaved = await saveAddress();
    if (!addressSaved) return;

    await fetchUserAddresses();

    if (paymentMethod === "COD") {
      alert("Order placed successfully with Cash on Delivery!");
    } else if (paymentMethod === "RAZORPAY") {

      const res = await fetch("/api/payment/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, userId }),
      });
      const data = await res.json();
      if (data.success) {
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: "INR",
          name: "Next.js Store",
          order_id: data.order.id,
          handler: async (response: any) => {
            await fetch("/api/payment/webhook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                status: "success",
              }),
            });
            alert("Payment successful via Razorpay!");
          },
        };
        new (window as any).Razorpay(options).open();
      }
    } else if (paymentMethod === "EASEBUZZ") {
      const res = await fetch("/api/payment/easebuzz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          userId,
          name: address.fullName,
          email: "test@example.com",
          phone: address.phone,
        }),
      });
      const data = await res.json();
      if (data.success && data.data.payment_request) {
        window.location.href = data.data.payment_request.longurl;
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading your cart...
      </div>
    );

  // If user NOT logged in, show login prompt (like NavBar)
  if (!token && !loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h2 className="text-xl font-semibold mb-4">
            Please log in to proceed with checkout
          </h2>
          <button
            onClick={() => setIsSideAuthOpen(true)}
            className="px-6 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147]"
          >
            Sign In
          </button>
        </div>

        {/* Your login modal/component */}
        <SideAuth isOpen={isSideAuthOpen} onClose={() => setIsSideAuthOpen(false)} />
      </>
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
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b pb-3"
                    >
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
                          <p className="text-green-600 font-bold">
                            ₹{discountedPrice}
                          </p>
                          <p className="text-gray-400 line-through text-sm">
                            ₹{item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-500 hover:bg-gray-100 rounded"
                      >
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
                value={address.id ?? ""}
                onChange={(e) => {
                  const selected = addresses.find(
                    (a) => a.id === Number(e.target.value)
                  );
                  if (selected) setAddress(selected);
                }}
              >
                <option value="">Choose an address</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
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
            <input
              type="text"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              placeholder="Address"
              className="w-full border p-3 rounded-lg"
            />
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
          </form>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              Back to Cart
            </button>
            <button
              onClick={() => {
                if (validateAddress(address)) setStep(3);
                else alert("Please fill all address fields");
              }}
              className="px-6 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147]"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>

          <div className="flex flex-col gap-4">
            {["COD", "RAZORPAY", "EASEBUZZ"].map((method) => (
              <label
                key={method}
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 ${
                  paymentMethod === method ? "border-[#B39452]" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              Back to Delivery
            </button>
            <button
              onClick={handlePlaceOrder}
              className="px-6 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147]"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
