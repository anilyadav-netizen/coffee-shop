import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

/* ---------------- LOGIN ---------------- */
export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            const { data } = await API.post("/auth/login", userData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Login Failed"
            );
        }
    }
);

/* ---------------- REGISTER ---------------- */
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            const { data } = await API.post("/auth/register", userData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Registration Failed"
            );
        }
    }
);

/* ---------------- LOGOUT ---------------- */
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue("Logout Failed");
        }
    }
);

// ✅ ADD THIS - Alias for logout
export const logout = logoutUser;

/* ---------------- INITIAL STATE ---------------- */
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
};

/* ---------------- SLICE ---------------- */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* ===== LOGIN ===== */
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== REGISTER ===== */
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== LOGOUT ===== */
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            });
    },
});

export default authSlice.reducer;