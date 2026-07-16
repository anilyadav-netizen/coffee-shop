// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     FaArrowLeft,
//     FaShoppingBag,
//     FaUser,
//     FaClock,
//     FaReceipt,
// } from "react-icons/fa";
// import { getOrderById } from "../../redux/Slicer/adminOrder";

// const AdminOrderDetailsPage = () => {
//     const { orderId } = useParams();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const { currentOrder, loading, error, orders} = useSelector(
//         (state) => state.adminOrder
//     );

//     useEffect(() => {
//         if (orderId) {
//             dispatch(getOrderById(orderId));
//         }
//     }, [dispatch, orderId]);

//     const handleBack = () => navigate("/admin/orders");

//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         const date = new Date(dateString);
//         return date.toLocaleString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     // Badge styles (same as Orders page)
//     const paymentBadge = {
//         paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
//         pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
//         failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//     };

//     const orderBadge = {
//         preparing:
//             "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//         packed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
//         shipped:
//             "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
//         delivered:
//             "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
//         pending:
//             "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
//         cancelled:
//             "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//     };

//     const orderTypeBadge = {
//         dine_in:
//             "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
//         takeaway:
//             "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//         delivery:
//             "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="w-10 h-10 border-4 border-[#3B82F6] dark:border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
//                 <p className="text-red-600 dark:text-red-400">
//                     Error loading order: {error}
//                 </p>
//                 <button
//                     onClick={handleBack}
//                     className="mt-4 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }

//     if (!currentOrder) {
//         return (
//             <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-12 text-center">
//                 <p className="text-[#64748B] dark:text-dark-text">
//                     No order data found.
//                 </p>
//                 <button
//                     onClick={handleBack}
//                     className="mt-4 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition"
//                 >
//                     Back to Orders
//                 </button>
//             </div>
//         );
//     }

//     const order = currentOrder;
//     const items = order.products || order.orderItems || [];
//     const total = order.amount || order.totalPrice || 0;
//     const customerName =
//         order.deliveryAddress?.fullName ||
//         order.user?.name ||
//         order.customerName ||
//         "Guest";
//     const address = order.deliveryAddress;
//     const paymentStatus =
//         order.paymentStatus || order.payment?.status || "pending";
//     const orderStatus = order.orderStatus || "pending";
//     const orderType = order.orderType || "dine_in";
//     const createdAt = order.createdAt || "";

//     return (
//         <div>
//             {/* Back button */}
//             <button
//                 onClick={handleBack}
//                 className="flex items-center gap-2 text-[#64748B] dark:text-dark-text hover:text-[#0F172A] dark:hover:text-dark-heading transition mb-6"
//             >
//                 <FaArrowLeft className="w-4 h-4" />
//                 <span>Back to Orders</span>
//             </button>

