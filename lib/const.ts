import { parsePhoneNumber } from "libphonenumber-js";

export const FILTERS = {
  category: ["All Categories","Phones", "Laptops"],
  brand: ["Apple", "Samsung"],
  condition: ["New", "Used", "Refurbished"],
};

export const SORT_OPTIONS = [
  { label: "Best Match", value: "relevance" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Newest First", value: "newest" },
];

export const phoneNumberFormat = (phone_number: string | number) => {
  if (!phone_number) return "";

  const phoneNumber = parsePhoneNumber(phone_number.toString());

  return phoneNumber?.formatInternational();
}