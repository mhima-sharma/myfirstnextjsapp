// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { FaStar, FaLock, FaShippingFast, FaUndoAlt, FaHeadset } from "react-icons/fa";
// import NavBar from "../navbar/page";
// import Footer from "../footer/page";
// import Image from "next/image";

// export default function ProductDetails() {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [product, setProduct] = useState<any>(null);
//   const [cart, setCart] = useState<any[]>([]);
//   const [token, setToken] = useState<string | null>(null);
//   const [popupMessage, setPopupMessage] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [shouldRefresh, setShouldRefresh] = useState(false);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const productId = searchParams.get("productId");

//   const isLoggedIn = !!token;

//   // Load token on mount
//   useEffect(() => {
//     const t = localStorage.getItem("token");
//     setToken(t);
//     if (t) fetchCart(t);
//   }, []);

//   // Fetch cart
//   const fetchCart = async (authToken: string) => {
//     try {
//       const res = await fetch("/api/cart", {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       const data = await res.json();
//       if (data.success) setCart(data.cart);
//     } catch (err) {
//       console.error("Failed to fetch cart:", err);
//     }
//   };

//   // Fetch product details
//   const fetchProduct = async () => {
//     if (!productId) return;
//     try {
//       const res = await fetch(`/api/products/${productId}`);
//       const data = await res.json();
//       if (data.success) {
//         const images = Array.isArray(data.product.images)
//           ? data.product.images
//           : data.product.images
//           ? data.product.images.split(",")
//           : [];
//         setProduct({ ...data.product, images });
//         setQuantity(1);
//       } else {
//         setPopupMessage("Product not found");
//       }
//     } catch (err) {
//       console.error(err);
//       setPopupMessage("Error fetching product");
//     }
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [productId]);

//   // Increase quantity
//   const increaseQuantity = () => {
//     if (!product) return;
//     if (quantity < product.quantity) {
//       setQuantity((prev) => prev + 1);
//     }
//   };

//   // Decrease quantity
//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity((prev) => prev - 1);
//   };

//   // Update product stock after purchase/cart update
//   const updateProductStock = async (updatedQty: number) => {
//     try {
//       await fetch(`/api/products/${product.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ quantity: updatedQty }),
//       });
//       await fetchProduct();
//     } catch (err) {
//       console.error("Failed to update stock:", err);
//     }
//   };

//   // Add to cart
//   const handleAddToCart = async () => {
//     if (!isLoggedIn) {
//       setPopupMessage("Please login to add items to cart!");
//       setShouldRefresh(false);
//       return;
//     }
//     if (!product) return;

//     if (quantity > product.quantity) {
//       setPopupMessage("Not enough stock available!");
//       setShouldRefresh(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ product_id: product.id, quantity }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setPopupMessage(`${product.name} added to cart!`);
//         setShouldRefresh(true);

//         // Reduce available stock instantly
//         const updatedQty = product.quantity - quantity;
//         await updateProductStock(updatedQty);
//       } else {
//         setPopupMessage(data.message || "Failed to add to cart");
//         setShouldRefresh(false);
//       }
//     } catch (err) {
//       console.error(err);
//       setPopupMessage("Error adding to cart");
//       setShouldRefresh(false);
//     }
//   };

//   // Buy now
//   const handleBuyNow = async () => {
//     if (!isLoggedIn) {
//       setPopupMessage("Please login first to purchase items!");
//       setShouldRefresh(false);
//       return;
//     }
//     if (!product) return;

//     if (quantity > product.quantity) {
//       setPopupMessage("Not enough stock available!");
//       setShouldRefresh(false);
//       return;
//     }

//     const updatedQty = product.quantity - quantity;
//     await updateProductStock(updatedQty);

//     router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
//   };

//   // Close popup
//   const handlePopupClose = () => {
//     setPopupMessage(null);
//     router.refresh();
//   };

//   if (!product) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//         <NavBar />
//         <p className="text-center mt-20 text-lg">Loading product...</p>
//         <Footer />
//       </div>
//     );
//   }

//   const mainImage =
//     product.images && product.images.length > 0
//       ? product.images[selectedImage]
//       : "/placeholder.png";

//   const discountPercentage = 30;
//   const discountPrice = Math.round(
//     product.price - (product.price * discountPercentage) / 100
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen flex flex-col">
//       <NavBar />

//       <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
//         {/* Left: Product Images */}
//         <div className="flex flex-col items-center">
//           <div className="w-full max-w-md h-96 relative">
//             <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-10">
//               {discountPercentage}% OFF
//             </span>
//             <Image
//               src={mainImage}
//               alt={product.name || "Product Image"}
//               fill
//               className="object-cover rounded-xl shadow-md"
//             />
//           </div>

