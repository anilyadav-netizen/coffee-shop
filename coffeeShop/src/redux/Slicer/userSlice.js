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

// ================= SLICE =================
const userSlice = createSlice({
    name: "users",

    initialState: {
        usersList: {
            users: [],      // Array of user objects
            count: 0,       // Total count
            success: false  // API success status
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
            });
    },
});

// Export actions
export const { clearUsers } = userSlice.actions;

// Export reducer
export default userSlice.reducer;