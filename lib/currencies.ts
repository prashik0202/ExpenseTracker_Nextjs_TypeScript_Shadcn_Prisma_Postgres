export const Currencies = [
  { value: "INR", label: "₹ Rupee", locale: "en-IN" }, // Adding Indian Rupee (INR)
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = (typeof Currencies)[0];
