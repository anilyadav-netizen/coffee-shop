import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

/* ================= CREATE ADDRESS ================= */

export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, thunkAPI) => {
    try {
      const { data } = await API.post(
        "/auth/address",
        addressData
      );

      return data.address;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create address"
      );
    }
  }
);

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

/* ================= DELETE ADDRESS ================= */

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, thunkAPI) => {
    try {
      await API.delete(`/auth/address/${addressId}`);

      return addressId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

/* ================= INITIAL STATE ================= */

const initialState = {
  loading: false,
  success: false,
  address: null,
  deletedId: null,
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
      state.deletedId = null;
    },
  },

  extraReducers: (builder) => {
    builder;

    /* ================= CREATE ================= */

    builder
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.address = action.payload;
      })

      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

    /* ================= UPDATE ================= */

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

    /* ================= DELETE ================= */

    builder
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedId = action.payload;
      })

      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddressState } = addressSlice.actions;

export default addressSlice.reducer;