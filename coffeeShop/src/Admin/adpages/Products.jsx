import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../../redux/Slicer/adminProductSlice";
import { toast } from "react-toastify";

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, totalProducts } = useSelector(
        (state) => state.adminProducts
    );
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
                .unwrap()
                .then(() => {
                    toast.success("Product deleted successfully!");
                })
                .catch((error) => {
                    toast.error(error || "Failed to delete product");
                });
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/update-product/${id}`);
    };

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[#4F46E5] dark:border-dark-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 md:p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] dark:text-dark-heading">
                        Products
                    </h1>
                    <p className="text-base text-[#64748B] dark:text-dark-text">
                        Total {totalProducts} products
                    </p>
                </div>

                <Link
                    to="/admin/add-product"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4F46E5] dark:bg-dark-primary text-white rounded-xl hover:bg-[#4338CA] dark:hover:bg-[#6366F1] transition-colors duration-200 text-base md:text-lg"
                >
                    <FaPlus />
                    Add Product
                </Link>
            </div>

            {/* Filters - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2 md:gap-4 text-base md:text-lg text-[#64748B] dark:text-dark-text">
                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">All ({products.length})</span>
                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">
                        In Stock ({products.filter((p) => p.stock > 0).length})
                    </span>
                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">
                        Out Of Stock ({products.filter((p) => p.stock === 0).length})
                    </span>
                </div>

                <div className="w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text" />
                        <input
                            type="text"
                            placeholder="Search Product"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[200px] md:w-[250px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-md outline-none text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-base bg-white dark:bg-dark-bg"
                        />
                    </div>
                </div>
            </div>

            {/* Table with Horizontal Scroll */}
            <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-lg">
                <table className="w-full min-w-[750px]">
                    <thead>
                        <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Image</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Name</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Price</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Stock</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Status</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                                >
                                    <td className="p-2 md:p-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover"
                                        />
                                    </td>

                                    <td className="p-2 md:p-4 font-medium text-[#0F172A] dark:text-dark-heading text-base md:text-lg">
                                        {product.name}
                                    </td>

                                    <td className="p-2 md:p-4 text-[#0F172A] dark:text-dark-heading text-base md:text-lg whitespace-nowrap">
                                        ₹{product.price}
                                    </td>

                                    <td className="p-2 md:p-4">
                                        <span
                                            className={`px-2 py-1 text-sm border rounded-md ${product.stock === 0
                                                ? "text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
                                                : "text-[#0F172A] dark:text-dark-heading border-[#E2E8F0] dark:border-dark-border"
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>

                                    <td className="p-2 md:p-4">
                                        <span
                                            className={`px-2 py-1 text-sm font-medium rounded-full ${product.status === "active"
                                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                                                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                                                }`}
                                        >
                                            {product.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="p-2 md:p-4">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <button
                                                onClick={() => handleEdit(product._id)}
                                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-md hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200"
                                                title="Edit Product"
                                            >
                                                <FaEye className="text-[#4F46E5] dark:text-dark-primary text-sm md:text-base" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-md text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                                                title="Delete Product"
                                            >
                                                <FaTrash className="text-sm md:text-base" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-[#64748B] dark:text-dark-text text-base">
                                    No Products Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;