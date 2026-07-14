import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slicer/authSlice'
import cartReducer from './Slicer/cartSlice'
import wishlistReducer from './Slicer/wishlistSlice'
import adminProductReducer from './Slicer/adminProductSlice'
import paymentReducer from './Slicer/paymentSlice'
import categoryReducer from './Slicer/categorySlice'
import adminReducer from './Slicer/adminOrder'
import orderReducer from './Slicer/orderSlice'
import userReducer from './Slicer/userSlice'
import tableReducer from './Slicer/tableSlice'
import addressReducer from './Slicer/addressSlice'
import riderAssignmentReducer from './Slicer/riderAssignmentSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        adminProducts: adminProductReducer,
        payment: paymentReducer,
        category: categoryReducer,
        adminOrder: adminReducer,
        orderStatus: orderReducer,
        getUser: userReducer,
        table: tableReducer,
        address: addressReducer,
        riderAssignment: riderAssignmentReducer
    }
})