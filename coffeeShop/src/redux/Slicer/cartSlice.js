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

// ================= SLICE =================

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cartItems: [],
        loading: false,
        error: null,
    },

    reducers: {
        clearCartState: (state) => {
            state.cartItems = [];
        },
    },

    extraReducers: (builder) => {

        // GET CART

        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ADD CART

        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;

                state.cartItems.push(action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // REMOVE CART

        builder
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;

                state.cartItems = state.cartItems.filter(
                    (item) => item._id !== action.payload
                );
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;