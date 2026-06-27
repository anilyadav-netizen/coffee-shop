import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= CREATE ORDER =================
export const createOrder = createAsyncThunk(
    "payment/createOrder",
    async (totalAmount, { rejectWithValue }) => {
        try {
            const { data } = await API.post("/payment/create-order", { totalAmount });
            console.log("Sending Order Amount:", totalAmount);
            console.log("Create Order Response:", data);

            return data;
        } catch (error) {
            return rejectWithValue(
                
                error.response?.data?.message || "Failed to create order"
            );
        }
    }
);

// ================= VERIFY PAYMENT =================
export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
        try {
            const { data } = await API.post(
                "/payment/verify-payment",
                paymentData
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Payment verification failed"
            );
        }
    }
);

// ================= GET MY ORDERS =================
export const getMyOrders = createAsyncThunk(
    "payment/getMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/payment/orderDetails");
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch orders"
            );
        }
    }
);

// ================= INITIAL STATE =================
const initialState = {
    order: null,
    orders: [],
    loading: false,
    success: false,
    error: null,
};

// ================= SLICE =================
const paymentSlice = createSlice({
    name: "payment",
    initialState,

    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },

        clearPaymentSuccess: (state) => {
            state.success = false;
        },

        resetPaymentState: (state) => {
            state.order = null;
            state.orders = [];
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE ORDER =====
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })

            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===== VERIFY PAYMENT =====
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })

            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===== GET MY ORDERS =====
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })

            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearPaymentError,
    clearPaymentSuccess,
    resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;