//           <div className="flex gap-3 mt-4">
//             {product.images &&
//               product.images.map((img: string, index: number) => (
//                 <div
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`w-20 h-20 relative cursor-pointer rounded-lg overflow-hidden border-2 ${
//                     selectedImage === index ? "border-black" : "border-gray-300"
//                   }`}
//                 >
//                   <Image
//                     src={img}
//                     alt={`Thumbnail ${index}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Right: Product Info */}
//         <div className="flex flex-col justify-start">
//           <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

//           {/* Rating */}
//           <div className="flex items-center mt-2">
//             {Array.from({ length: 5 }, (_, i) => (
//               <FaStar
//                 key={i}
//                 className={`h-5 w-5 ${
//                   i < Math.floor(product.rating ?? 0)
//                     ? "text-yellow-400"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//             <span className="ml-2 text-gray-600 text-sm">
//               {product.rating ?? 0} / 5
//             </span>
//           </div>

//           {/* Price Section */}
//           <div className="mt-4 flex items-center gap-3">
//             <p className="text-2xl font-bold text-green-600">₹{discountPrice}</p>
//             <p className="text-lg line-through text-gray-500">
//               ₹{product.price}
//             </p>
//             <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
//               {discountPercentage}% OFF
//             </span>
//           </div>

//           {/* Category */}
//           <p className="mt-2 text-sm text-gray-500">
//             Category:{" "}
//             <span className="font-medium text-gray-800">{product.category}</span>
//           </p>

//           {/* Available Quantity */}
//           <p className="mt-2 text-sm text-gray-500">
//             Available Quantity:{" "}
//             <span className="font-medium text-gray-800">
//               {product.quantity}
//             </span>
//           </p>

//           {/* Quantity Selector */}
//           <div className="mt-4 flex items-center gap-4">
//             <button
//               onClick={decreaseQuantity}
//               className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-300"
//             >
//               -
//             </button>
//             <span className="text-lg font-medium text-gray-800">{quantity}</span>
//             <button
//               onClick={increaseQuantity}
//               className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-300"
//             >
//               +
//             </button>
//           </div>

//           {/* Description */}
//           <p className="mt-6 text-gray-700 leading-relaxed">
//             {product.description}
//           </p>

//           {/* Buttons */}
//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={handleAddToCart}
//               className="bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={handleBuyNow}
//               className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
//             >
//               Buy Now
//             </button>
//           </div>

//           {/* ✅ Premium Trust Badges */}
//           <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
//             <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
//               <FaLock className="text-black text-2xl mb-2" />
//               <p className="text-sm font-medium text-gray-800">Secure Payment</p>
//             </div>
//             <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
//               <FaShippingFast className="text-black text-2xl mb-2" />
//               <p className="text-sm font-medium text-gray-800">Fast Delivery</p>
//             </div>
//             <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
//               <FaUndoAlt className="text-black text-2xl mb-2" />
//               <p className="text-sm font-medium text-gray-800">Easy Returns</p>
//             </div>
//             <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
//               <FaHeadset className="text-black text-2xl mb-2" />
//               <p className="text-sm font-medium text-gray-800">24/7 Support</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popup Message */}
//       {popupMessage && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={handlePopupClose}
//           ></div>
//           <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center z-50 animate-fade-in-out">
//             <p className="text-lg font-semibold text-gray-900">{popupMessage}</p>
//             <button
//               className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
//               onClick={handlePopupClose}
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <Footer />

