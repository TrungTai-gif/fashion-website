import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import cartService from "../services/cartService.jsx";
import { useAuth } from "./authStore";

const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart state
      cartItems: [],
      isLoading: false,
      totalQuantity: 0,
      totalAmount: 0,

      // Add item to cart
      addToCart: async (product, variant = {}, quantity = 1) => {
        const state = get();
        // Guest: update local store
        let updatedCartItems = [...state.cartItems];
        const idx = updatedCartItems.findIndex(
          (it) =>
            it.product._id === product._id && it.variant._id == variant._id
        );
        if (idx !== -1) {
          updatedCartItems[idx] = {
            ...updatedCartItems[idx],
            quantity: updatedCartItems[idx].quantity + quantity,
          };
          // cập nhật quantity ở be
          await addCartBackend(product._id, quantity, variant._id);
          toast.success("Đã thêm vào giỏ hàng, cập nhật số lượng!");
        } else {
          updatedCartItems.push({
            product,
            variant,
            price: variant.price,
            quantity,
          });
          // Thêm mới ở backedn luôn
          addCartBackend(product._id, quantity, variant._id);
          toast.success("Đã thêm vào giỏ hàng");
        }
        set({
          cartItems: updatedCartItems,
          ...calculateTotals(updatedCartItems),
        });
        // cập nhật backend
      },

      // Remove item from cart
      removeFromCart: async (productId, variantId) => {
        const state = get();
        const pid = String(productId);
        const vid = String(variantId);

        const existing = state.cartItems.find(
          (it) =>
            String(it?.product?._id) === pid && String(it?.variant?._id) === vid
        );

        const updatedCartItems = state.cartItems.filter(
          (item) =>
            !(
              String(item?.product?._id) === pid &&
              String(item?.variant?._id) === vid
            )
        );

        await removeItemBackend(existing);

        set({
          cartItems: updatedCartItems,
          ...calculateTotals(updatedCartItems),
        });

        // toast.success("Item removed from cart");
      },

      // Update item quantity
      updateQuantity: async (productId, variantId, newQuantity) => {
        try {
          const state = get();
          const pid = String(productId);
          const vid = String(variantId);

          const existing = state.cartItems.find(
            (it) =>
              String(it?.product?._id) === pid &&
              String(it?.variant?._id) === vid
          );

          if (!existing) {
            // Nothing to update
            return;
          }
          updateQuantityBackend(existing, newQuantity);

          const updatedCartItems = state.cartItems.map((item) =>
            String(item?.product?._id) === pid &&
            String(item?.variant?._id) === vid
              ? { ...item, quantity: newQuantity }
              : item
          );

          set({
            cartItems: updatedCartItems,
            ...calculateTotals(updatedCartItems),
          });
        } catch (error) {
          throw error;
        }
      },

      // Clear entire cart
      clearCart: async () => {
        const { accessToken } = useAuth.getState();
        if (accessToken) {
          try {
            set({ isLoading: true });
            const cart = await cartService.clearCart();
            // const items = mapCartDocToItems(cart);
            // set({
            //   cartItems: items,
            //   ...calculateTotals(items),
            //   isLoading: false,
            // });
            // toast.success("Cart cleared");
            return;
          } catch (e) {
            console.error(e);
            toast.error("Failed to clear cart");
            set({ isLoading: false });
          }
        }
        set({ cartItems: [], totalQuantity: 0, totalAmount: 0 });
        // toast.success("Cart cleared");
      },

      // Get cart item by product id and size
      getCartItem: (productId, size) => {
        const state = get();
        return state.cartItems.find(
          (item) =>
            item.productId === productId &&
            (item.size || null) === (size || null)
        );
      },

      // Get quantity of specific item
      getItemQuantity: (productId, size) => {
        const item = get().getCartItem(productId, size);
        return item ? item.quantity : 0;
      },

      // Apply discount
      applyDiscount: (discountCode) => {
        const state = get();
        // This would typically connect to your backend to validate discount codes
        let discountAmount = 0;

        switch (discountCode.toUpperCase()) {
          case "WELCOME10":
            discountAmount = state.totalAmount * 0.1; // 10% discount
            break;
          case "SUMMER20":
            discountAmount = state.totalAmount * 0.2; // 20% discount
            break;
          case "FREESHIP":
            discountAmount = 50; // Fixed shipping discount
            break;
          default:
            toast.error("Invalid discount code");
            return null;
        }

        toast.success(`Discount applied: $${discountAmount.toFixed(2)}`);
        return {
          code: discountCode,
          amount: discountAmount,
          newTotal: state.totalAmount - discountAmount,
        };
      },

      // Calculate shipping
      calculateShipping: (method = "standard") => {
        const state = get();

        if (state.totalAmount > 100) {
          return 0; // Free shipping over $100
        }

        switch (method) {
          case "express":
            return 15;
          case "overnight":
            return 25;
          default:
            return 8; // Standard shipping
        }
      },

      // Initialize cart (can be called on app start)
      initializeCart: async () => {
        const { accessToken } = useAuth.getState();
        if (accessToken) {
          set({
            cartItems: [],
            totalQuantity: 0,
            totalAmount: 0,
          });
          try {
            const cart = await cartService.getCart();

            set({
              cartItems: cart.items,
              totalQuantity: cart.totalQuantity,
              totalAmount: cart.totalAmount,
            });
            return;
          } catch (e) {
            console.error(e);
          }
        }
      },
    }),
    {
      name: "fashion-cart-storage",
      partialize: (state) => ({
        cartItems: state.cartItems,
        totalQuantity: state.totalQuantity,
        totalAmount: state.totalAmount,
      }),
    }
  )
);

// Helper function to calculate totals
const calculateTotals = (cartItems) => {
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = Number(item.variant.price || 0);
    const qty = Number(item.quantity || 0);
    return sum + price * qty;
  }, 0);

  return {
    totalQuantity,
    totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
  };
};
// Sync cart with backend (for logged in users)
const addCartBackend = async (product, quantity, variant) => {
  const { accessToken } = useAuth.getState();
  if (!accessToken) return;
  try {
    // let cart = await cartService.getCart();
    let cartData = await cartService.addItem({
      product: product,
      quantity: quantity,
      variant: variant,
    });

    console.log("get cart ", cartData);
  } catch (error) {
    console.error("Failed to sync cart:", error);
    toast.error("Failed to sync cart");
  }
};

const removeItemBackend = async (existing) => {
  const { accessToken } = useAuth.getState();
  if (!accessToken) return;
  if (existing && existing._id) {
    try {
      const cart = await cartService.removeItem({
        itemId: existing._id,
      });
      return;
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove item");
    }
  }
};

const updateQuantityBackend = async (existing, newQuantity) => {
  const { accessToken } = useAuth.getState();
  if (!accessToken) return;
  if (accessToken && existing && existing._id) {
    try {
      const cart = await cartService.updateItemQuantity({
        itemId: existing._id,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  }
};
export default useCartStore;

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getCartItem,
  getItemQuantity,
  getCartSummary,
  applyDiscount,
  calculateShipping,
  syncWithBackend,
  initializeCart,
} = useCartStore.getState();