//             {/* Order Header */}
//             <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-6 mb-6">
//                 <div className="flex flex-wrap items-start justify-between gap-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading flex items-center gap-2">
//                             Order #{order._id?.slice(-6) || "N/A"}
//                         </h1>
//                         <p className="text-[#64748B] dark:text-dark-text mt-1 flex items-center gap-2">
//                             <FaClock className="w-4 h-4" />
//                             {formatDate(createdAt)}
//                         </p>
//                     </div>
//                     <div className="flex flex-wrap gap-3">
//                         <span
//                             className={`px-3 py-1.5 rounded-full text-sm font-medium ${orderBadge[orderStatus]}`}
//                         >
//                             {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
//                         </span>
//                         <span
//                             className={`px-3 py-1.5 rounded-full text-sm font-medium ${paymentBadge[paymentStatus]}`}
//                         >
//                             {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
//                         </span>
//                         <span
//                             className={`px-3 py-1.5 rounded-full text-sm font-medium ${orderTypeBadge[orderType]}`}
//                         >
//                             {orderType === "dine_in"
//                                 ? "Dine-in"
//                                 : orderType === "takeaway"
//                                     ? "Takeaway"
//                                     : "Delivery"}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Customer & Delivery Info */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#E2E8F0] dark:border-dark-border">
//                     <div>
//                         <h3 className="text-sm font-semibold text-[#64748B] dark:text-dark-text uppercase tracking-wide flex items-center gap-2 mb-2">
//                             <FaUser className="w-4 h-4" />
//                             Customer
//                         </h3>
//                         <p className="text-[#0F172A] dark:text-dark-heading font-medium">
//                             {customerName}
//                         </p>
//                         {address && (
//                             <>
//                                 <p className="text-[#64748B] dark:text-dark-text text-sm">
//                                     {address.street}, {address.city}, {address.state} -{" "}
//                                     {address.pincode}
//                                 </p>
//                                 <p className="text-[#64748B] dark:text-dark-text text-sm">
//                                     Phone: {address.phone || "N/A"}
//                                 </p>
//                             </>
//                         )}
//                     </div>
//                     <div>
//                         <h3 className="text-sm font-semibold text-[#64748B] dark:text-dark-text uppercase tracking-wide flex items-center gap-2 mb-2">
//                             <FaReceipt className="w-4 h-4" />
//                             Order Summary
//                         </h3>
//                         <p className="text-[#0F172A] dark:text-dark-heading">
//                             Total Items: <span className="font-bold">{items.length}</span>
//                         </p>
//                         <p className="text-[#0F172A] dark:text-dark-heading text-lg font-bold mt-1">
//                             Total: ₹{total.toFixed(2)}
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Order Items Table */}
//             <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm overflow-hidden">
//                 <div className="p-4 border-b border-[#E2E8F0] dark:border-dark-border flex items-center gap-2">
//                     <FaShoppingBag className="text-[#3B82F6] dark:text-[#60A5FA]" />
//                     <h2 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading">
//                         Order Items
//                     </h2>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full min-w-[600px]">
//                         <thead className="bg-[#F8FAFC] dark:bg-dark-bg/50">
//                             <tr>
//                                 <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">
//                                     #
//                                 </th>
//                                 <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">
//                                     Item
//                                 </th>
//                                 <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">
//                                     Quantity
//                                 </th>
//                                 <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">
//                                     Price
//                                 </th>
//                                 <th className="p-4 text-right text-sm font-medium text-[#64748B] dark:text-dark-text">
//                                     Subtotal
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {items.map((item, index) => {
//                                 const product = item.coffee || item.product || {};
//                                 const name = product.name || item.name || "Unknown Item";
//                                 const image = product.image || "";
//                                 const qty = item.quantity || item.qty || 1;
//                                 const price = item.price || product.price || 0;
//                                 const subtotal = price * qty;

//                                 return (
//                                     <tr
//                                         key={index}
//                                         className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition"
//                                     >
//                                         <td className="p-4 text-[#64748B] dark:text-dark-text">
//                                             {index + 1}
//                                         </td>
//                                         <td className="p-4 flex items-center gap-3">
//                                             {image && (
//                                                 <img
//                                                     src={image}
//                                                     alt={name}
//                                                     className="w-10 h-10 rounded object-cover border border-[#E2E8F0] dark:border-dark-border"
//                                                 />
//                                             )}
//                                             <span className="font-medium text-[#0F172A] dark:text-dark-heading">
//                                                 {name}
//                                             </span>
//                                         </td>
//                                         <td className="p-4 text-[#0F172A] dark:text-dark-heading">
//                                             {qty}
//                                         </td>
//                                         <td className="p-4 text-[#0F172A] dark:text-dark-heading">
//                                             ₹{price.toFixed(2)}
//                                         </td>
//                                         <td className="p-4 text-right font-semibold text-[#0F172A] dark:text-dark-heading">
//                                             ₹{subtotal.toFixed(2)}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                         <tfoot className="bg-[#F8FAFC] dark:bg-dark-bg/50">
//                             <tr>
//                                 <td
//                                     colSpan="4"
//                                     className="p-4 text-right font-medium text-[#0F172A] dark:text-dark-heading"
//                                 >
//                                     Grand Total
//                                 </td>
//                                 <td className="p-4 text-right font-bold text-lg text-[#0F172A] dark:text-dark-heading">
//                                     ₹{total.toFixed(2)}
//                                 </td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminOrderDetailsPage;