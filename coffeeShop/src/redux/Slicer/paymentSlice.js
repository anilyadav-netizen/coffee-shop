import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= CREATE ORDER =================
export const createOrder = createAsyncThunk(
    "payment/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            console.log("📦 Sending order payload:", orderData);
            const { data } = await API.post("/payment/create-order", orderData);
            console.log("✅ Create Order Response:", data);
            return data;
        } catch (error) {
            console.error("❌ Create Order Error:", error.response?.data);
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

// ================= GET SINGLE ORDER =================
export const getOrderById = createAsyncThunk(
    "payment/getOrderById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await API.get(`/payment/orderDetails/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch order"
            );
        }
    }
);

// ================= INITIAL STATE =================
const initialState = {
    order: null,
    orders: [],
    selectedOrder: null,
    amount: 0,

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
            state.selectedOrder = null;
            state.amount = 0;
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ================= CREATE ORDER =================
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.order;
                state.amount = action.payload.amount;
            })

            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= VERIFY PAYMENT =================
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.payment;
            })

            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= GET MY ORDERS =================
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
            })

            // ================= GET ORDER BY ID =================
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload.order;
            })

            .addCase(getOrderById.rejected, (state, action) => {
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