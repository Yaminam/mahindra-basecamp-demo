import { create } from "zustand";
import { persist } from "zustand/middleware";

// cart line key = product + fitment mode + size, so the same item can be bought two ways
const keyOf = (l) => [l.id, l.mode, l.size || ""].join("|");

export const useStore = create(
  persist(
    (set, get) => ({
      vehicle: null, // { model, variant, year, nickname }
      setVehicle: (vehicle) => set({ vehicle }),
      clearVehicle: () => set({ vehicle: null }),

      pickerOpen: false,
      openPicker: () => set({ pickerOpen: true }),
      closePicker: () => set({ pickerOpen: false }),

      cart: [],
      cartOpen: false,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      add: (line) => {
        const k = keyOf(line);
        const cart = get().cart;
        const hit = cart.find((l) => keyOf(l) === k);
        set({
          cart: hit
            ? cart.map((l) => (keyOf(l) === k ? { ...l, qty: l.qty + (line.qty || 1) } : l))
            : [...cart, { qty: 1, ...line }],
          cartOpen: true,
        });
      },
      setQty: (line, qty) =>
        set({
          cart: qty <= 0
            ? get().cart.filter((l) => keyOf(l) !== keyOf(line))
            : get().cart.map((l) => (keyOf(l) === keyOf(line) ? { ...l, qty } : l)),
        }),
      clearCart: () => set({ cart: [] }),

      points: 1240, // demo opening balance for the signed-in owner
      addPoints: (n) => set({ points: get().points + n }),
      member: "Trail",
      setMember: (member) => set({ member }),

      lastOrder: null,
      setLastOrder: (lastOrder) => set({ lastOrder }),

      notify: [],
      addNotify: (id) => set({ notify: [...new Set([...get().notify, id])] }),
    }),
    {
      name: "basecamp-demo",
      partialize: (s) => ({ vehicle: s.vehicle, cart: s.cart, points: s.points, member: s.member, lastOrder: s.lastOrder, notify: s.notify }),
    }
  )
);

export const cartTotal = (cart) => cart.reduce((t, l) => t + l.price * l.qty, 0);
export const cartCount = (cart) => cart.reduce((t, l) => t + l.qty, 0);
