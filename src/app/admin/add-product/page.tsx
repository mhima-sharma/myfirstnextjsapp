// "use client";

// import { useState, useEffect } from "react";
// import { Loader2, Upload } from "lucide-react";

// export default function AddProductPage() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [images, setImages] = useState<File[]>([]);
//   const [previewImages, setPreviewImages] = useState<string[]>([]);
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // ✅ Fetch categories dynamically
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("/api/categories");
//         const data = await res.json();
//         if (data.success) {
//           setCategories(data.categories);
//         } else {
//           console.error("Failed to fetch categories");
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ✅ Handle image selection & preview
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setImages(files);

//       // Generate previews
//       const previews = files.map((file) => URL.createObjectURL(file));
//       setPreviewImages(previews);
//     }
//   };

//   // ✅ Submit form data
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const formData = new FormData();
//       formData.append("name", name.trim());
//       formData.append("description", description.trim());
//       formData.append("price", String(price));
//       formData.append("category_id", String(categoryId));

//       // Append selected images
//       images.forEach((img) => formData.append("images", img));

//       const res = await fetch("/api/products", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setMessage("✅ Product added successfully!");
//         resetForm();
//       } else {
//         setMessage("❌ Failed: " + data.error);
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setMessage("❌ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Reset form after success
//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setPrice("");
//     setCategoryId("");
//     setImages([]);
//     setPreviewImages([]);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#faf7f2] px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-xl border border-[#e5e0d8]"
//       >
//         <h2 className="text-3xl font-semibold mb-6 text-center text-[#222] tracking-wide">
//           Add New Product
//         </h2>

//         {/* Product Name */}
//         <label className="block mb-2 font-medium text-[#333]">Product Name</label>
//         <input
//           type="text"
//           placeholder="Enter product name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-gray-900 bg-[#fafafa]"
//         />

//         {/* Description */}
//         <label className="block mb-2 font-medium text-[#333]">Description</label>
//         <textarea
//           placeholder="Enter product description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//           className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-gray-900 bg-[#fafafa] min-h-[120px]"
//         />

//         {/* Price */}
//         <label className="block mb-2 font-medium text-[#333]">Price (₹)</label>
//         <input
//           type="number"
//           placeholder="Enter price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//           className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-gray-900 bg-[#fafafa]"
//         />

//         {/* Category */}
//         <label className="block mb-2 font-medium text-[#333]">Category</label>
//         <select
//           value={categoryId}
//           onChange={(e) => setCategoryId(e.target.value)}
//           required
//           className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none bg-white text-gray-900"
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* Images */}
//         <label className="block mb-2 font-medium text-[#333]">Product Images</label>
//         <div className="relative border-2 border-dashed border-[#d4af37] rounded-xl p-5 flex flex-col items-center justify-center bg-[#fffdf7] cursor-pointer mb-4">
//           <Upload className="w-10 h-10 text-[#d4af37] mb-2" />
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleFileChange}
//             className="absolute inset-0 opacity-0 cursor-pointer"
//           />
//           <p className="text-gray-500">Click or drag & drop to upload images</p>
//         </div>

//         {/* Image Previews */}
//         {previewImages.length > 0 && (
//           <div className="grid grid-cols-3 gap-3 mb-5">
//             {previewImages.map((src, index) => (
//               <div
//                 key={index}
//                 className="relative rounded-lg overflow-hidden shadow-md border border-[#e5e0d8]"
//               >
//                 <img
//                   src={src}
//                   alt={`Preview ${index}`}
//                   className="w-full h-24 object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full flex items-center justify-center bg-[#d4af37] text-white p-3 rounded-lg font-semibold text-lg hover:bg-[#c19e30] transition-all shadow-md"
//         >
//           {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
//           {loading ? "Adding..." : "Add Product"}
//         </button>

//         {/* Message */}
//         {message && (
//           <p
//             className={`mt-4 text-center text-sm ${
//               message.includes("✅") ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(""); // ✅ New state for quantity
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Handle image selection & preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      // Generate previews
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  // ✅ Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", String(price));
      formData.append("quantity", String(quantity)); // ✅ Send quantity
      formData.append("category_id", String(categoryId));

      // Append selected images
      images.forEach((img) => formData.append("images", img));

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Product added successfully!");
        resetForm();
      } else {
        setMessage("❌ Failed: " + data.error);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset form after success
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setQuantity(""); // ✅ Reset quantity too
    setCategoryId("");
    setImages([]);
    setPreviewImages([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#faf7f2] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-xl border border-[#e5e0d8]"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#222] tracking-wide">
          Add New Product
        </h2>

        {/* Product Name */}
        <label className="block mb-2 font-medium text-[#333]">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-gray-900 bg-[#fafafa]"
        />

        {/* Description */}
        <label className="block mb-2 font-medium text-[#333]">Description</label>
        <textarea
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-gray-900 bg-[#fafafa] min-h-[120px]"
        />

        {/* Price */}
        <label className="block mb-2 font-medium text-[#333]">Price (₹)</label>
        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-gray-900 bg-[#fafafa]"
        />

        {/* Quantity ✅ */}
        <label className="block mb-2 font-medium text-[#333]">Quantity</label>
        <input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-gray-900 bg-[#fafafa]"
        />

        {/* Category */}
        <label className="block mb-2 font-medium text-[#333]">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-[#ddd] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none bg-white text-gray-900"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Images */}
        <label className="block mb-2 font-medium text-[#333]">Product Images</label>
        <div className="relative border-2 border-dashed border-[#d4af37] rounded-xl p-5 flex flex-col items-center justify-center bg-[#fffdf7] cursor-pointer mb-4">
          <Upload className="w-10 h-10 text-[#d4af37] mb-2" />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <p className="text-gray-500">Click or drag & drop to upload images</p>
        </div>

        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {previewImages.map((src, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-md border border-[#e5e0d8]"
              >
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-[#d4af37] text-white p-3 rounded-lg font-semibold text-lg hover:bg-[#c19e30] transition-all shadow-md"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          {loading ? "Adding..." : "Add Product"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

