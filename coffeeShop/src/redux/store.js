import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slicer/authSlice'
import cartReducer from './Slicer/cartSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
    }
})