import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ==============================
// Get Available Riders (Admin)
// ==============================
export const getAvailableRiders = createAsyncThunk(
  "rider/getAvailableRiders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/rider-assignment/admin/available-riders");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch available riders"
      );
    }
  }
);

// ==============================
// Assign Rider To Order (Admin)
// ==============================
export const assignRiderToOrder = createAsyncThunk(
  "rider/assignRiderToOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        "/rider-assignment/admin/assign-rider",
        payload
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign rider"
      );
    }
  }
);

// ==============================
// Get Delivery Orders (Admin)
// ==============================
export const getDeliveryOrders = createAsyncThunk(
  "rider/getDeliveryOrders",
  async (status = "", { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/rider-assignment/admin/delivery-orders${status ? `?status=${status}` : ""
        }`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch delivery orders"
      );
    }
  }
);

// ==============================
// Unassign Rider
// ==============================
export const unassignRiderFromOrder = createAsyncThunk(
  "rider/unassignRiderFromOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(
        `/rider-assignment/admin/unassign-rider/${orderId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unassign rider"
      );
    }
  }
);

// ==============================
// Rider Orders
// ==============================
export const getRiderOrders = createAsyncThunk(
  "rider/getRiderOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/rider-assignment/rider/my-orders");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rider orders"
      );
    }
  }
);

// ==============================
// Update Delivery Status
// ==============================
export const updateDeliveryStatus = createAsyncThunk(
  "rider/updateDeliveryStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        "/rider-assignment/rider/update-delivery-status",
        payload
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update delivery status"
      );
    }
  }
);

// ==============================
// Initial State
// ==============================

const initialState = {
  loading: false,
  error: null,

  availableRiders: [],
  deliveryOrders: [],

  activeOrders: [],
  completedOrders: [],

  assignedOrder: null,
  updatedOrder: null,
  unassignedOrder: null,

  successMessage: null,
};

// ==============================
// Slice
// ==============================
const riderAssignmentSlice = createSlice({
  name: "riderAssignment",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.successMessage = null;
    },

    clearAssignedOrder: (state) => {
      state.assignedOrder = null;
    },

    clearUpdatedOrder: (state) => {
      state.updatedOrder = null;
    },

    clearUnassignedOrder: (state) => {
      state.unassignedOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================
      // Get Available Riders
      // ======================
      .addCase(getAvailableRiders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRiders = action.payload.riders;
      })
      .addCase(getAvailableRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Assign Rider
      // ======================
      .addCase(assignRiderToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRiderToOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedOrder = action.payload.order;
        state.successMessage = action.payload.message;
      })
      .addCase(assignRiderToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Delivery Orders
      // ======================
      .addCase(getDeliveryOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeliveryOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryOrders = action.payload.orders;
      })
      .addCase(getDeliveryOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Rider Orders
      // ======================
      .addCase(getRiderOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRiderOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrders = action.payload.activeOrders;
        state.completedOrders = action.payload.completedOrders;
      })
      .addCase(getRiderOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Update Delivery Status
      // ======================
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedOrder = action.payload.order;
        state.successMessage = action.payload.message;
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Unassign Rider
      // ======================
      .addCase(unassignRiderFromOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unassignRiderFromOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.unassignedOrder = action.payload.order;
        state.successMessage = action.payload.message;
      })
      .addCase(unassignRiderFromOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearAssignedOrder,
  clearUpdatedOrder,
  clearUnassignedOrder,
} = riderAssignmentSlice.actions;

export default riderAssignmentSlice.reducer;