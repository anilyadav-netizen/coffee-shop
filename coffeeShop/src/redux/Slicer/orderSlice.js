import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

/* ---------------- UPDATE ORDER STATUS ---------------- */
export const updateOrderStatus = createAsyncThunk(
    "order/updateStatus",
    async ({ orderId, orderStatus }, thunkAPI) => {
        try {
            const { data } = await API.put(
                `/updatedelivery/update-status/${orderId}`,
                {
                    orderStatus,
                }
            );

            return data.order;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Order Update Failed"
            );
        }
    }
);

/* ---------------- INITIAL STATE ---------------- */
const initialState = {
    orderList: [],
    currentOrder: null,
    loading: false,
    error: null,
};

/* ---------------- SLICE ---------------- */
const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            /* ===== UPDATE ORDER STATUS ===== */
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;

                const updatedOrder = action.payload;

                // update order in list
                state.orderList = state.orderList?.map((order) =>
                    order._id === updatedOrder._id
                        ? updatedOrder
                        : order
                );

                // current selected order update
                state.currentOrder = updatedOrder;
            })

            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;