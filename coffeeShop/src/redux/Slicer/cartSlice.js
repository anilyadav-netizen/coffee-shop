// src/redux/slices/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= GET CART =================
export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/cart");
            return data;
        } catch (error) {
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
        try {
            const { data } = await API.post("/cart", {
                coffeeId,
                quantity,
            });
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
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/cart/${id}`);
            return id;
        } catch (error) {
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
            const { data } = await API.put(`/cart/increase/${id}`);
            return data.data; // Backend se updated item
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
            const { data } = await API.put(`/cart/decrease/${id}`);
            
            // ✅ Check if item was removed (quantity <= 1)
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
                
                // ✅ Calculate totals
                state.totalItems = action.payload.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );
                state.totalPrice = action.payload.reduce(
                    (sum, item) => sum + (item.coffee?.price || 0) * item.quantity,
                    0
                );
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ========== ADD TO CART ==========
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems.push(action.payload);
                
                state.totalItems += action.payload.quantity;
                state.totalPrice += (action.payload.coffee?.price || 0) * action.payload.quantity;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ========== REMOVE CART ITEM ==========
        builder
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const removedItem = state.cartItems.find(
                    (item) => item._id === action.payload
                );
                
                state.cartItems = state.cartItems.filter(
                    (item) => item._id !== action.payload
                );
                
                if (removedItem) {
                    state.totalItems -= removedItem.quantity;
                    state.totalPrice -= (removedItem.coffee?.price || 0) * removedItem.quantity;
                }
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ========== INCREASE QUANTITY ==========
        builder
            .addCase(increaseQuantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(increaseQuantity.fulfilled, (state, action) => {
                state.loading = false;
                
                const index = state.cartItems.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.cartItems[index] = action.payload;
                    state.totalItems += 1;
                    state.totalPrice += (action.payload.coffee?.price || 0);
                }
            })
            .addCase(increaseQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ========== DECREASE QUANTITY ==========
        builder
            .addCase(decreaseQuantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(decreaseQuantity.fulfilled, (state, action) => {
                state.loading = false;
                
                // ✅ Agar item remove ho gaya
                if (action.payload.removed) {
                    const removedItem = state.cartItems.find(
                        (item) => item._id === action.payload.id
                    );
                    if (removedItem) {
                        state.totalItems -= 1;
                        state.totalPrice -= (removedItem.coffee?.price || 0);
                    }
                    state.cartItems = state.cartItems.filter(
                        (item) => item._id !== action.payload.id
                    );
                } else {
                    // ✅ Agar quantity decrease hui
                    const index = state.cartItems.findIndex(
                        (item) => item._id === action.payload.data._id
                    );
                    if (index !== -1) {
                        state.cartItems[index] = action.payload.data;
                        state.totalItems -= 1;
                        state.totalPrice -= (action.payload.data.coffee?.price || 0);
                    }
                }
            })
            .addCase(decreaseQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;