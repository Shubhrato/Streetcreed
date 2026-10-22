# Page spec — Cart & Checkout (inherits MASTER.md)
Cart: line items (image, name, size, qty stepper, remove), free-shipping
progress, subtotal, promo code field (demo: STREETCREED10 = 10% off), checkout CTA.
Checkout: 2-col — form (contact, shipping address, delivery method radio,
payment mock card inputs w/ zod validation) + sticky order summary. On submit:
validates, creates mock order, clears cart, routes to confirmation state with
order number. Empty cart: editorial empty state + continue shopping CTA.
