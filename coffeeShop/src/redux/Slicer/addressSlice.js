import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

/* ================= UPDATE ADDRESS ================= */

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ addressId, addressData }, thunkAPI) => {
    try {
      const { data } = await API.put(
        `/auth/address/${addressId}`,
        addressData
      );

      return data.address;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

/* ================= INITIAL STATE ================= */

const initialState = {
  loading: false,
  success: false,
  address: null,
  error: null,
};

/* ================= SLICE ================= */

const addressSlice = createSlice({
  name: "address",
  initialState,

  reducers: {
    clearAddressState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.address = action.payload;
      })

      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddressState } = addressSlice.actions;

export default addressSlice.reducer;