import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= GET ALL USERS =================
export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/users/all");

            console.log("✅ GET ALL USERS:", data);

            return data;
        } catch (error) {
            console.error("❌ GET ALL USERS ERROR:", error);

            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    }
);

// ================= SLICE =================
const userSlice = createSlice({
    name: "users",

    initialState: {
        users: [],
        count: 0,
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.count = action.payload.count;
            })

            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;