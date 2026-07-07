// ================= TABLE SLICE =================
// file: src/redux/slices/tableSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/Api";

// ================= GET ALL TABLES =================
export const getTables = createAsyncThunk(
    "tables/getTables",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/tables");
            return data;
        } catch (error) {
            console.error("❌ GET TABLES ERROR:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch tables"
            );
        }
    }
);

// ================= CREATE TABLE =================
export const createTable = createAsyncThunk(
    "tables/createTable",
    async (tableData, { rejectWithValue }) => {
        try {
            const { data } = await API.post("/tables", tableData);
            console.log("✅ CREATE TABLE RESPONSE:", data);
            // data = { success: true, table: {...} }
            return data;
        } catch (error) {
            console.error("❌ CREATE TABLE ERROR:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to create table"
            );
        }
    }
);

// ================= UPDATE TABLE =================
export const updateTable = createAsyncThunk(
    "tables/updateTable",
    async ({ id, tableData }, { rejectWithValue }) => {
        try {
            const { data } = await API.put(`/tables/${id}`, tableData);
            console.log("✅ UPDATE TABLE RESPONSE:", data);
            // data = { success: true, table: {...} }
            return data;
        } catch (error) {
            console.error("❌ UPDATE TABLE ERROR:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to update table"
            );
        }
    }
);

// ================= DELETE TABLE =================
export const deleteTable = createAsyncThunk(
    "tables/deleteTable",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await API.delete(`/tables/${id}`);
            console.log("✅ DELETE TABLE RESPONSE:", data);
            // data = { success: true, message: "Table deleted successfully" }
            return { id, ...data };
        } catch (error) {
            console.error("❌ DELETE TABLE ERROR:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete table"
            );
        }
    }
);

// ================= INITIAL STATE =================
const initialState = {
    tables: {
        tables: [],      // Array of table objects
        success: false   // API success status
    },
    loading: false,
    error: null,
    operationLoading: false, // For create/update/delete operations
    operationError: null,
};

// ================= SLICE =================
const tableSlice = createSlice({
    name: "tables",
    initialState,
    reducers: {
        // Clear tables state
        clearTables: (state) => {
            state.tables = {
                tables: [],
                success: false
            };
            state.error = null;
            state.operationError = null;
        },

        // Reset operation status
        resetOperationStatus: (state) => {
            state.operationLoading = false;
            state.operationError = null;
        },

        // Clear specific error
        clearError: (state) => {
            state.error = null;
            state.operationError = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // ===== GET TABLES =====
            .addCase(getTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTables.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = {
                    tables: action.payload.tables || [],
                    success: action.payload.success || false
                };
                state.error = null;
            })
            .addCase(getTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.tables = {
                    tables: [],
                    success: false
                };
            })

            // ===== CREATE TABLE =====
            .addCase(createTable.pending, (state) => {
                state.operationLoading = true;
                state.operationError = null;
            })
            .addCase(createTable.fulfilled, (state, action) => {
                state.operationLoading = false;
                // Add new table to existing list
                if (action.payload.success && action.payload.table) {
                    state.tables.tables.push(action.payload.table);
                }
                state.operationError = null;
                console.log("✅ Table created successfully:", action.payload.table);
            })
            .addCase(createTable.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationError = action.payload;
            })

            // ===== UPDATE TABLE =====
            .addCase(updateTable.pending, (state) => {
                state.operationLoading = true;
                state.operationError = null;
            })
            .addCase(updateTable.fulfilled, (state, action) => {
                state.operationLoading = false;
                // Update table in the list
                if (action.payload.success && action.payload.table) {
                    const index = state.tables.tables.findIndex(
                        table => table._id === action.payload.table._id
                    );
                    if (index !== -1) {
                        state.tables.tables[index] = action.payload.table;
                    }
                }
                state.operationError = null;
                console.log("✅ Table updated successfully:", action.payload.table);
            })
            .addCase(updateTable.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationError = action.payload;
            })

            // ===== DELETE TABLE =====
            .addCase(deleteTable.pending, (state) => {
                state.operationLoading = true;
                state.operationError = null;
            })
            .addCase(deleteTable.fulfilled, (state, action) => {
                state.operationLoading = false;
                // Remove table from the list
                if (action.payload.success && action.payload.id) {
                    state.tables.tables = state.tables.tables.filter(
                        table => table._id !== action.payload.id
                    );
                }
                state.operationError = null;
                console.log("✅ Table deleted successfully:", action.payload.id);
            })
            .addCase(deleteTable.rejected, (state, action) => {
                state.operationLoading = false;
                state.operationError = action.payload;
            });
    },
});

// ================= EXPORT ACTIONS =================
export const { clearTables, resetOperationStatus, clearError } = tableSlice.actions;

// ================= EXPORT REDUCER =================
export default tableSlice.reducer;