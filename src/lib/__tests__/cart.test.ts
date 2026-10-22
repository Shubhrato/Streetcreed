import { describe, expect, it } from "vitest";
import type { CartItem } from "../types";
import {
  addToCart,
  applyPromo,
  cartCount,
  cartKey,
  cartSubtotal,
  removeFromCart,
  shippingFor,
  updateQty,
} from "../utils";

const coat: CartItem = {
  productSlug: "camel-wool-overcoat",
  name: "Camel Wool Overcoat",
  image: "x",
  price: 489,
  size: "M",
  color: "Camel",
  qty: 1,
};

describe("cart logic", () => {
  it("adds a new item", () => {
    const next = addToCart([], coat);
    expect(next).toHaveLength(1);
    expect(cartCount(next)).toBe(1);
  });
  it("merges same product+size+color", () => {
    const next = addToCart([coat], { ...coat, qty: 2 });
    expect(next).toHaveLength(1);
    expect(next[0].qty).toBe(3);
  });
  it("keeps different sizes separate", () => {
    const next = addToCart([coat], { ...coat, size: "L" });
    expect(next).toHaveLength(2);
  });
  it("updateQty to 0 removes the item", () => {
    const next = updateQty([coat], cartKey(coat), 0);
    expect(next).toHaveLength(0);
  });
  it("removeFromCart removes by key", () => {
    expect(removeFromCart([coat], cartKey(coat))).toHaveLength(0);
  });
  it("subtotal multiplies price by qty", () => {
    expect(cartSubtotal([{ ...coat, qty: 2 }])).toBe(978);
  });
});

describe("promo + shipping", () => {
  it("STREET10 gives 10% off", () => {
    const { discount, valid } = applyPromo(500, "STREET10");
    expect(valid).toBe(true);
    expect(discount).toBe(50);
  });
  it("unknown code gives no discount", () => {
    expect(applyPromo(500, "NOPE").valid).toBe(false);
  });
  it("free shipping at ₹20,000+", () => {
    expect(shippingFor(20000)).toBe(0);
    expect(shippingFor(19999)).toBe(499);
    expect(shippingFor(0)).toBe(0);
  });
});
