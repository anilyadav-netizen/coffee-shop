import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= GET ALL USERS =================
export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/auth/all");
            console.log("✅ GET ALL USERS RESPONSE:", data);
            // data = { success: true, count: 6, users: [...] }
            return data;
        } catch (error) {
            console.error("❌ GET ALL USERS ERROR:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    }
);

// ================= DELETE USER =================
export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await API.delete(`/auth/delete/${userId}`);

            console.log("✅ DELETE USER RESPONSE:", data);

            return {
                userId,
                ...data,
            };
        } catch (error) {
            console.error("❌ DELETE USER ERROR:", error);

            return rejectWithValue(
                error.response?.data?.message || "Failed to delete user"
            );
        }
    }
);

// ================= SLICE =================
const userSlice = createSlice({
    name: "users",

    initialState: {
        usersList: {
            users: [],
            count: 0,
            success: false
        },
        loading: false,
        error: null,
    },

    reducers: {
        // Optional: Clear users state
        clearUsers: (state) => {
            state.usersList = {
                users: [],
                count: 0,
                success: false
            };
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                // ✅ FIX: API returns { success, count, users }
                state.usersList = {
                    users: action.payload.users || [],
                    count: action.payload.count || 0,
                    success: action.payload.success || false
                };
                state.error = null;
                console.log("📦 Users stored in Redux:", state.usersList);
                console.log("👥 Users array:", state.usersList.users);
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.usersList = {
                    users: [],
                    count: 0,
                    success: false
                };
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.usersList.users = state.usersList.users.filter(
                    (user) => user._id !== action.payload.userId
                );
                state.usersList.count = state.usersList.users.length;
                state.error = null;
                console.log("🗑️ User deleted:", action.payload.userId);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export actions
export const { clearUsers } = userSlice.actions;

// Export reducer
export default userSlice.reducer;