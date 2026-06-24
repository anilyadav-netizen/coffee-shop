// src/redux/Slicer/wishlistSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= GET WISHLIST =================
export const getWishlist = createAsyncThunk(
    "wishlist/getWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/wishlist");
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch wishlist"
            );
        }
    }
);

// ================= ADD TO WISHLIST =================
export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async ({ coffeeId }, { rejectWithValue }) => {
        console.log(coffeeId,"qwerty")
        try {
            const { data } = await API.post("/wishlist", { coffeeId });
            return data.data;
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue("Item already in wishlist");
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to wishlist"
            );
        }
    }
);

// ================= REMOVE FROM WISHLIST =================
export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/wishlist/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove from wishlist"
            );
        }
    }
);

// ✅ NAYA: CLEAR WISHLIST
export const clearWishlist = createAsyncThunk(
    "wishlist/clearWishlist",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { wishlist } = getState();
            // ✅ Saare items delete karo
            for (const item of wishlist.items) {
                await API.delete(`/wishlist/${item._id}`);
            }
            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to clear wishlist"
            );
        }
    }
);

// ================= TOGGLE WISHLIST =================
export const toggleWishlist = createAsyncThunk(
    "wishlist/toggleWishlist",
    async ({ coffee }, { rejectWithValue, getState }) => {
        try {
            const { wishlist } = getState();
            const existingItem = wishlist.items.find(
                (item) => item.coffee?._id === coffeeId || item.coffee === coffee
            );

            if (existingItem) {
                await API.delete(`/wishlist/${existingItem._id}`);
                return { id: existingItem._id, removed: true };
            } else {
                const { data } = await API.post("/wishlist", { coffee });
                return { data: data.data, removed: false };
            }
        } catch (error) {
            if (error.response?.status === 400) {
                try {
                    const { wishlist } = getState();
                    const existingItem = wishlist.items.find(
                        (item) => item.coffee?._id === coffee || item.coffee === coffee
                    );
                    if (existingItem) {
                        await API.delete(`/wishlist/${existingItem._id}`);
                        return { id: existingItem._id, removed: true };
                    }
                } catch (err) {
                    return rejectWithValue("Failed to toggle wishlist");
                }
            }
            return rejectWithValue(
                error.response?.data?.message || "Failed to toggle wishlist"
            );
        }
    }
);

// ================= SLICE =================
const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],
        loading: false,
        error: null,
        wishlistCount: 0,
    },
    reducers: {
        localToggleWishlist: (state, action) => {
            const { coffeeId } = action.payload;
            const existingIndex = state.items.findIndex(
                (item) => item.coffee?._id === coffeeId || item.coffee === coffeeId
            );

            if (existingIndex !== -1) {
                state.items.splice(existingIndex, 1);
                state.wishlistCount -= 1;
            } else {
                state.items.push({ 
                    _id: `temp-${Date.now()}`, 
                    coffee: { _id: coffeeId } 
                });
                state.wishlistCount += 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // ========== GET WISHLIST ==========
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
                state.wishlistCount = action.payload?.length || 0;
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== ADD TO WISHLIST ==========
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                state.wishlistCount += 1;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== REMOVE FROM WISHLIST ==========
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(
                    (item) => item._id !== action.payload
                );
                state.wishlistCount -= 1;
                
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== CLEAR WISHLIST ==========
            .addCase(clearWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearWishlist.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.wishlistCount = 0;
            })
            .addCase(clearWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ========== TOGGLE WISHLIST ==========
            .addCase(toggleWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.removed) {
                    state.items = state.items.filter(
                        (item) => item._id !== action.payload.id
                    );
                    state.wishlistCount -= 1;
                } else {
                    state.items.push(action.payload.data);
                    state.wishlistCount += 1;
                }
            })
            .addCase(toggleWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { localToggleWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;