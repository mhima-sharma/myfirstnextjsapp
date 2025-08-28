export const addToCart = async (productId: number, quantity: number = 1) => {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  if (!res.ok) {
    throw new Error("Failed to add product to cart");
  }

  return res.json();
};
