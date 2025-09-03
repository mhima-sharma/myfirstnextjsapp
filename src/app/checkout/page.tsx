"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SideAuth from "../sideAuth/page"; // Login modal/component

interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface Address {
  user_id: number;
  id?: number | string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSideAuthOpen, setIsSideAuthOpen] = useState(false);

  const [address, setAddress] = useState<Address>({
    user_id: 0,
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Load token and userId from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj && userObj.id) {
          setUserId(userObj.id);
          setAddress((prev) => ({ ...prev, user_id: userObj.id }));
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);

    // Fetch cart data
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
    return true; // skip API saving
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

    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    // Razorpay Integration
    if (paymentMethod === "RAZORPAY") {
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
            try {
              await fetch("/api/payment/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  full_name: address.fullName,
                  phone: address.phone,
                  address: address.address,
                  city: address.city,
                  pincode: address.pincode,
                  user_id: userId,
                  order_id: response.razorpay_order_id,
                  total: grandTotal,
                  status: "success",
                }),
              });

              router.push("/payment-success");
            } catch (err) {
              console.error("Payment webhook failed:", err);
              router.push("/payment-failed");
            }
          },
          modal: {
            ondismiss: () => {
              router.push("/payment-failed");
            },
          },
          theme: { color: "#B39452" },
        };

        new (window as any).Razorpay(options).open();
      } else {
        router.push("/payment-failed");
      }
    }

    // Easebuzz Integration
    else if (paymentMethod === "EASEBUZZ") {
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
      } else {
        router.push("/payment-failed");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading your cart...
      </div>
    );

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
        <SideAuth isOpen={isSideAuthOpen} onClose={() => setIsSideAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="max-w-3xl bg-grey-600 mx-auto px-4 py-8">
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
                {cart.map((item, index) => {
                  const discountedPrice = getDiscountedPrice(item.price);
                  return (
                    <div
                      key={item.id || index} // <-- Fix for unique key warning
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
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{item.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-semibold">
                          ₹{discountedPrice.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="px-2 bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="px-2 bg-gray-200 rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between font-medium">
                <span>Discount:</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between font-medium">
                <span>Platform Fee:</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-end mt-8">
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
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Back to Cart
            </button>
            <button
              onClick={() => setStep(3)}
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
          <div className="grid grid-cols-1 gap-4">
            {[
              { id: "RAZORPAY", label: "Razorpay", logo: "/razorpay.png" },
              { id: "EASEBUZZ", label: "Easebuzz", logo: "/easebuzz1.png" },
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all duration-200
                  ${
                    paymentMethod === method.id
                      ? "border-[#B39452] bg-[#FFF9F0] shadow-md"
                      : "border-gray-300 bg-white hover:border-[#B39452]/70 hover:bg-[#FFF4E5]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  {method.logo && (
                    <Image
                      src={method.logo}
                      alt={method.label}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  )}
                  <span
                    className={`text-lg font-medium ${
                      paymentMethod === method.id ? "text-[#B39452]" : "text-gray-700"
                    }`}
                  >
                    {method.label}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200
                    ${
                      paymentMethod === method.id
                        ? "border-[#B39452] bg-[#B39452]"
                        : "border-gray-300 bg-white"
                    }`}
                >
                  {paymentMethod === method.id && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Back to Delivery
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={!paymentMethod}
              className={`px-6 py-2 rounded-lg text-white transition ${
                paymentMethod
                  ? "bg-[#B39452] hover:bg-[#9d8147]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
