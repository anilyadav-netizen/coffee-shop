import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= GET ALL PRODUCTS =================
export const getProducts = createAsyncThunk(
    "adminProducts/getProducts",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/coffee");
            return data.data; // ✅ Backend se data.data mein aayega
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch products"
            );
        }
    }
);

// ================= ADD PRODUCT =================
// src/redux/Slicer/adminProductSlice.js

// ================= ADD PRODUCT =================
export const addProduct = createAsyncThunk(
    "adminProducts/addProduct",
    async (productData, { rejectWithValue }) => {
        try {
            // ✅ JSON bhejo (FormData nahi)
            const { data } = await API.post("/coffee", productData);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add product"
            );
        }
    }
);

// ================= UPDATE PRODUCT =================
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            // ✅ JSON bhejo (FormData nahi)
            const { data } = await API.put(`/coffee/${id}`, productData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update product"
            );
        }
    }
);

// ================= DELETE PRODUCT =================
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/coffee/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete product"
            );
        }
    }
);

// ================= SLICE =================
const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
        totalProducts: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GET PRODUCTS
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload || [];
                state.totalProducts = action.payload?.length || 0;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ADD PRODUCT
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
                state.totalProducts += 1;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // UPDATE PRODUCT
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(
                    (p) => p._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // DELETE PRODUCT
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(
                    (p) => p._id !== action.payload
                );
                state.totalProducts -= 1;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminProductSlice.reducer;