//       <style jsx>{`
//         @keyframes fadeInOut {
//           0%,
//           100% {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           10%,
//           90% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-out {
//           animation: fadeInOut 3s forwards;
//         }
//       `}</style>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaStar, FaLock, FaShippingFast, FaUndoAlt, FaHeadset } from "react-icons/fa";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import Image from "next/image";

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const isLoggedIn = !!token;

  // ✅ Load token on mount
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) fetchCart(t);
  }, []);

  // ✅ Fetch cart data
  const fetchCart = async (authToken: string) => {
    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // ✅ Fetch product details
  const fetchProduct = async () => {
    if (!productId) return;
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (data.success) {
        const images = Array.isArray(data.product.images)
          ? data.product.images
          : data.product.images
          ? data.product.images.split(",")
          : [];
        setProduct({ ...data.product, images });
        setQuantity(1);
      } else {
        setPopupMessage("Product not found");
      }
    } catch (err) {
      console.error(err);
      setPopupMessage("Error fetching product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // ✅ Increase quantity
  const increaseQuantity = () => {
    if (!product) return;
    if (quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  // ✅ Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // ✅ Update product stock after purchase/cart update
  const updateProductStock = async (updatedQty: number) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: updatedQty }),
      });
      await fetchProduct();
    } catch (err) {
      console.error("Failed to update stock:", err);
    }
  };

  // ✅ Add to cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setPopupMessage("Please login to add items to cart!");
      setShouldRefresh(false);
      return;
    }
    if (!product) return;

    // 🔹 Check if product already exists in cart
    const existingCartItem = cart.find((item) => item.product_id === product.id);
    const alreadyInCartQty = existingCartItem ? existingCartItem.quantity : 0;
    const totalRequestedQty = alreadyInCartQty + quantity;

    // 🔹 If cart already has max stock, block it
    if (alreadyInCartQty >= product.quantity) {
      setPopupMessage("Maximum available stock is already added to your cart!");
      setShouldRefresh(false);
      return;
    }

    // 🔹 If adding exceeds stock, show remaining limit
    if (totalRequestedQty > product.quantity) {
      setPopupMessage(
        `You already have ${alreadyInCartQty} in your cart. Only ${
          product.quantity - alreadyInCartQty
        } more can be added!`
      );
      setShouldRefresh(false);
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });

      const data = await res.json();
      if (data.success) {
        setPopupMessage(`${product.name} added to cart!`);
        setShouldRefresh(true);

        // 🔹 Update available stock instantly
        const updatedQty = product.quantity - quantity;
        await updateProductStock(updatedQty);

        // 🔹 Refresh cart instantly
        fetchCart(token as string);
      } else {
        setPopupMessage(data.message || "Failed to add to cart");
        setShouldRefresh(false);
      }
    } catch (err) {
      console.error(err);
      setPopupMessage("Error adding to cart");
      setShouldRefresh(false);
    }
  };

  // ✅ Buy now
  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      setPopupMessage("Please login first to purchase items!");
      setShouldRefresh(false);
      return;
    }
    if (!product) return;

    if (quantity > product.quantity) {
      setPopupMessage("Not enough stock available!");
      setShouldRefresh(false);
      return;
    }

    const updatedQty = product.quantity - quantity;
    await updateProductStock(updatedQty);

    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  // ✅ Close popup
  const handlePopupClose = () => {
    setPopupMessage(null);
    router.refresh();
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <NavBar />
        <p className="text-center mt-20 text-lg">Loading product...</p>
        <Footer />
      </div>
    );
  }

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[selectedImage]
      : "/placeholder.png";

  const discountPercentage = 30;
  const discountPrice = Math.round(
    product.price - (product.price * discountPercentage) / 100
  );

  // ✅ Check if cart already has max stock
  const existingCartItem = cart.find((item) => item.product_id === product.id);
  const alreadyInCartQty = existingCartItem ? existingCartItem.quantity : 0;
  const addToCartDisabled = alreadyInCartQty >= product.quantity;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        {/* Left: Product Images */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md h-96 relative">
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-10">
              {discountPercentage}% OFF
            </span>
            <Image
              src={mainImage}
              alt={product.name || "Product Image"}
              fill
              className="object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {product.images &&
              product.images.map((img: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-black" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating ?? 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              {product.rating ?? 0} / 5
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-4 flex items-center gap-3">
            <p className="text-2xl font-bold text-green-600">₹{discountPrice}</p>
            <p className="text-lg line-through text-gray-500">
              ₹{product.price}
            </p>
            <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          </div>

          {/* Category */}
          <p className="mt-2 text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-gray-800">{product.category}</span>
          </p>

          {/* Available Quantity */}
          <p className="mt-2 text-sm text-gray-500">
            Available Quantity:{" "}
            <span className="font-medium text-gray-800">
              {product.quantity}
            </span>
          </p>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={decreaseQuantity}
              className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-lg font-medium text-gray-800">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={addToCartDisabled}
              className={`px-6 py-3 rounded-lg shadow transition ${
                addToCartDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {addToCartDisabled ? "Max Stock in Cart" : "Add to Cart"}
            </button>
            {/* <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              Buy Now
            </button> */}
          </div>

          {/* ✅ Premium Trust Badges */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
              <FaLock className="text-black text-2xl mb-2" />
              <p className="text-sm font-medium text-gray-800">Secure Payment</p>
            </div>
            <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
              <FaShippingFast className="text-black text-2xl mb-2" />
              <p className="text-sm font-medium text-gray-800">Fast Delivery</p>
            </div>
            <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
              <FaUndoAlt className="text-black text-2xl mb-2" />
              <p className="text-sm font-medium text-gray-800">Easy Returns</p>
            </div>
            <div className="flex flex-col items-center bg-gray-100 px-3 py-4 rounded-lg shadow hover:scale-105 transition">
              <FaHeadset className="text-black text-2xl mb-2" />
              <p className="text-sm font-medium text-gray-800">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Message */}
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handlePopupClose}
          ></div>
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center z-50 animate-fade-in-out">
            <p className="text-lg font-semibold text-gray-900">{popupMessage}</p>
            <button
              className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={handlePopupClose}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
          10%,
          90% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s forwards;
        }
      `}</style>
    </div>
  );
}
