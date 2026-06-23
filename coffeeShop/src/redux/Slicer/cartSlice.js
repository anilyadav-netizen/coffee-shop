// src/redux/slices/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= GET CART =================
export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/cart");
            console.log("✅ GET CART response:", data);
            return data;
        } catch (error) {
            console.error("❌ GET CART error:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart"
            );
        }
    }
);

// ================= ADD TO CART =================
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ coffeeId, quantity }, { rejectWithValue }) => {
        console.log("📦 ADD TO CART:", { coffeeId, quantity });
        try {
            const { data } = await API.post("/cart", {
                coffeeId,
                quantity,
            });
            console.log("✅ ADD TO CART response:", data);
            return data;
        } catch (error) {
            console.error("❌ ADD TO CART error:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to add item"
            );
        }
    }
);

// ================= REMOVE CART ITEM =================
export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (id, { rejectWithValue }) => {
        console.log("🗑️ REMOVE ITEM:", id);
        try {
            const { data } = await API.delete(`/cart/${id}`);
            console.log("✅ REMOVE response:", data);
            return id;
        } catch (error) {
            console.error("❌ REMOVE error:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove item"
            );
        }
    }
);

// ================= INCREASE QUANTITY =================
export const increaseQuantity = createAsyncThunk(
    "cart/increaseQuantity",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await API.patch(`/cart/increase/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to increase quantity"
            );
        }
    }
);

// ================= DECREASE QUANTITY =================
export const decreaseQuantity = createAsyncThunk(
    "cart/decreaseQuantity",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await API.patch(`/cart/decrease/${id}`);
            if (data.message === "Item removed from cart") {
                return { id, removed: true };
            }
            return { id, data: data.data, removed: false };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to decrease quantity"
            );
        }
    }
);

// ================= SLICE =================

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cartItems: [],
        loading: false,
        error: null,
        totalItems: 0,
        totalPrice: 0,
    },

    reducers: {
        clearCartState: (state) => {
            state.cartItems = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            state.error = null;
            state.loading = false;
        },
    },

    extraReducers: (builder) => {

        // ========== GET CART ==========
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;

                // ✅ FIX: Use cartItems.length for unique items count
                state.totalItems = state.cartItems.length;  // <--- CHANGE HERE
                
                state.totalPrice = state.cartItems.reduce(
                    (sum, item) => sum + ((item.coffee?.price || 0) * (item.quantity || 0)), 0
                );
                console.log("📊 Cart loaded:", {
                    totalItems: state.totalItems,  // Now shows unique products count
                    totalPrice: state.totalPrice,
                    items: state.cartItems.length
                });
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("❌ GET CART rejected:", action.payload);
            });

        // ========== ADD TO CART ==========
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const newItem = action.payload;

                const existingIndex = state.cartItems.findIndex(
                    item => item.coffee?._id === newItem.coffee?._id
                );

                if (existingIndex !== -1) {
                    state.cartItems[existingIndex] = newItem;
                } else {
                    state.cartItems.push(newItem);
                }

                // ✅ FIX: Use cartItems.length (already correct)
                state.totalItems = state.cartItems.length;  // <--- KEEP AS IS
                
                state.totalPrice = state.cartItems.reduce(
                    (sum, item) => sum + ((item.coffee?.price || 0) * (item.quantity || 0)), 0
                );
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("❌ ADD TO CART rejected:", action.payload);
            });

        // ========== REMOVE CART ITEM ==========
        builder
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = state.cartItems.filter(
                    (item) => item._id !== action.payload
                );

                // ✅ FIX: Use cartItems.length
                state.totalItems = state.cartItems.length;  // <--- CHANGE HERE
                
                state.totalPrice = state.cartItems.reduce(
                    (sum, item) => sum + ((item.coffee?.price || 0) * (item.quantity || 0)), 0
                );
                console.log("🗑️ Item removed, new totals:", {
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
                });
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("❌ REMOVE rejected:", action.payload);
            });

        // ========== INCREASE QUANTITY ==========
        builder
            .addCase(increaseQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(increaseQuantity.fulfilled, (state, action) => {
                state.loading = false;

                const updatedItem = action.payload;
                console.log("⬆️ Updated item:", updatedItem);

                if (!updatedItem || !updatedItem._id) {
                    console.error("❌ Invalid updated item:", updatedItem);
                    return;
                }

                const index = state.cartItems.findIndex(
                    (item) => item._id === updatedItem._id
                );

                if (index !== -1) {
                    state.cartItems[index].quantity = updatedItem.quantity;

                    // ✅ FIX: Use cartItems.length (quantity change should NOT affect totalItems)
                    state.totalItems = state.cartItems.length;  // <--- CHANGE HERE
                    
                    state.totalPrice = state.cartItems.reduce(
                        (sum, item) => sum + ((item.coffee?.price || 0) * (item.quantity || 0)), 0
                    );

                    console.log("⬆️ Quantity increased:", {
                        newQuantity: updatedItem.quantity,
                        totalItems: state.totalItems,  // Now unchanged by quantity change
                        totalPrice: state.totalPrice
                    });
                } else {
                    console.warn("⚠️ Item not found in cart:", updatedItem._id);
                }
            })
            .addCase(increaseQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("❌ INCREASE rejected:", action.payload);
            });

        // ========== DECREASE QUANTITY ==========
        builder
            .addCase(decreaseQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(decreaseQuantity.fulfilled, (state, action) => {
                state.loading = false;

                console.log("⬇️ Decrease payload:", action.payload);

                if (action.payload.removed) {
                    state.cartItems = state.cartItems.filter(
                        (item) => item._id !== action.payload.id
                    );
                    console.log("🗑️ Item removed due to quantity 0");
                } else {
                    const updatedItem = action.payload.data;

                    if (!updatedItem || !updatedItem._id) {
                        console.error("❌ Invalid updated item:", updatedItem);
                        return;
                    }

                    const index = state.cartItems.findIndex(
                        (item) => item._id === updatedItem._id
                    );

                    if (index !== -1) {
                        state.cartItems[index].quantity = updatedItem.quantity;
                        console.log("⬇️ Quantity decreased:", {
                            newQuantity: updatedItem.quantity
                        });
                    } else {
                        console.warn("⚠️ Item not found in cart:", updatedItem._id);
                    }
                }

                // ✅ FIX: Use cartItems.length
                state.totalItems = state.cartItems.length;  // <--- CHANGE HERE
                
                state.totalPrice = state.cartItems.reduce(
                    (sum, item) => sum + ((item.coffee?.price || 0) * (item.quantity || 0)), 0
                );

                console.log("📊 Updated totals:", {
                    totalItems: state.totalItems,  // Now unchanged by quantity change
                    totalPrice: state.totalPrice
                });
            })
            .addCase(decreaseQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("❌ DECREASE rejected:", action.payload);
            });
    },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;