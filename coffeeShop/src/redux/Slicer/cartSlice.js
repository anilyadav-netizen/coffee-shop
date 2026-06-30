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
    async ({ coffeeId, quantity, amount }, { rejectWithValue }) => {
        try {
            const { data } = await API.post("/cart", {
                coffeeId,
                quantity,
                amount,
            });
             console.log("✅ API RESPONSE:", data);

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add item"
            );
        }
    }
);

// ================= REMOVE CART ITEM =================
export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (coffeeId, { rejectWithValue }) => {
        console.log("🗑️ REMOVE ITEM:", coffeeId);
        try {
            const { data } = await API.delete(`/cart/${coffeeId}`);
            console.log("✅ REMOVE response:", data);
            return coffeeId;
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
    async (coffeeId, { rejectWithValue, getState }) => {
        console.log("⬆️ INCREASE QUANTITY for coffeeId:", coffeeId);
        try {
            const { data } = await API.patch(`/cart/increase/${coffeeId}`);
            console.log("⬆️ INCREASE response:", data);

            // If we get a success response with cart data
            if (data.success && data.data) {
                return {
                    coffeeId,
                    cart: data.data,
                    success: true
                };
            } else {
                // If backend returns different structure, try to fetch fresh cart
                const cartResponse = await API.get("/cart");
                return {
                    coffeeId,
                    cart: cartResponse.data,
                    success: true,
                    refetched: true
                };
            }
        } catch (error) {
            console.error("❌ INCREASE error:", error);
            // On error, try to refetch cart to maintain consistency
            try {
                const cartResponse = await API.get("/cart");
                return {
                    coffeeId,
                    cart: cartResponse.data,
                    success: true,
                    refetched: true,
                    error: error.response?.data?.message
                };
            } catch (refetchError) {
                return rejectWithValue(
                    error.response?.data?.message || "Failed to increase quantity"
                );
            }
        }
    }
);

// ================= DECREASE QUANTITY =================
export const decreaseQuantity = createAsyncThunk(
    "cart/decreaseQuantity",
    async (coffeeId, { rejectWithValue, getState }) => {
        console.log("⬇️ DECREASE QUANTITY for coffeeId:", coffeeId);
        try {
            const { data } = await API.patch(`/cart/decrease/${coffeeId}`);
            console.log("⬇️ DECREASE response:", data);

            if (data.success && data.data) {
                return {
                    coffeeId,
                    cart: data.data,
                    success: true,
                    removed: data.message === "Item removed from cart"
                };
            } else {
                // If backend returns different structure, try to fetch fresh cart
                const cartResponse = await API.get("/cart");
                return {
                    coffeeId,
                    cart: cartResponse.data,
                    success: true,
                    refetched: true,
                    removed: false
                };
            }
        } catch (error) {
            console.error("❌ DECREASE error:", error);
            // On error, try to refetch cart to maintain consistency
            try {
                const cartResponse = await API.get("/cart");
                return {
                    coffeeId,
                    cart: cartResponse.data,
                    success: true,
                    refetched: true,
                    removed: false,
                    error: error.response?.data?.message
                };
            } catch (refetchError) {
                return rejectWithValue(
                    error.response?.data?.message || "Failed to decrease quantity"
                );
            }
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

                const cart = action.payload;
                console.log()
                state.cartItems = cart.data.items || [];

                state.totalItems = state.cartItems.length;

                state.totalPrice = state.cartItems.reduce(
                    (sum, item) =>
                        sum + item.quantity * (item.coffee?.price || 0),
                    0
                );
                console.log("📊 Cart loaded:", {
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
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

                const cart = action.payload.data;

                state.cartItems = cart?.items || [];
                state.totalItems = state.cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                state.totalPrice = state.cartItems.reduce(
                    (sum, item) =>
                        sum + item.quantity * (item.amount || item.coffee?.price || 0),
                    0
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
                const coffeeId = action.payload;

                state.cartItems = state.cartItems.filter(
                    (item) => item.coffee?._id !== coffeeId
                );

                state.totalItems = state.cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                state.totalPrice = state.cartItems.reduce(
                    (sum, item) => sum + item.quantity * (item.coffee?.price || 0),
                    0
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

                const { coffeeId, cart, refetched } = action.payload;

                // Update cart items from the response
                if (cart && cart.items) {
                    state.cartItems = cart.items;
                }

                state.totalItems = new Set(
                    state.cartItems.map(item => item.coffee?._id)
                ).size;

                state.totalPrice = state.cartItems.reduce(
                    (sum, item) => sum + item.quantity * (item.coffee?.price || 0),
                    0
                );

                console.log(`⬆️ Quantity increased ${refetched ? '(refetched)' : ''}:`, {
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
                });

                if (action.payload.error) {
                    state.error = action.payload.error;
                }
            })
            .addCase(increaseQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("❌ INCREASE rejected:", action.payload);
                // Refetch cart on error to ensure consistency
                // This will be handled in the component
            });

        // ========== DECREASE QUANTITY ==========
        builder
            .addCase(decreaseQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(decreaseQuantity.fulfilled, (state, action) => {
                state.loading = false;

                const { coffeeId, cart, removed, refetched } = action.payload;

                // Update cart items from the response
                if (cart && cart.items) {
                    state.cartItems = cart.items;
                }

                state.totalItems = state.cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                state.totalPrice = state.cartItems.reduce(
                    (sum, item) => sum + item.quantity * (item.coffee?.price || 0),
                    0
                );

                console.log(`⬇️ Quantity decreased ${refetched ? '(refetched)' : ''}:`, {
                    removed,
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
                });

                if (action.payload.error) {
                    state.error = action.payload.error;
                }
            })
            .addCase(decreaseQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("❌ DECREASE rejected:", action.payload);
                // Refetch cart on error to ensure consistency
                // This will be handled in the component
            });
    },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;