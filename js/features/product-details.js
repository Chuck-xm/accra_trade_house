import { products } from "../data/catalogue.js";

export const productUrl = (id) => `product.html?id=${encodeURIComponent(id)}`;

export function productFromSearch(search) {
  const id = new URLSearchParams(search).get("id");
  if (!id || !/^[1-9]\d*$/.test(id)) return null;
  return products.find((product) => product.id === Number(id)) ?? null;
}
