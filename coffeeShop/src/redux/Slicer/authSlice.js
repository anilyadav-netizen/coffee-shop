import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

/* ---------------- LOGIN ---------------- */
export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            const { data } = await API.post("/auth/login", userData);
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
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Registration Failed"
            );
        }
    }
);

/* ---------------- LOGOUT ---------------- */
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            await API.post("/auth/logout");
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Logout Failed"
            );
        }
    }
);

/* ---------------- GET PROFILE ---------------- */
export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, thunkAPI) => {
        try {
            console.log("STEP 1");

            const { data } = await API.get("/auth/profile");

            console.log("STEP 3", data);

            return data.user;
        } catch (error) {
            console.log("PROFILE ERROR =", error.response);
            console.log("STATUS =", error.response?.status);
            console.log("DATA =", error.response?.data);

            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed"
            );
        }
    }
);
/* ---------------- INITIAL STATE ---------------- */
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
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
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            })

            /* ===== REGISTER ===== */
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== LOGOUT ===== */
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })

            /* ===== GET PROFILE ===== */
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                state.authChecked = true;
            })

            .addCase(getProfile.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.authChecked = true;
            })
    },
});

export default authSlice.reducer;