import { products } from "../data/catalogue.js";
import { storage } from "./storage.js";

// Browser-only prototype state. Storage keys remain compatible with earlier previews.
const saved = storage.get("saved", []);
const records = storage.get("records", []);
export const state = {
  saved: Array.isArray(saved)
    ? saved.filter((id) => products.some((product) => product.id === id))
    : [],
  records: Array.isArray(records) ? records : [],
  activeCategory: "All products",
  query: "",
  limit: 8,
};
