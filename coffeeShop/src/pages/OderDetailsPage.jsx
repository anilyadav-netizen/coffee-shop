import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const OderDetailsPage = () => {
    const { id } = useParams();

    // 🔥 Later yaha reducer / API se data aayega
    const order = null; // temporary placeholder
    const loading = false;

    useEffect(() => {
        // TODO:
        // dispatch(fetchOrderById(id))
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: "20px" }}>
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Order Details</h2>
                <p>No order found or data not loaded yet.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2>🧾 Order Details</h2>

            {/* Order Info */}
            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <p><b>Order ID:</b> {order._id}</p>
                <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
                <p><b>Payment ID:</b> {order.paymentId}</p>
                <p><b>Status:</b> {order.orderStatus}</p>
                <p><b>Date:</b> {order.createdAt}</p>
            </div>

            {/* Items Section */}
            <h3>🛒 Purchased Items</h3>

            <div>
                {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #eee",
                                padding: "12px",
                                marginBottom: "10px",
                                borderRadius: "8px",
                            }}
                        >
                            <p><b>Name:</b> {item.name}</p>
                            <p><b>Quantity:</b> {item.quantity}</p>
                            <p><b>Price:</b> ₹{item.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No items found in this order.</p>
                )}
            </div>
        </div>
    );
};

export default OderDetailsPage;