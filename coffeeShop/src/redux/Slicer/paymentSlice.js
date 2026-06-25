import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5003/api/payment";

// Create Order
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (coffeeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${API_URL}/create-order`,
        { coffeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// Verify Payment
export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.post(
                `${API_URL}/verify-payment`,
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Payment verification failed"
            );
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",

    initialState: {
        loading: false,
        order: null,
        verified: false,
        success: false,
        error: null,
    },

    reducers: {
        resetPaymentState: (state) => {
            state.loading = false;
            state.order = null;
            state.verified = false;
            state.success = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // CREATE ORDER
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
                state.success = true;
            })

            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // VERIFY PAYMENT
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
            })

            .addCase(verifyPayment.fulfilled, (state) => {
                state.loading = false;
                state.verified = true;
            })

            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetPaymentState } =
    paymentSlice.actions;

export default paymentSlice.reducer;