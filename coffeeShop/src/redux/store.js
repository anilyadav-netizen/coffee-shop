import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slicer/authSlice'
import cartReducer from './Slicer/cartSlice'
import wishlistReducer from './Slicer/wishlistSlice'
import adminProductReducer from './Slicer/adminProductSlice'
import paymentReducer from './Slicer/paymentSlice'
import categoryReducer from './Slicer/categorySlice'
import adminReducer from './Slicer/adminOrder'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        adminProducts: adminProductReducer,
        payment: paymentReducer,
        category: categoryReducer,
        adminOrder: adminReducer
    }
})