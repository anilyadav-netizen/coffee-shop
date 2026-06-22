import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slicer/authSlice'
import cartReducer from './Slicer/cartSlice'
import wishlistReducer from './Slicer/wishlistSlice'
import adminProductReducer from './Slicer/adminProductSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        adminProducts: adminProductReducer
    }
})