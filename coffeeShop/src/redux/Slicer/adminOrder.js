// src/redux/Slicer/adminOrderSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

export const getAllOrders = createAsyncThunk(
    "adminOrders/getAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/updatedelivery/admin/all");
            return data.orders;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch orders"
            );
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrders",

    initialState: {
        orders: [],
        loading: false,
        error: null,
    },

    reducers: {
        clearAdminOrders: (state) => {
            state.orders = [];
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ===============================
            // GET ALL ORDERS
            // ===============================
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload || [];
            })

            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAdminOrders } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;